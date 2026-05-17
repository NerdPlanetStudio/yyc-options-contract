# 장애 시 첫 30분 행동표 — 옵션 신청 시스템

| # | 증상 | 1차 확인 | 1차 조치 | 입주민 안내 문구 (예) |
|---|------|----------|----------|------------------------|
| 1 | **사이트 흰 화면** | F12 Console 빨간 줄; GitHub Actions Pages ✅ 여부 | `vite` base = `/레포이름/`; 16장 Re-run | "잠시 후 다시 접속해 주세요." |
| 2 | **신청완료 시 일시 오류** | Supabase Status; RPC `submit_application` 존재 | 11장 SQL 재실행; anon 키 Secret | "접수 처리 중 오류입니다. 잠시 후 다시 시도해 주세요." |
| 3 | **관리자 로그인 전부 실패** | Auth Users에 계정·Auto Confirm | 비밀번호 Reset; Email signup OFF 유지 | (내부만) |
| 4 | **관리자 목록 0건** (신청은 들어옴) | Table Editor에 `applications` 행 있음 | `app_admins` 이메일; 17장 RLS SQL | (내부만) |
| 5 | **엑셀 다운로드 401/403** | `sign-application-workbook` 배포; `WORKBOOK_RESET_ALLOWED_EMAILS` | 14장 secrets·재배포 | (내부만) |
| 6 | **엑셀에 새 줄 안 쌓임** | Webhook Insert 활성; Functions Logs 401/422 | 12장 secret·헤더·피벗 헤더 | "접수는 완료되었습니다." (DB에는 있을 수 있음) |
| 7 | **Supabase 장애** | status.supabase.com | 복구 대기; 신청 중단 공지 | "시스템 점검 중입니다. 잠시 후 이용해 주세요." |

---

## 시나리오별 상세

### 1) 사이트 흰 화면

**가설**: GitHub Pages `base` 불일치, 빌드 실패, JS 로드 404.

**즉시 확인**

- 주소가 `https://아이디.github.io/레포이름/` 인지 (`/레포이름/` 포함)
- GitHub → Actions → **Deploy GitHub Pages** 최근 run

**조치**: 16장·19장 F-01. 실패 run 로그에서 `npm run build` 오류 수정 후 push.

**안 풀리면**: 로컬 `npm run build` + `npm run preview` 로 재현.

---

### 2) 신청 제출 시 "일시적인 오류"

**가설**: `next_yyc_receipt_no` / `submit_application` 미배포, RLS가 RPC 막음, anon 키 오류.

**즉시 확인**

- Supabase → Table Editor → 신청 직전/후 `applications` 행 생성 여부
- SQL Editor: `supabase/sql/next_yyc_receipt_no.sql`, `submit_application.sql` 실행 이력

**조치**: 11장 SQL 전체 재실행 → 17장 `applications_rls_lockdown.sql` (RPC GRANT 포함).

**안 풀리면**: 브라우저 Network 탭에서 `/rpc/submit_application` 응답 본문 복사 → 19장 D 항목 검색.

---

### 3) 관리자 로그인 실패 (비밀번호 오류만)

**가설**: Auth 계정 없음, 비번 변경, 가입 미확인.

**조치**: Authentication → Users → 해당 이메일 Reset password, Auto Confirm ✅.

---

### 4) 관리자 표 0건 (DB에는 있음)

**가설**: `app_admins` 누락, RLS 미적용, 로그인 이메일 불일치.

**조치**

```sql
INSERT INTO public.app_admins(email) VALUES ('운영자@이메일.com')
ON CONFLICT DO NOTHING;
```

→ `applications_rls_lockdown.sql` 재실행 → `#/admin` 재로그인.

---

### 5) 누적 엑셀 다운로드 401/403

**가설**: Edge 함수 미배포, JWT 만료, 화이트리스트.

**조치**: 14장 — `sign-application-workbook` 배포, `WORKBOOK_RESET_ALLOWED_EMAILS` 에 로그인 이메일.

---

### 6) Webhook은 도는데 엑셀 안 바뀜 / 안 쌓임

**가설**: 422 header mismatch, pivot 시트 이름 다름, Storage 파일명 불일치.

**조치**: 12장 — Functions Logs, Storage 파일 Updated 시간, `HEADERS`·시트명 `옵션 신청 현황`.

**대안**: DB에는 있으면 관리자에서 엑셀 다운로드로 결산 가능.

---

### 7) Supabase 점검(Outage)

**조치**: status 페이지 확인 → 복구까지 신청 URL 공지 중단 → 복구 후 18장 주간 점검 1회.

---

## 연락·계정 (채워 두기)

| 항목 | 값 |
|------|-----|
| GitHub 레포 | |
| Pages URL | |
| Supabase 프로젝트 URL | |
| 관리자 이메일 | |
| 담당자 연락처 | |
