# 12장. 신청 들어올 때마다 엑셀에 자동 누적

> **이 장에서 완성하는 것**  
> 11장에서 `applications` 에 **INSERT** 될 때마다 → Storage 의 `yyc-contract-live_V1.xlsx` **피벗 시트** 마지막에 한 줄 추가.  
> 관리자는 항상 "지금까지 모든 신청" 이 들어찬 엑셀 1개를 받게 됩니다.  
>
> **선행**: 11장 (`submit_application` RPC + 테이블 스키마) 완료  
> **소요 시간**: 약 2.5시간  
> **난이도**: ★★★★ (Edge Function 첫 등장)

---

## 12-1. 미리 알아두기

| 용어 | 1줄 비유 |
|------|---------|
| **Storage 버킷** | Supabase 안의 클라우드 폴더 |
| **Edge Function** | DB 옆 작은 알바 — `append-workbook-row` |
| **Database Webhook** | `applications` 에 행이 생기면 알바에게 POST |
| **피벗 시트** | 옵션 종류마다 **열**이 나뉜 엑셀 (한 신청 = 한 행) |
| **`selected_options`** | 11장 JSON 배열 — 함수가 열 금액으로 펼침 |
| **WORKBOOK_WEBHOOK_SECRET** | Webhook ↔ 함수 사이 출입 비밀번호 |

전체 흐름 (11장과 이어짐):

```
[사용자 step 2 「신청완료」]
  → next_yyc_receipt_no
  → submit_application({ payload })
  → applications INSERT
       → Database Webhook (Insert)
            → POST …/functions/v1/append-workbook-row
                 → Storage xlsx 다운로드
                 → selected_options 를 피벗 열에 합산
                 → 마지막 데이터 행 다음에 1줄 추가 → 다시 업로드
```

Webhook 이 보내는 `record` 는 **DB에 저장된 한 행** 과 같습니다.  
예전 교재 필드(`options`, `total_amount`, `resident_id_first6` …)는 **쓰지 않습니다.**

| DB / Webhook `record` | 엑셀에 쓰이는 곳 |
|----------------------|------------------|
| `receipt_no` | 접수번호 |
| `unit_type` | 타입 |
| `dong`, `ho` | 동, 호수 |
| `customer_name` | 계약자 |
| `phone` (뒷 4자리) | 휴대폰 번호 4자리 |
| `selected_options` | 시트판넬 ~ 스마트복합환풍기 열 (금액) |
| `total_price` | 총액 |

---

## 12-2. Storage 버킷·템플릿 준비

### (1) Supabase **Storage** → **New bucket**

| 항목 | 값 |
|------|-----|
| Name | `application-workbook` |
| Public bucket | ⛔ **OFF** |

### (2) 피벗 템플릿 엑셀

시트 이름은 아래 **둘 중 하나** (코드가 순서대로 찾음):

- `옵션 신청 현황` (권장)
- `Sheet1 (2)`

**1행 헤더**는 `supabase/functions/append-workbook-row/index.ts` 의 `HEADERS` 와 **글자 하나까지** 같아야 합니다.

| 열 | 헤더 (1행) |
|----|------------|
| A~H | 순번, 접수번호, 용도, 타입, 동, 호수, 계약자, 휴대폰 번호 4자리 |
| I~Z | 시트판넬, 거실 마감재 특화, 욕실 마감재 특화, 주방 마감 및 가구 특화, 드레스룸 특화, 붙박이장(침실1~3), 인덕션(3구), 빌트인오븐, 식기세척기, 냉장고패키지, 시스템에어컨, 비데일체형 양변기(욕실1~2), 비데(욕실1~2), 스마트복합환풩기 |
| AA | 총액 |

- **2행 이후는 비움** (샘플 데이터 넣지 않기 — 15장 초기화 시 헷갈림).
- 파일명: **`yyc-contract-live_V1.xlsx`**

> 💡 가장 빠른 방법: 운영에서 쓰는 피벗 엑셀을 복사해 **데이터만 지우고** 1행 헤더만 남긴 뒤 업로드.

### (3) 버킷에 업로드

Storage → `application-workbook` → **Upload** → `yyc-contract-live_V1.xlsx`

---

## 12-3. Edge Function (레포에 이미 있음)

Cursor에서 확인:

```
supabase/functions/append-workbook-row/index.ts
supabase/config.toml
```

**새 프로젝트를 1장부터 만든 경우**에도, 이 레포를 clone 했다면 **파일을 새로 짤 필요 없습니다.**  
내용만 아래와 맞는지 눈으로 확인하세요.

- `Deno.serve` + `x-workbook-secret` 검증
- `body.record` (Webhook INSERT 본문) 읽기
- `selected_options` → `option_id` / `category` / `label` 로 피벗 열 인덱스 계산
- 시트 `옵션 신청 현황` 또는 `Sheet1 (2)`
- 용도 열 고정값: **`도시형생활주택`**

`supabase/config.toml` (JWT 끔 — Webhook 용):

```toml
[functions.append-workbook-row]
verify_jwt = false
```

> 부록 **B-1** 에도 요약이 있습니다. 전체 소스는 위 `index.ts` 가 정본입니다.

---

## 12-4. Supabase CLI + 시크릿 + 배포

### (1) CLI (한 번만)

```bash
npm install -g supabase
supabase --version
```

