# 15장. 관리자 — 시즌 종료용 "초기화" 버튼

> **이 장에서 완성하는 것**  
> 1) `applications` 테이블의 모든 줄 삭제  
> 2) 접수번호 카운터 0으로  
> 3) Storage 의 누적 엑셀을 **빈 템플릿으로 리셋**  
> 이 셋을 **두 번 확인**받은 뒤 한 방에.  
>
> **소요 시간**: 약 1.5시간  
> **난이도**: ★★★★

---

## 15-1. 미리 알아두기 (1줄 비유)

| 용어 | 1줄 비유 |
|------|---------|
| **TRUNCATE** | "테이블을 통째로 비우기" |
| **`admin_clear_all_applications` RPC** | "applications 비우기 + 카운터 0 으로" |
| **`admin_reset_yyc_receipt_counter` RPC** | "접수번호 카운터만 0 으로" |
| **`reset-application-workbook` Edge Function** | "Storage 엑셀을 빈 템플릿으로 덮어쓰기" |

---

## 15-2. SQL: 초기화 RPC 만들기

SQL Editor → 복붙 → Run.

```sql
-- 1) 신청 전체 삭제 + 접수번호 0
CREATE OR REPLACE FUNCTION public.admin_clear_all_applications()
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501';
  END IF;
  TRUNCATE TABLE public.applications RESTART IDENTITY;
  TRUNCATE TABLE public.yyc_receipt_counter;
  INSERT INTO public.yyc_receipt_counter(id, current_no) VALUES (1, 0)
    ON CONFLICT DO NOTHING;
END $$;
REVOKE ALL ON FUNCTION public.admin_clear_all_applications() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_clear_all_applications() TO authenticated;

-- 2) 카운터만 0 으로
CREATE OR REPLACE FUNCTION public.admin_reset_yyc_receipt_counter()
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501';
  END IF;
  TRUNCATE TABLE public.yyc_receipt_counter;
  INSERT INTO public.yyc_receipt_counter(id, current_no) VALUES (1, 0);
END $$;
REVOKE ALL ON FUNCTION public.admin_reset_yyc_receipt_counter() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_reset_yyc_receipt_counter() TO authenticated;
```

✅ Success.

---

## 15-3. Storage 엑셀 리셋용 Edge Function

`supabase/functions/reset-application-workbook/index.ts` 만들고 복붙.

```ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, OPTIONS",
  "access-control-allow-headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-api-version, prefer"
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY  = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const bucket = Deno.env.get("WORKBOOK_BUCKET") ?? "application-workbook";
    const objectKey = Deno.env.get("WORKBOOK_OBJECT_KEY") ?? "yyc-contract-live_V1.xlsx";
    const templateUrl = Deno.env.get("TEMPLATE_PUBLIC_URL") ?? "";

    const allowedRaw = Deno.env.get("WORKBOOK_RESET_ALLOWED_EMAILS") ?? "";
    const allowed = allowedRaw.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);

    const auth = req.headers.get("authorization") ?? "";
    if (!auth.startsWith("Bearer ")) {
      return new Response("unauthorized", { status: 401, headers: corsHeaders });
    }
    const userClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: auth } },
      auth: { persistSession: false }
    });
    const { data: u, error: uerr } = await userClient.auth.getUser();
    if (uerr || !u?.user) return new Response("unauthorized", { status: 401, headers: corsHeaders });
    const email = (u.user.email ?? "").toLowerCase();
    if (allowed.length && !allowed.includes(email)) {
      return new Response("forbidden", { status: 403, headers: corsHeaders });
    }

    if (!templateUrl) {
      return new Response("422 TEMPLATE_PUBLIC_URL unset", { status: 422, headers: corsHeaders });
    }
    const tres = await fetch(templateUrl);
    if (!tres.ok) return new Response("422 template fetch failed", { status: 422, headers: corsHeaders });
    const buf = await tres.arrayBuffer();

    const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });
    const up = await admin.storage.from(bucket).upload(objectKey, new Blob([buf]), {
      upsert: true,
      contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
    if (up.error) return new Response("500 " + up.error.message, { status: 500, headers: corsHeaders });

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "content-type": "application/json" }
    });
  } catch (e) {
    return new Response("500 " + (e?.message ?? String(e)), { status: 500, headers: corsHeaders });
  }
});
```

`supabase/config.toml` 에 추가:

```toml
[functions.reset-application-workbook]
verify_jwt = false
```

### 빈 템플릿 엑셀을 인터넷 어딘가에 두기

가장 쉬운 방법: 12-2(3) 에서 만든 **헤더만 있는 엑셀** 을 GitHub 리포의 `public/templates/` 폴더에 넣고 commit/push.  
GitHub Pages 가 `https://내아이디.github.io/yyc-options/templates/yyc-contract-pivot-template.xlsx` 같은 주소로 자동 서비스합니다.

