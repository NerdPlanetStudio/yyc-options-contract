# 신청 시 엑셀(워크북) 자동 누적 — Supabase Storage + Edge Function

브라우저만으로는 `public/` 안의 정적 xlsx 파일을 **수정 저장**할 수 없습니다.  
고객이 신청할 때마다 **한 파일에 행이 쌓이게** 하려면 Supabase **Storage**에 두는 워크북을, **Edge Function**이 한 줄씩 붙이는 방식으로 처리합니다.

## 1) Storage 버킷

1. Supabase Dashboard → **Storage** → New bucket  
   - 이름 예: `application-workbook`  
   - **Public** 으로 두면 URL만으로 내려받기 가능(개인정보 노출 주의). 비공개면 관리자 다운로드는 아래 `VITE_LIVE_WORKBOOK_URL` 대신 서명 URL 방식을 따로 써야 합니다.
2. 객체 경로 예: `yyc-contract-live.xlsx`  
   - 처음에는 로컬 `public/templates/yyc-contract-pivot-template.xlsx` 와 동일한 파일을 업로드해 두면 됩니다.

## 2) Edge Function 배포

프로젝트 루트에서 (Supabase CLI 로그인·링크 후):

```bash
supabase secrets set WORKBOOK_WEBHOOK_SECRET="임의의 긴 문자열"
supabase secrets set WORKBOOK_BUCKET="application-workbook"
supabase secrets set WORKBOOK_OBJECT_KEY="yyc-contract-live.xlsx"
# Storage 에 파일이 아직 없을 때만: 배포된 사이트의 템플릿 전체 URL
supabase secrets set TEMPLATE_PUBLIC_URL="https://<your-site>/templates/yyc-contract-pivot-template.xlsx"

supabase functions deploy append-workbook-row --no-verify-jwt
```

`WORKBOOK_WEBHOOK_SECRET` 은 Database Webhook 과 동일하게 맞춥니다.

## 3) Database Webhook (권장)

Dashboard → **Database** → **Webhooks** → Create:

- **Table**: `public.applications`
- **Events**: Insert
- **HTTP Request**  
  - URL: `https://<project-ref>.supabase.co/functions/v1/append-workbook-row`  
  - Method: `POST`  
  - Headers:  
    - `Content-Type`: `application/json`  
    - `x-workbook-secret`: (위에서 설정한 `WORKBOOK_WEBHOOK_SECRET` 과 동일 값)

Supabase 가 보내는 본문에 `record` 가 포함되며, 함수는 `Sheet1 (2)` 에 한 행을 추가한 뒤 같은 Storage 경로에 **upsert** 합니다.

## 4) 프론트 환경 변수 (선택)

| 변수 | 설명 |
|------|------|
| `VITE_LIVE_WORKBOOK_URL` | Storage **공개** 워크북의 직접 URL. 설정 시 관리자 **엑셀 내려받기**는 이 파일을 그대로 받습니다(이미 신청마다 누적된 상태). |
| `VITE_APPEND_WORKBOOK_ON_SUBMIT` | `1` 이면 신청 완료 직후 브라우저가 Edge URL 을 한 번 호출합니다. |
| `VITE_WORKBOOK_APPEND_URL` | `https://<ref>.supabase.co/functions/v1/append-workbook-row` |
| `VITE_WORKBOOK_APPEND_SECRET` | `WORKBOOK_WEBHOOK_SECRET` 과 동일 — **번들에 노출**되므로 내부·저트래픽 전용. 가능하면 **Webhook 만** 쓰고 이 옵션은 비워 두세요. |

Webhook 을 쓰면 `VITE_APPEND_*` 는 필요 없습니다.

## 5) 동작 요약

- **Webhook (또는 선택적 클라이언트 호출)** → Edge Function 이 `yyc-contract-live.xlsx` 를 읽고 `Sheet1 (2)` 맨 아래에 **해당 신청 1행** 추가 후 다시 저장합니다.
- 관리자가 **최신 누적본**만 받고 싶으면 `VITE_LIVE_WORKBOOK_URL` 에 공개 객체 URL을 넣습니다.
- Webhook 없이 클라이언트만 켜면 비밀 키가 노출될 수 있으니, 운영은 Webhook 을 권장합니다.
