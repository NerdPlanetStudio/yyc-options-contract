# 신청할 때마다 Storage 엑셀에 한 줄씩 쌓이게 하기

정적 사이트만으로는 불가능합니다. **아래 순서를 끝까지** 하면 `applications` 에 INSERT 될 때마다 Storage 의 **한 개 xlsx 파일**이 자동으로 늘어납니다.

---

## 0) 준비물

- Supabase 프로젝트 **ref** (URL `https://abcd1234.supabase.co` 의 `abcd1234`)
- 로컬에 **Supabase CLI** 설치·`supabase login` · `supabase link` 완료
- 배포된 사이트 주소 (템플릿 URL용): `https://당신-도메인/templates/yyc-contract-pivot-template.xlsx`

---

## 1) Storage 버킷 만들기 (택1)

**A. 대시보드**  
Storage → New bucket → 이름 `application-workbook` → **Public** 체크(관리자가 URL로 받으려면 필요).

**B. SQL**  
SQL Editor 에서 `supabase/sql/storage_application_workbook_bucket.sql` 전체 실행.

---

## 2) 첫 워크북 파일 올리기

Storage → `application-workbook` → **Upload**

- 파일 이름: **`yyc-contract-live.xlsx`**
- 내용: 지금 쓰는 **복사본 엑셀**(시트 `옵션 신청 현황`, 1행 헤더 동일) 그대로.

(비어 있으면 Edge 가 `TEMPLATE_PUBLIC_URL` 로 받아 첫 파일을 만들 수도 있지만, **미리 올려 두는 편이 안전**합니다.)

---

## 3) Edge Function 비밀·환경변수 설정

터미널 (프로젝트 루트, `supabase link` 된 상태):

```bash
# 웹훅과 반드시 같은 값으로 임의 문자열 생성 (예: openssl rand -hex 32)
supabase secrets set WORKBOOK_WEBHOOK_SECRET="여기에_긴_비밀문자열"

supabase secrets set WORKBOOK_BUCKET="application-workbook"
supabase secrets set WORKBOOK_OBJECT_KEY="yyc-contract-live.xlsx"

# Storage 에 파일이 없을 때 템플릿을 받아올 주소 (배포된 사이트)
supabase secrets set TEMPLATE_PUBLIC_URL="https://당신-도메인/templates/yyc-contract-pivot-template.xlsx"
```

---

## 4) Edge Function 배포

```bash
supabase functions deploy append-workbook-row --no-verify-jwt
```

배포 후 주소는 고정입니다:

`https://<project-ref>.supabase.co/functions/v1/append-workbook-row`

---

## 5) Database Webhook 연결 (핵심)

Supabase Dashboard → **Database** → **Webhooks** → **Create a new hook**

| 항목 | 값 |
|------|-----|
| Name | 예: `append-workbook-on-insert` |
| Table | `public` / `applications` |
| Events | **Insert** 만 체크 |
| Type | Supabase Edge Functions 가 아니라 **HTTP Request** (일반 HTTP) |
| Method | `POST` |
| URL | `https://<project-ref>.supabase.co/functions/v1/append-workbook-row` |
| HTTP Headers | `Content-Type` = `application/json` |
| HTTP Headers | `x-workbook-secret` = **3번에서 넣은 `WORKBOOK_WEBHOOK_SECRET` 과 완전히 동일** |

저장 후 **테스트**: 신청 한 건 넣고 Storage 의 `yyc-contract-live.xlsx` 가 바뀌는지(행 수·수정 시각) 확인.

---

## 6) 관리자가 “누적본만” 받고 싶을 때 (선택)

배포 환경 변수에 **공개** 워크북 직접 URL:

`VITE_LIVE_WORKBOOK_URL=https://<project-ref>.supabase.co/storage/v1/object/public/application-workbook/yyc-contract-live.xlsx`

→ 관리자 **엑셀 내려받기**는 이 파일을 그대로 저장합니다.

---

## 7) SQL을 다시 돌려야 하나?

- **이 엑셀 누적 기능만** 쓰려면: 위 **1~5** 가 전부입니다. **`submit_application.sql` 을 다시 실행할 필요는 없습니다** (예전에 이미 맞게 올려 두었다면).
- **RPC·테이블을 우리가 바꾼 SQL이 아직 DB에 없다**면: 그때만 해당 `.sql` 을 SQL Editor 에서 실행하면 됩니다.

---

## 8) (비권장) 웹훅 대신 브라우저에서 호출

비밀 문자열이 **프론트 번들에 노출**됩니다. 내부 테스트용으로만:

`VITE_APPEND_WORKBOOK_ON_SUBMIT=1`  
`VITE_WORKBOOK_APPEND_URL` = 위 Edge URL  
`VITE_WORKBOOK_APPEND_SECRET` = `WORKBOOK_WEBHOOK_SECRET` 과 동일  

운영은 **5번 웹훅**만 쓰는 것을 권장합니다.

---

## 동작 요약

`applications` **INSERT** → Webhook → Edge 가 Storage 에서 `yyc-contract-live.xlsx` 다운로드 → **`옵션 신청 현황`** 시트(구 `Sheet1 (2)` 도 인식) 맨 아래에 **1행 추가** → 다시 **upsert** 저장.
