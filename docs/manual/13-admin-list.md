# 13장. 관리자 로그인 + 신청 목록 화면

> **이 장에서 완성하는 것**  
> `/?admin=1` 같은 비밀 주소 → 관리자 로그인 화면 → 통과하면  
> **신청자 목록 표** 가 보입니다 (접수번호·동·호·이름·평형·금액·일시).  
>
> **소요 시간**: 약 2시간  
> **난이도**: ★★★

---

## 13-1. 미리 알아두기 (1줄 비유)

| 용어 | 1줄 비유 |
|------|---------|
| **Supabase Auth** | "Supabase가 만들어주는 로그인 서비스 (비번/이메일·구글 등)" |
| **관리자 계정** | "이메일 = `admin@admin.com`, 비번 한 개 — 한 명만 씀" |
| **세션 (session)** | "로그인 후 받은 출입증 — 브라우저에 잠깐 보관" |
| **list_applications RPC** | "관리자만 부를 수 있는 매크로 — 신청 전체 목록을 줘" |

흐름:
```
[관리자] /?admin=1 접속
   → 이메일·비번 로그인 (Supabase Auth)
   → 세션 토큰 보관
   → list_applications RPC 호출
   → 표 렌더링
```

---

## 13-2. Supabase에 관리자 계정 1개 만들기

### (1) 왼쪽 메뉴 **Authentication → Users**
### (2) **Add user → Create new user**

| 항목 | 값 |
|------|-----|
| Email | `admin@admin.com` |
| Password | 강한 비번 (16자 이상, 메모장에 저장) |
| Auto Confirm User | ✅ 체크 |

→ Create user.

[스크린샷: Add user 모달]

✅ Users 목록에 `admin@admin.com` 한 줄.

### (3) 일반인 가입 막기 (아주 중요)

**Authentication → Providers → Email**  
- **Enable Email Signups**: ⛔ **OFF**  
- Confirm email: 그대로

→ Save.

[스크린샷: Email Provider — Signup OFF]

> 이렇게 해두면 외부에서 누가 회원가입을 시도해도 못 만듭니다. 관리자 1명만 존재.

---

## 13-3. 목록 RPC + 관리자 화이트리스트 SQL

SQL Editor → 그대로 복붙 → Run.

```sql
-- 1) 관리자 화이트리스트 테이블 (이메일 기준)
CREATE TABLE IF NOT EXISTS public.app_admins (
  email text PRIMARY KEY
);
INSERT INTO public.app_admins(email) VALUES ('admin@admin.com')
ON CONFLICT DO NOTHING;
ALTER TABLE public.app_admins ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.app_admins FROM PUBLIC;

-- 2) 관리자 여부 검사 함수
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

-- 3) 신청 목록 조회 RPC (관리자만)
DROP FUNCTION IF EXISTS public.list_applications();

CREATE OR REPLACE FUNCTION public.list_applications()
RETURNS TABLE(
  id bigint, receipt_no text, customer_name text,
  dong text, ho text, unit_type text,
  total_amount integer, created_at timestamptz
)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501';
  END IF;
  RETURN QUERY
    SELECT a.id, a.receipt_no, a.customer_name,
           a.dong, a.ho, a.unit_type,
           a.total_amount, a.created_at
      FROM public.applications a
     ORDER BY a.created_at DESC;
END $$;
REVOKE ALL ON FUNCTION public.list_applications() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.list_applications() TO authenticated;

-- 4) 신청 1건 상세 조회 RPC (14장에서 사용)
DROP FUNCTION IF EXISTS public.get_application(bigint);

CREATE OR REPLACE FUNCTION public.get_application(p_id bigint)
RETURNS SETOF public.applications
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501';
  END IF;
  RETURN QUERY SELECT * FROM public.applications WHERE id = p_id;
END $$;
REVOKE ALL ON FUNCTION public.get_application(bigint) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_application(bigint) TO authenticated;
```

✅ Success 메시지.

---

## 13-4. AI에게 관리자 화면 만들라고 시키기 🎯

