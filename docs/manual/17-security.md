# 17장. 보안 최종 잠금 (RLS · 권한 · XSS)

> **이 장에서 완성하는 것**  
> 1) `applications` 등 모든 표에 **관리자 외엔 INSERT/UPDATE/DELETE 차단**  
> 2) `submit_application`/`verify_yyc_resident` 외 직접 SELECT 전부 차단  
> 3) 관리자 화면의 **모든 사용자 입력 출력에 XSS 방어**  
> 4) console.log 등 디버그 흔적 제거  
>
> **소요 시간**: 약 2시간  
> **난이도**: ★★★★

---

## 17-1. 미리 알아두기 (1줄 비유)

| 용어 | 1줄 비유 |
|------|---------|
| **RLS 정책 (POLICY)** | "이 줄은 이 조건일 때만 보이게/바꾸게 해" |
| **권한 (GRANT/REVOKE)** | "이 사람한테 이 동작 허락/회수" |
| **XSS** | "남이 보낸 글 안에 `<script>` 가 들어 있어 내 화면에서 실행되는 사고" |
| **escape** | "<, >, & 같은 글자를 `&lt;` 식으로 바꿔 그냥 글자처럼 보이게" |
| **Content-Security-Policy** | "브라우저에 '외부 스크립트는 다 막아' 명령" |

---

## 17-2. SQL: RLS 정책 한 번에 잠그기

SQL Editor → 그대로 복붙 → Run.

```sql
-- 0) 외부 직접 권한 회수
REVOKE ALL ON public.applications FROM anon, authenticated;
REVOKE ALL ON public.yyc_resident_registry FROM anon, authenticated;
REVOKE ALL ON public.yyc_receipt_counter FROM anon, authenticated;
REVOKE ALL ON public.app_admins FROM anon, authenticated;

-- 1) RLS 켜기 (이미 켜진 건 무시됨)
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.yyc_resident_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_admins ENABLE ROW LEVEL SECURITY;

-- 2) 기존에 풀려 있던 정책 정리(있다면)
DROP POLICY IF EXISTS applications_select_admin ON public.applications;
DROP POLICY IF EXISTS applications_modify_admin ON public.applications;
DROP POLICY IF EXISTS registry_admin_only ON public.yyc_resident_registry;
DROP POLICY IF EXISTS admins_select_admin ON public.app_admins;

-- 3) applications: 관리자만 SELECT/UPDATE/DELETE (INSERT 는 RPC만 허용 = 정책 없음)
CREATE POLICY applications_select_admin
  ON public.applications FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY applications_modify_admin
  ON public.applications FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 4) yyc_resident_registry: 관리자만 (검증은 SECURITY DEFINER RPC 통해서)
CREATE POLICY registry_admin_only
  ON public.yyc_resident_registry FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 5) app_admins: 관리자만 SELECT
CREATE POLICY admins_select_admin
  ON public.app_admins FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- 6) 기존 RPC 들의 EXECUTE 권한 재확인
GRANT EXECUTE ON FUNCTION public.verify_yyc_resident(text,text,text,text)  TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_application(jsonb)                  TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.next_yyc_receipt_no()                      TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin()                                 TO authenticated;
GRANT EXECUTE ON FUNCTION public.list_applications()                        TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_application(bigint)                    TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_clear_all_applications()             TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_reset_yyc_receipt_counter()          TO authenticated;
```

✅ Success.

---

## 17-3. 정말 잠겼나 직접 시험

### (1) 일반인(anon) 시도 — 브라우저 콘솔(F12) 에서

`?admin=1` 이 아닌 일반 화면 → F12 → Console:

```js
const { data, error } = await window.supabase
  ? window.supabase.from('applications').select('*')
  : (await import('@supabase/supabase-js')).createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    ).from('applications').select('*');
console.log(data, error);
```

> 💡 코드 안에 `supabase` 인스턴스를 `window.supabase = supabase` 로 임시 노출시키면 위 명령이 짧아집니다. **시험 후 꼭 제거**.

✅ **기대 결과**: `data` 가 `[]` 이거나 `error.code === '42501'` (forbidden). 한 줄도 못 봐야 함.

### (2) 관리자(authenticated) 시도

`?admin=1` 로그인 후 Console:

```js
await window.supabase.rpc('list_applications');
```
✅ 신청 목록이 나와야 함.

### (3) 신청 흐름이 정상인지

일반 화면에서 새 신청 1건 → 접수번호 정상 발급, 관리자 표에 한 줄 추가.

✅ 셋 다 OK면 RLS 잠금 통과.

---

## 17-4. AI에게 XSS 방어 시키기 🎯