```bash
mkdir -p public/templates
# 위 엑셀을 그 폴더에 yyc-contract-pivot-template.xlsx 이름으로 복사
git add public/templates
git commit -m "add reset template"
git push
```

업로드 완료 후 그 URL 그대로 시크릿:

```bash
supabase secrets set TEMPLATE_PUBLIC_URL="https://내아이디.github.io/yyc-options/templates/yyc-contract-pivot-template.xlsx"
supabase functions deploy reset-application-workbook --no-verify-jwt
```

---

## 15-4. AI에게 "초기화" 버튼 시키기 🎯

> 🎯 **Cursor에 그대로 복사**  
> ```
> @App.jsx 관리자 화면 우측 상단(엑셀 다운로드 옆)에 빨간 "초기화" 버튼을 추가해줘.
>
> 클릭 시:
> 1) 1차 confirm:
>    "이 작업은 다음을 모두 비웁니다:
>     - 신청 데이터 전체
>     - 접수번호 카운터 (다시 1번부터)
>     - 누적 엑셀 (빈 템플릿으로 덮어쓰기)
>     계속하시겠습니까?"
> 2) 2차 prompt:
>    "정말 진행하려면 RESET 을 그대로 입력하세요."
>    (입력값 trim 후 'RESET' 과 정확히 같아야 진행)
>
> 진행 시 순서:
>   a) await supabase.rpc('admin_clear_all_applications')
>      에러나면 멈추고 안내
>   b) await supabase.rpc('admin_reset_yyc_receipt_counter')
>      (a가 이미 처리하지만 안전 차원)
>   c) await supabase.functions.invoke('reset-application-workbook')
>      에러나면 안내 (단, a/b는 이미 진행됨을 명시)
>
> 진행 중:
>   - 버튼 비활성 + "초기화 중..." 텍스트
> 완료 시:
>   - 목록 다시 불러오기 (list_applications)
>   - 알림 "초기화가 완료되었습니다."
>
> 변경 후 Apply.
> ```

---

## 15-5. 끝부터 끝까지 시험

`?admin=1` → 로그인 → 신청 1~2건 있는 상태에서 **초기화** 클릭.

| 단계 | 기대 |
|------|------|
| 1차 confirm | 안내문 그대로 |
| 2차 입력 | `RESET` 외엔 진행 X |
| 진행 후 | 표가 "총 0건" / "아직 신청이 없습니다." |
| 신청 1건 더 제출 (일반 화면) | 접수번호 다시 `YYC-2026-0001` 부터 |
| 누적 엑셀 다운로드 | 헤더만 있는 빈 파일 → 새 신청 1줄만 들어 있음 |

[스크린샷: 초기화 후 빈 목록 + 새 신청 후 0001 접수번호]

✅ 다 OK면 15장 통과 — **시즌 운영 사이클 완성**.

---

## 15-6. 자주 나는 에러

| 화면 | 원인 | 해결 |
|------|------|------|
| `forbidden` | 화이트리스트/관리자 미일치 | `app_admins`·`WORKBOOK_RESET_ALLOWED_EMAILS` 둘 다 본인 이메일 |
| 422 TEMPLATE_PUBLIC_URL unset | secret 누락 | 위 secrets 명령 다시 |
| 422 template fetch failed | 템플릿 URL 404 | 브라우저로 직접 열어보고 다운되는 URL 인지 확인 |
| 초기화 후에도 1~155 보임 | 템플릿에 샘플 데이터 들어 있음 | 템플릿을 헤더 1줄만 남기고 다시 push |
| 카운터 안 줄어듦 | 옛날 버전 RPC | 위 SQL 다시 Run |
| 초기화 후 신청 시도 → duplicate 에러 | 같은 동·호 이미 사용 — 다른 동·호로 시도 | UNIQUE 제약 때문, 정상 |

---

## 15-7. 15장 완료 체크리스트

- [ ] `admin_clear_all_applications`, `admin_reset_yyc_receipt_counter` RPC 생성
- [ ] `reset-application-workbook` 함수 배포 + `TEMPLATE_PUBLIC_URL` 시크릿
- [ ] 빈 템플릿 엑셀이 GitHub Pages 로 접근 가능
- [ ] "초기화" 버튼 두 단계 확인 후 동작
- [ ] 초기화 후 새 신청 → 접수번호 0001 부터
- [ ] 초기화 후 다운로드 엑셀 → 헤더만

---

## 15-8. 보안 메모

- 초기화 SQL 은 **`is_admin()` 통과해야만 실행** (RLS+SECURITY DEFINER 조합).  
- 엑셀 리셋은 Edge Function 안에서 **JWT 확인 + 이메일 화이트리스트** 두 겹.  
- 두 단계 confirm/prompt 로 실수 방지.

---

> 💪 **여기까지 오신 분께**  
> 13·14·15 묶음으로 **관리자 운영 도구 한 세트**가 완성됐어요.