### (2) 로그인·연결

```bash
supabase login
supabase link --project-ref abcd1234
```

(`abcd1234` = 대시보드 URL `https://abcd1234.supabase.co` 의 Ref)

### (3) 시크릿

12-5 Webhook 헤더와 **같은** 비밀번호를 메모해 두세요.

```bash
supabase secrets set WORKBOOK_WEBHOOK_SECRET="원하는비밀번호16자이상"
supabase secrets set WORKBOOK_BUCKET="application-workbook"
supabase secrets set WORKBOOK_OBJECT_KEY="yyc-contract-live_V1.xlsx"
```

Storage 에 아직 xlsx 가 없으면 (15장 초기화용):

```bash
supabase secrets set TEMPLATE_PUBLIC_URL="https://내아이디.github.io/yyc-options/templates/피벗템플릿.xlsx"
```

### (4) 배포

```bash
cd /경로/yyc-options
supabase functions deploy append-workbook-row --no-verify-jwt
```

✅ `Deployed Function`  
⚠️ `not in a project directory` → `cd` 로 프로젝트 루트 이동 후 재실행.

---

## 12-5. Database Webhook

**Database → Webhooks → Create a new hook**

| 항목 | 값 |
|------|-----|
| Name | `applications-insert-to-workbook` |
| Table | `applications` |
| Events | ✅ **Insert** 만 |
| Type | HTTP Request |
| Method | POST |
| URL | `https://abcd1234.supabase.co/functions/v1/append-workbook-row` |
| HTTP Headers | `x-workbook-secret` = 12-4 에서 정한 비밀번호 |

Supabase 가 보내는 JSON 예시 (일부):

```json
{
  "type": "INSERT",
  "table": "applications",
  "record": {
    "receipt_no": "YYC-20260516001",
    "customer_name": "홍길동",
    "phone": "5678",
    "dong": "101",
    "ho": "1201",
    "unit_type": "55A",
    "selected_options": [
      { "option_id": "a_ind", "category": "주방", "label": "인덕션", "price": 500000 }
    ],
    "total_price": 500000,
    "status": "접수됨"
  }
}
```

함수는 `record.selected_options` 와 `record.total_price` 만 사용합니다.  
`signature_data_url` 은 엑셀에 넣지 않습니다 (DB·관리자 화면용).

---

## 12-6. 끝부터 끝까지 시험

1. 앱에서 **11장과 동일하게** 신청 1건 제출 (`step 2` 신청완료).  
2. Supabase **Table Editor** → `applications` 최신 행 확인.  
3. **Storage** → `application-workbook` → `yyc-contract-live_V1.xlsx` **Updated** 시간이 방금인지.  
4. xlsx 다운로드 → 마지막 행에 접수번호·동·호·옵션 열 금액·총액이 맞는지.  
5. **Edge Functions → append-workbook-row → Logs** 에 `200` + `{"ok":true,...}`.

✅ 되면 14장(관리자 다운로드)에서 같은 파일을 **서명 URL** 로 받게 합니다.

---

## 12-7. 자주 나는 에러

| 화면 / 로그 | 원인 | 해결 |
|-------------|------|------|
| 401 `unauthorized` | secret 불일치 | `secrets set` + Webhook 헤더 동일 값 |
| 400 `missing record` | Webhook 본문 없음 / 테이블 잘못 | Insert + `applications` 인지 |
| 422 `header mismatch on pivot sheet` | 1행 헤더 ≠ 코드 `HEADERS` | 12-2 표대로 1행 수정 후 재업로드 |
| 422 `pivot sheet missing` | 시트 이름 다름 | `옵션 신청 현황` 또는 `Sheet1 (2)` |
| 422 `workbook missing…` | 버킷에 파일 없음 | xlsx 업로드 또는 `TEMPLATE_PUBLIC_URL` |
| 500 storage upload | 버킷명·권한 | `application-workbook`, service_role |
| Webhook OK인데 열 비어 있음 | `selected_options` 빈 배열 | 앱에서 옵션 선택 후 재신청 |
| 옵션 열은 있는데 총액만 0 | `total_price` 미저장 | 11장 `submit_application.sql` 재실행 |

---

## 12-8. 완료 체크리스트

- [ ] 11장: `submit_application` INSERT 가 Table Editor 에 보인다
- [ ] `application-workbook` 비공개 버킷 + 피벗 헤더만 있는 xlsx
- [ ] `append-workbook-row` 배포 + `verify_jwt = false`
- [ ] Webhook 1개 (Insert + URL + `x-workbook-secret`)
- [ ] 신청 1건 → xlsx 마지막 행 + Functions Logs 200

---

## 12-9. 보안 메모

- 버킷은 **비공개**. URL 만으로는 다운로드 불가 → 14장 **sign-application-workbook**.  
- Webhook ↔ 함수는 `WORKBOOK_WEBHOOK_SECRET` 만 신뢰.  
- 함수 내부의 **service_role** 은 Supabase secrets 에만 두고, GitHub Pages·프런트에 넣지 않습니다.

---

> 💪 **10·11·12 묶음**  
> 신청 한 번 → DB 저장 → **피벗 엑셀 자동 누적** 까지 한 바퀴가 돕니다.  
> 다음: **13장** `#/admin` 관리자 목록 → **14장** 누적 xlsx 다운로드.