> 🎯 **Cursor에 그대로 복사**  
> ```
> @App.jsx 에 관리자 페이지를 추가해줘.
>
> 1) URL 검사:
>    const isAdminUrl = new URLSearchParams(location.search).get('admin') === '1'
>    → 이게 true면 일반 신청 흐름 대신 관리자 화면을 그린다.
>
> 2) 관리자 상태:
>    - const [adminSession, setAdminSession] = useState(null)
>    - 시작 시 supabase.auth.getSession() 으로 복원
>    - supabase.auth.onAuthStateChange 로 갱신
>
> 3) 로그인 화면 (adminSession 없을 때):
>    - 상단 작은 글씨 "관리자 전용"
>    - 이메일·비밀번호 입력 + "로그인" 버튼
>    - 이메일은 lowercase trim 으로 입력 처리
>    - supabase.auth.signInWithPassword({ email, password })
>    - 실패 시 빨간 안내 (구체 에러 노출 X — "이메일 또는 비밀번호가 올바르지 않습니다.")
>
> 4) 로그인 성공 후 화면 (adminSession 있을 때):
>    - 우측 상단 로그인된 이메일 + "로그아웃" 버튼 (supabase.auth.signOut)
>    - "신청 목록" 제목
>    - supabase.rpc('list_applications') 호출 → 표 렌더링
>      칼럼: 접수번호 / 동 / 호 / 평형 / 계약자명 / 합계금액(콤마+원) / 접수일시(YYYY-MM-DD HH:mm)
>      행 우측에 "상세" 버튼 → 다음 장에서 동작 (지금은 console.log(id))
>    - 표 위에 "총 N건" 표시, 새로고침 아이콘 버튼
>    - 데이터 없으면 "아직 신청이 없습니다." 안내
>
> 5) 에러 처리:
>    - rpc 에러가 'forbidden' 이면 "관리자 권한이 없습니다." 안내 + 자동 로그아웃
>    - 나머지 에러는 "일시적인 오류" 한 줄
>
> 모바일에서도 표 가로 스크롤 가능하게 wrapper에 overflow-x:auto.
> 변경 후 Apply.
> ```

---

## 13-5. 브라우저 확인

`http://localhost:5173/?admin=1` 접속.

| 시험 | 기대 |
|------|------|
| 관리자 페이지 진입 | 로그인 폼 표시 |
| 잘못된 비번 | "이메일 또는 비밀번호가 올바르지 않습니다." |
| `admin@admin.com` + 정확한 비번 | 신청 목록 표 |
| 표 위 "총 N건" | 11장에서 넣은 신청들이 그대로 |
| 로그아웃 | 다시 로그인 폼 |
| `?admin=1` 빼고 접속 | 평소 신청 화면 |

[스크린샷: 로그인 폼 / 로그인 후 목록 표 두 컷]

---

## 13-6. GitHub Pages에서도 확인

평소처럼 commit → push.  
`https://내아이디.github.io/yyc-options/?admin=1` 에서도 같은 화면 동작.

✅ 다 OK면 13장 통과.

---

## 13-7. 자주 나는 에러

| 화면 | 원인 | 해결 |
|------|------|------|
| "Email signups are disabled" | 13-2(3)대로 끔 — 정상 | 가입 X, 로그인만 |
| 로그인은 되는데 표가 0건 | 11장 신청을 안 했음 | 일반 화면에서 신청 1건 |
| `permission denied for function list_applications` | GRANT 누락 | SQL 끝의 GRANT 줄 다시 Run |
| 'forbidden' 자동 로그아웃 | 화이트리스트에 이메일 없음 | `app_admins` 에 본인 이메일 INSERT |
| `?admin=1` 인데 일반 화면 | URL 검사 위치 잘못 | useEffect 안에서 step 무시하고 분기 |
| 토큰이 새로고침마다 사라짐 | `persistSession` false | 기본값 그대로 두기 (true) |

---

## 13-8. 13장 완료 체크리스트

- [ ] `admin@admin.com` 계정 1개만 존재, 일반 가입 OFF
- [ ] `app_admins` / `is_admin` / `list_applications` / `get_application` SQL 적용
- [ ] `?admin=1` 진입 시 로그인 폼
- [ ] 로그인 성공 → 목록 표
- [ ] 로그아웃·재로그인 정상
- [ ] 일반 사용자는 `?admin=1` 알아도 비번 없이 못 들어감

---

## 13-9. 보안 메모

- 일반인은 anon 키만 알아도 `applications` 테이블에 **직접 SELECT 불가** (RLS).  
- 목록은 오직 `list_applications` RPC 를 통해서만, 그것도 `is_admin()` 통과해야 결과가 나옴.  
- 17장에서 "관리자 외 INSERT/UPDATE/DELETE 절대 금지" 까지 한 번에 잠급니다.

---

📌 **다음 장 미리보기**  
14장에선 관리자 표의 **상세** 버튼이 일하게 됩니다.  
1) 신청서 한 건의 모든 정보(서명 포함) 보기  
2) **누적 엑셀을 안전하게 다운로드** (서명 URL).
