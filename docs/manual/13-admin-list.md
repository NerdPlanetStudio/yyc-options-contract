# 13장. 관리자 로그인 + 신청 목록 화면

> **이 장에서 완성하는 것**  
> `#/admin` (또는 `/admin`) 주소 → 관리자 로그인 → **접수 목록 표** + 검색·필터.  
> 행을 클릭하면 14장 **우측 상세 패널**이 열립니다.  
>
> **선행**: 11장 DB 저장, (권장) 17장 RLS — 관리자만 `applications` SELECT  
> **소요 시간**: 약 1.5시간 (레포에 UI 있음 → 배포·SQL 위주)  
> **난이도**: ★★★

---

## 13-1. 미리 알아두기

| 용어 | 설명 |
|------|------|
| **관리자 URL** | `http://localhost:5173/#/admin` 또는 Pages `…/yyc-options/#/admin` |
| **세션** | 로그인 후 `localStorage` 키 `yyc_admin_session` (access_token) |
| **목록 조회** | `GET /rest/v1/applications?select=*` (관리자 JWT) |
| **`app_admins` + `is_admin()`** | 17장 RLS — 관리자 이메일만 표 조회 허용 |

흐름:

```
[#/admin 접속]
  → 이메일·비번 (Supabase Auth)
  → access_token 저장
  → applications 전체 조회 (RLS 통과 시)
  → 표: 접수번호·일시·동/호·타입·총액·휴대폰 뒷자리·고객명·상태
```

> 예전 교재의 `?admin=1`, `list_applications` RPC 는 **현재 앱과 다릅니다.**  
> 코드 정본: `src/App.jsx` 의 `renderAdminDashboardIfNeeded`, `adminFetchApplications`.

---

## 13-2. Supabase 관리자 계정

### (1) **Authentication → Users → Add user**

| 항목 | 값 |
|------|-----|
| Email | `admin@admin.com` (운영용은 실제 메일) |
| Password | 16자 이상, 메모장 보관 |
| Auto Confirm User | ✅ |

### (2) 일반 가입 차단

**Authentication → Providers → Email**  
- **Enable Email Signups**: ⛔ OFF → Save

---

## 13-3. SQL (관리자·초기화·선택 칼럼)

SQL Editor에서 **아래 순서**로 실행합니다.

### (1) 관리자 화이트리스트 + `is_admin()` (17장 RLS용)

```sql
CREATE TABLE IF NOT EXISTS public.app_admins (
  email text PRIMARY KEY
);
INSERT INTO public.app_admins(email) VALUES ('admin@admin.com')
ON CONFLICT DO NOTHING;
ALTER TABLE public.app_admins ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.app_admins FROM PUBLIC;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.app_admins a
    WHERE a.email = lower(coalesce(auth.jwt()->>'email',''))
  );
$$;
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
```

`app_admins` 에 **로그인에 쓰는 이메일**이 있어야 17장 이후 목록이 보입니다.

### (2) 관리자 메모·상태 저장 (선택)

상세 패널에서 **상태/메모 저장**이 400 이면 칼럼 추가:

```sql
ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS admin_memo text;
ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();
```

### (3) 초기화 RPC (15장)

레포 파일 **통째로** Run:

- `supabase/sql/admin_clear_all_applications.sql`  
  (`admin_clear_all_applications`, `admin_reset_yyc_receipt_counter`)

### (4) RPC 없을 때 삭제 폴백 (선택)

`admin_clear_all_applications` 미설치 환경용:

- `supabase/sql/applications_delete_policy.sql`

---

## 13-4. 앱에서 확인 (이미 구현됨)

레포를 clone 한 경우 **13-4 AI 지시는 생략**하고 동작만 확인합니다.

| 확인 | 방법 |
|------|------|
| 관리자 진입 | `npm run dev` → `http://localhost:5173/#/admin` |
| 로그인 | 13-2 계정 |
| 목록 | 11장에서 넣은 신청이 표에 보임 |
| 필터 | 검색·동·타입·상태 |
| 행 클릭 | 우측에 「접수 상세」(14장) |
| 일반 화면 | `#/admin` 없이 `/` → 신청 step 0 |

표 칼럼(현재 앱):

| 칼럼 | DB 필드 |
|------|---------|
| 접수번호 | `receipt_no` |
| 접수일시 | `created_at` |
| 동/호 | `dong`, `ho` |
| 타입 | `unit_type` |
| 총액 | `total_price` |
| 휴대폰 뒷자리 | `phone` |
| 고객명 | `customer_name` |
| 상태 | `status` (접수됨·확인중·계약완료·취소) |

---

## 13-5. GitHub Pages

push 후:

`https://내아이디.github.io/yyc-options/#/admin`

---

## 13-6. 자주 나는 에러

| 화면 | 원인 | 해결 |
|------|------|------|
| 로그인 실패 | Auth 계정·비번 | Users 에 계정·Auto Confirm |
| 목록 0건 / permission denied | RLS·화이트리스트 | 17장 정책 + `app_admins` 에 이메일 |
| `#/admin` 인데 신청 화면 | hash 없음 | 주소에 `#/admin` 포함 |
| 새로고침 시 로그아웃 | 토큰 만료 | 다시 로그인 |
| `?admin=1` 로 안 열림 | 구버전 교재 | **`#/admin`** 사용 |

---

## 13-7. 완료 체크리스트

- [ ] 관리자 Auth 계정 1개, 일반 가입 OFF
- [ ] `app_admins` + `is_admin()` 적용
- [ ] `#/admin` 로그인 → 목록 표
- [ ] 행 클릭 시 우측 상세 영역 표시
- [ ] (17장 후) anon 으로는 목록 조회 불가

---

## 13-8. 보안 메모

- 신청자는 `submit_application` RPC 만 — `applications` 직접 SELECT 불가(17장).  
- 관리자 목록은 **JWT + RLS** 로만. URL `#/admin` 은 “비밀 주소”일 뿐, 비번 없이는 못 들어감.

---

📌 **다음 장**  
14장: 행 선택 시 **상세·서명·엑셀 다운로드**(Storage 누적본).
