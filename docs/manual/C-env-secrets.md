# 부록 C. 환경변수·시크릿 (어디에 무엇을 둘까)

---

## C-1. 표

| 키 | 위치 | 노출 | 용도 |
|----|------|------|------|
| `VITE_SUPABASE_URL` | `.env.local` + GitHub Secret | 빌드 후 공개 | 프런트 REST/RPC |
| `VITE_SUPABASE_ANON_KEY` | `.env.local` + GitHub Secret | 빌드 후 공공개 | 프런트 |
| `VITE_BASE` | `pages.yml` `/${{ repository.name }}/` | — | Vite base |
| `SUPABASE_SERVICE_ROLE_KEY` | GitHub Secret **만** (백업) | 비공개 | `backup-workbook.yml` |
| `WORKBOOK_WEBHOOK_SECRET` | Supabase secrets + Webhook 헤더 | 비공개 | append-workbook-row |
| `WORKBOOK_BUCKET` | Supabase secrets | — | Edge 3종 |
| `WORKBOOK_OBJECT_KEY` | Supabase secrets | — | `yyc-contract-live_V1.xlsx` |
| `TEMPLATE_PUBLIC_URL` | Supabase secrets | 공개 URL OK | reset·append 폴백 |
| `WORKBOOK_RESET_ALLOWED_EMAILS` | Supabase secrets | — | sign·reset JWT 함수 |

### 로컬만 (운영 기본 OFF)

| 키 | 용도 |
|----|------|
| `VITE_APPEND_WORKBOOK_ON_SUBMIT=1` | Webhook 대신 프런트에서 append 호출 (비권장, secret 노출) |
| `VITE_WORKBOOK_APPEND_URL` / `VITE_WORKBOOK_APPEND_SECRET` | 위와 쌍 |
| `VITE_ADMIN_XLS_TEMPLATE_ONLY=1` | Storage 대신 `public/templates/` 병합 디버그 |

`.env.example` 참고.

---

## C-2. 절대 넣지 말 것

| 키 | 금지 위치 |
|----|-----------|
| `service_role` | `VITE_*`, README, 채팅 |
| `WORKBOOK_WEBHOOK_SECRET` | 코드·Pages |
| DB 비밀번호 | GitHub |

---

## C-3. 회전

| 키 | 시점 |
|----|------|
| 관리자 비번 | 분기 |
| service_role | 6개월·유출 시 → GitHub Secret + Supabase secrets |
| WORKBOOK_WEBHOOK_SECRET | 유출 시 → secrets + Webhook 헤더 |

---

## C-4. 점검

```bash
supabase secrets list
supabase functions list
```

Secret 값은 재조회 불가 — 별도 메모장 보관.