> 🎯 **Cursor에 그대로 복사**  
> ```
> @App.jsx 에 XSS 방어 유틸을 넣고, 관리자 화면 출력에 적용해줘.
>
> 1) 유틸 함수 추가:
>
>    function escapeHtml(s) {
>      return String(s ?? '').replace(/[&<>"'`]/g, ch => ({
>        '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','`':'&#96;'
>      }[ch]));
>    }
>    const escapeHtmlAttr = escapeHtml;
>    function safeSignatureSrc(s) {
>      const v = String(s ?? '');
>      return /^data:image\/(png|jpeg|jpg|gif|webp);base64,[A-Za-z0-9+/=]+$/.test(v) ? v : '';
>    }
>
> 2) 관리자 표 / 상세 모달에서 사용자 입력값을 그대로 출력하던 곳을
>    JSX 의 {value} 출력으로 통일. (React의 JSX 는 기본 escape 됨)
>    혹시 dangerouslySetInnerHTML 을 쓰는 곳이 있다면 모두 제거하고
>    꼭 필요한 곳에만 escapeHtml(...) 결과를 사용.
>
> 3) 서명 이미지 출력은
>    <img src={safeSignatureSrc(detail.signature_data_url)} ... />
>    (검증 실패 시 빈 src → 깨진 이미지 placeholder)
>
> 4) 로그인 실패 메시지 등 외부에 보여주는 모든 에러 텍스트는
>    Supabase 가 준 원문(error.message)을 그대로 노출하지 말고
>    미리 정해둔 한국어 안내 문구로 치환.
>
> 5) 콘솔 디버그 정리:
>    - signature, payload, error 객체를 직접 console.log 하던 줄 모두 제거
>    - 남기고 싶은 로그는 import.meta.env.DEV 일 때만 출력
>
> 변경 후 Apply.
> ```

---

## 17-5. XSS 시험

관리자 표/상세에서 진짜 "나쁜 값" 이 들어와도 화면 안 깨지는지.

### (1) 일반 화면에서 신청 1건 — 이름에 `<img src=x onerror="alert(1)">` 넣어 제출
### (2) 관리자 표·상세 열기

✅ **기대**: 알림창 안 뜸. 화면에 그냥 글자 `<img src=x onerror="alert(1)">` 그대로 보여야 함.

[스크린샷: 상세 화면 — 위 문자열이 글자 그대로 표시]

⚠️ alert가 뜨면 어딘가 `dangerouslySetInnerHTML` 또는 raw `innerHTML` 가 남은 것. Cursor 채팅에:
> 🎯 **Cursor에 그대로 복사**  
> ```
> @App.jsx 에서 dangerouslySetInnerHTML 또는 innerHTML 직접 사용 부분 전부 찾아서
> JSX 출력 또는 escapeHtml 로 바꿔줘. 변경 후 Apply.
> ```

---

## 17-6. (선택) Content-Security-Policy 한 줄

`index.html` `<head>` 안에 한 줄 추가하면 외부 스크립트 자체를 차단.

```html
<meta http-equiv="Content-Security-Policy"
  content="default-src 'self';
           img-src 'self' data:;
           connect-src 'self' https://*.supabase.co;
           script-src 'self';
           style-src 'self' 'unsafe-inline';
           base-uri 'self'; frame-ancestors 'none';" />
```

> 화면이 깨지면 잠시 빼고 17장 다른 항목부터 마치세요. CSP 는 21·22장(부록)에서 다시 다듬어도 됩니다.

---

## 17-7. 17장 완료 체크리스트

- [ ] anon 키로 `from('applications').select('*')` 시도해도 0줄
- [ ] 관리자 로그인 후 `list_applications` 정상
- [ ] 일반 신청 흐름 영향 없음
- [ ] 이름·메모 등에 HTML 넣어 신청해도 화면이 글자로만 보임
- [ ] `console.log(payload/signature/error)` 등 흔적 제거
- [ ] `service_role`, DB 비번, webhook secret 코드/Repo 어디에도 없음

---

## 17-8. 자주 나는 에러

| 화면 | 원인 | 해결 |
|------|------|------|
| 관리자 표 갑자기 0건 | `app_admins` 에 본인 이메일 없음 | INSERT 다시 |
| 신청 흐름이 RLS로 막힘 | 정책 없이 INSERT 시도 | `submit_application` RPC 거치는지 확인 |
| 관리자에서 상세 안 열림 | `get_application` 권한 누락 | 위 GRANT 다시 |
| CSP 적용 후 사이트 깨짐 | connect-src 누락 | Supabase URL 도메인 추가 |
| Edge Function 호출 막힘 | CSP connect-src | `https://*.supabase.co` 포함 확인 |
| 한글 텍스트 깨짐 | escape 의 부작용 | escape 는 React 출력용 아님. JSX는 자동 처리하므로 유틸은 dangerouslySetInnerHTML 자리에만 |

---

## 17-9. 보안 메모 (한 번에 정리)

| 항목 | 상태 |
|------|------|
| 일반인 → DB 직접 SELECT | 차단 (RLS + REVOKE) |
| 일반인 → DB 직접 INSERT/UPDATE/DELETE | 차단 (RPC 만 허용) |
| 일반인 → Storage 엑셀 직접 다운로드 | 차단 (비공개 버킷) |
| 관리자 → 다운로드 | 60초 서명 URL |
| 관리자 가입 | 이메일 가입 OFF + 화이트리스트 |
| 입력값 → 화면 | escape + safeSignatureSrc |
| service_role · DB 비번 · webhook secret | Repo·Pages·코드 어디에도 없음 |
| Edge Function 출입 | JWT 또는 webhook secret 검사 |

→ 개인정보 측면에서 **최소한의 외부 노출** 상태에 도달.

---

📌 **다음 장 미리보기**  
18장에선 운영자(=본인)가 매주·매월 점검할 **운영 체크리스트와 백업** 을 만듭니다.
