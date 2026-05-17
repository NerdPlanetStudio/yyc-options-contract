# 부록 B. 모든 Edge Function 코드 모음

> **이 부록의 용도**  
> 함수 3개를 한 번에 다시 깔거나, 다른 Supabase 프로젝트로 이식할 때.  
> 모두 `supabase/functions/<이름>/index.ts` 위치.

---

## B-0. `supabase/config.toml`

```toml
[functions.append-workbook-row]
verify_jwt = false

[functions.reset-application-workbook]
verify_jwt = false

[functions.sign-application-workbook]
verify_jwt = false
```

---

## B-1. `append-workbook-row/index.ts` (12장)

**정본**: 레포 `supabase/functions/append-workbook-row/index.ts` 전체를 복사·배포하세요.  
(교재에 긴 코드를 붙이지 않습니다 — 11장 `selected_options` 피벗 로직이 자주 바뀝니다.)

요약:

| 항목 | 값 |
|------|-----|
| 인증 | Header `x-workbook-secret` = `WORKBOOK_WEBHOOK_SECRET` |
| 입력 | Webhook `body.record` (`applications` INSERT 행) |
| 시트 | `옵션 신청 현황` 또는 `Sheet1 (2)` |
| 용도 열 | `도시형생활주택` 고정 |
| 옵션 | `record.selected_options` → 18개 옵션 열에 `price` 합산 |
| 합계 | `record.total_price` → `총액` |
| Storage | `WORKBOOK_BUCKET` / `WORKBOOK_OBJECT_KEY` (기본 `application-workbook` / `yyc-contract-live_V1.xlsx`) |

1행 `HEADERS` 는 12장 표와 `index.ts` 상단 배열이 같아야 합니다.

---

## B-2. `sign-application-workbook/index.ts` (14장)

**정본**: `supabase/functions/sign-application-workbook/index.ts`

| 항목 | 내용 |
|------|------|
| 메서드 | POST + `Authorization: Bearer <access_token>` |
| 검증 | `auth.getUser(jwt)` + (선택) `WORKBOOK_RESET_ALLOWED_EMAILS` |
| 응답 | `{ "signedUrl": "…", "expiresIn": 60 }` (앱은 `signedUrl` 사용) |
| 대상 | `WORKBOOK_BUCKET` / `WORKBOOK_OBJECT_KEY` 누적 xlsx |

---

## B-3. `reset-application-workbook/index.ts` (15장)

**정본**: `supabase/functions/reset-application-workbook/index.ts`

| 항목 | 내용 |
|------|------|
| 메서드 | POST + Bearer JWT |
| 동작 | `TEMPLATE_PUBLIC_URL` GET → Storage `WORKBOOK_OBJECT_KEY` upsert |
| SQL | `supabase/sql/admin_clear_all_applications.sql` (DB·카운터) |

---

## B-4. 한 번에 배포 (CLI 명령 묶음)

```bash
cd /경로/yyc-options
supabase link --project-ref __PROJECT_REF__

# 시크릿 (한 번에)
supabase secrets set \
  WORKBOOK_WEBHOOK_SECRET="원하는비밀번호16자이상" \
  WORKBOOK_BUCKET="application-workbook" \
  WORKBOOK_OBJECT_KEY="yyc-contract-live_V1.xlsx" \
  TEMPLATE_PUBLIC_URL="https://__GITHUB_ID__.github.io/yyc-options/templates/yyc-contract-pivot-template.xlsx" \
  WORKBOOK_RESET_ALLOWED_EMAILS="admin@admin.com"

# 함수 3개 배포
supabase functions deploy append-workbook-row     --no-verify-jwt
supabase functions deploy sign-application-workbook --no-verify-jwt
supabase functions deploy reset-application-workbook --no-verify-jwt
```
