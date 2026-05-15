# 부록 C. 환경변수·시크릿 전체 표 (어디에 무엇을 두는가)

> **이 부록의 용도**  
> "어떤 키를 어디에 두라고 했지?" 가 한 페이지에. 보안 사고는 80%가 '잘못된 위치에 둔 키' 에서 나옵니다.

---

## C-1. 한눈에 보는 표

| 키 이름 | 어디에 두나 | 누가 보나 | 사용처 |
|---------|-------------|-----------|--------|
| **VITE_SUPABASE_URL** | `.env.local` (로컬) + GitHub Secret | 누구나 (빌드 후 클라에 박힘) | 프런트엔드 |
| **VITE_SUPABASE_ANON_KEY** | `.env.local` + GitHub Secret | 누구나 | 프런트엔드 |
| **VITE_BASE** | `.github/workflows/pages.yml` 의 env | 빌드 단계 | Vite base 경로 |
| **SUPABASE_SERVICE_ROLE_KEY** | **Supabase secrets** + GitHub Secret(백업용만) | ⚠️ 개발자만 | Edge Function · 백업 워크플로우 |
| **WORKBOOK_WEBHOOK_SECRET** | Supabase secrets + Database Webhook 헤더 | ⚠️ 개발자만 | append-workbook-row 인증 |
| **WORKBOOK_BUCKET** | Supabase secrets | 보통 | 함수들 |
| **WORKBOOK_OBJECT_KEY** | Supabase secrets | 보통 | 함수들 |
| **TEMPLATE_PUBLIC_URL** | Supabase secrets | 공개 OK | reset-application-workbook |
| **WORKBOOK_RESET_ALLOWED_EMAILS** | Supabase secrets | 보통 | sign·reset 함수 |
| **DB Password** | 본인 메모장 (오프라인) | 본인만 | DB 직접 접속 시 |
| **관리자(admin@admin.com) 비번** | 회사 비밀번호 금고 | 인수인계 대상 | 관리자 로그인 |

---

## C-2. 절대 두면 안 되는 위치 (자주 실수)

| 키 | 절대 X 위치 | 이유 |
|----|-------------|------|
| `SUPABASE_SERVICE_ROLE_KEY` | 코드, README, 메일, 메신저, `VITE_*` 환경변수 | DB 풀권한. 누설 즉시 모든 데이터 위험 |
| `WORKBOOK_WEBHOOK_SECRET` | 코드, README | 웹훅 위장 가능 |
| `DB Password` | GitHub, Slack, 메일 | DB 직접 접근 가능 |
| 관리자 비밀번호 | 평문 메모, 공유 문서 | 어떤 백업·관리 작업도 가능 |

---

## C-3. 키 회전(주기적으로 바꾸기) 체크리스트

| 키 | 주기 | 절차 |
|----|------|------|
| 관리자 비번 | 분기 1회 | Supabase Auth → Users → Reset password |
| `service_role` | 6개월 1회·노출 의심 시 즉시 | Project Settings → API → Reset → Supabase secrets · GitHub Secret 둘 다 갱신 → CI 재실행 |
| `WORKBOOK_WEBHOOK_SECRET` | 노출 의심 시 | Supabase secrets 갱신 + Database Webhook 헤더 같은 값으로 |
| anon key | 회전 거의 X (필요 시 가능) | Reset 후 `.env`/Secret 갱신 |
| DB Password | 6개월 1회 | Settings → Database → Reset password (직접 접속 도구 다 갱신) |

---

## C-4. 빠른 점검 명령

```bash
# 어떤 시크릿이 등록되어 있는지
supabase secrets list

# Edge Function 목록
supabase functions list

# 로컬 환경변수가 잡히는지
echo $VITE_SUPABASE_URL    # zsh
```

⚠️ Supabase secret **값 자체는 다시 못 봅니다.** 메모장 따로 보관 필수.
