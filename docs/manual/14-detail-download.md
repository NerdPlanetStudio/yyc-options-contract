# 14장. 관리자 — 신청서 상세 보기 + 엑셀 안전 다운로드

> **이 장에서 완성하는 것**  
> 표의 "상세" 버튼 → 신청서 한 건의 전체 내용 + 서명 이미지 표시.  
> 그리고 **누적 엑셀** 을 60초짜리 임시 링크(서명 URL) 로 안전하게 받기.  
>
> **소요 시간**: 약 2시간  
> **난이도**: ★★★★

---

## 14-1. 미리 알아두기 (1줄 비유)

| 용어 | 1줄 비유 |
|------|---------|
| **상세 (detail) 화면** | "신청서 1건을 한 페이지에 다 보여주기" |
| **Signed URL** | "60초 동안만 유효한 임시 다운로드 주소" |
| **Edge Function `sign-application-workbook`** | "관리자임을 확인하고 임시 주소를 발급해주는 알바" |

---

## 14-2. 다운로드용 Edge Function 만들기

`supabase/functions/sign-application-workbook/index.ts` 새로 만들고 복붙.

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

    const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });
    const expires = 60;
    const { data, error } = await admin.storage.from(bucket).createSignedUrl(objectKey, expires);
    if (error || !data?.signedUrl) {
      return new Response("422 " + (error?.message ?? "no url"), { status: 422, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ url: data.signedUrl, expires_in: expires }), {
      headers: { ...corsHeaders, "content-type": "application/json" }
    });
  } catch (e) {
    return new Response("500 " + (e?.message ?? String(e)), { status: 500, headers: corsHeaders });
  }
});
```

`supabase/config.toml` 에 추가:

```toml
[functions.sign-application-workbook]
verify_jwt = false
```

> `verify_jwt = false` 로 두지만 함수 안에서 직접 JWT를 확인하므로 안전합니다.

### 시크릿 등록 + 배포

```bash
supabase secrets set WORKBOOK_RESET_ALLOWED_EMAILS="admin@admin.com"
supabase functions deploy sign-application-workbook --no-verify-jwt
```

✅ 배포 완료 메시지.

---

## 14-3. AI에게 상세 화면 + 다운로드 버튼 시키기 🎯

> 🎯 **Cursor에 그대로 복사**  
> ```
> @App.jsx 관리자 화면에 다음을 추가해줘.
>
> 1) 상태:
>    - const [detail, setDetail] = useState(null)
>    - 표 행의 "상세" 클릭 시 supabase.rpc('get_application', { p_id: id })
>      → setDetail(data[0])
>
> 2) 상세 패널 (detail 있으면 모달 또는 우측 패널로):
>    - 닫기 버튼 → setDetail(null)
>    - 표시 항목(읽기 전용):
>      접수번호, 접수일시(KST), 평형, 동/호, 계약자명,
>      주민번호 앞6 (마스킹: 앞 2자리 + ****),
>      휴대폰, 이메일, 자택주소,
>      비상연락처(이름/전화),
>      선택 옵션 목록 (라벨 + 가격, 합계),
>      관리자메모,
>      서명 이미지 (signature_data_url을 <img> 로, 최대 폭 320px)
>    - 모든 텍스트 출력은 안전하게 처리 (XSS 방지는 17장에서 한 번에 강화)
>
> 3) 목록 화면 우측 상단에 큰 버튼 "엑셀 다운로드"
>    클릭 시:
>      const { data, error } = await supabase.functions.invoke('sign-application-workbook')
>      error 있으면 → alert("다운로드 권한이 없거나 일시 오류입니다.")
>      성공 시 → window.location.href = data.url
>      (이 url 은 60초 동안만 유효)
>
> 4) 다운로드 진행 중 버튼 텍스트 "다운로드 준비 중..."
>
> 변경 후 Apply.
> ```

---

## 14-4. 끝부터 끝까지 시험

`?admin=1` → 로그인 → 목록 표.

| 시험 | 기대 |
|------|------|
| "상세" 버튼 클릭 | 모달에 한 건 전체 정보 + 서명 그림 |
| 주민번호 앞6 | `12****` 형태로 마스킹 |
| "엑셀 다운로드" | 잠시 후 엑셀 자동 저장 — 모든 신청이 들어가 있음 |
| 같은 링크 60초 후 다시 열기 | 만료 (다시 누르면 새 링크) |
| 로그아웃 후 다운로드 | 401/403 에러 안내 |

[스크린샷: 상세 모달 + 서명 이미지 / 다운로드된 엑셀 파일 두 컷]

✅ 다 OK면 14장 통과.

---

## 14-5. 자주 나는 에러

| 화면 | 원인 | 해결 |
|------|------|------|
| `Failed to fetch` | Edge Function 미배포·CORS | `functions deploy` 다시. config.toml CORS 헤더 확인 |
| 401 unauthorized | 로그인 안 된 채 호출 | 로그인 후 재시도 |
| 403 forbidden | `WORKBOOK_RESET_ALLOWED_EMAILS` 화이트리스트 누락 | secrets에 본인 이메일 추가 후 재배포 |
| 422 no url | 버킷·파일명 불일치 | 12장에서 정한 이름과 secrets 일치 확인 |
| 다운로드 후 1초 만에 만료 | 시계 차이 | expires 60 → 90으로 ↑ |
| 서명 이미지 안 보임 | 잘못된 dataURL | 17장에서 `safeSignatureSrc` 로 검증 강화 |

---

## 14-6. 14장 완료 체크리스트

- [ ] `sign-application-workbook` 함수 배포 완료
- [ ] `WORKBOOK_RESET_ALLOWED_EMAILS` 시크릿에 본인 이메일
- [ ] 표 "상세" → 한 건 전체 표시 + 서명 이미지
- [ ] 주민번호 마스킹 (`12****`)
- [ ] "엑셀 다운로드" 버튼으로 누적 엑셀 받기 OK
- [ ] 로그아웃 상태에선 다운로드 안 됨

---

## 14-7. 보안 메모

- 버킷이 **비공개** + 60초 서명 URL 이라 외부에 링크가 새도 곧 만료.  
- 함수 안에서 `getUser()` + 화이트리스트 두 번 검사.  
- 화면 표시 시 주민번호는 **앞 6자리 → 앞 2자리 마스킹** 처리.  
- 17장에서 '관리자 외엔 INSERT/UPDATE/DELETE 전부 차단' + 'XSS 방어' 까지 한 번에 잠급니다.

---

📌 **다음 장 미리보기**  
15장에선 시즌이 끝났을 때 **모든 신청을 한 번에 초기화**(DB·접수번호·엑셀)하는 "초기화" 버튼을 안전하게 만듭니다.
