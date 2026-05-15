# 부록 B. 모든 Edge Function 코드 모음

> **이 부록의 용도**  
> 함수 3개를 한 번에 다시 깔거나, 다른 Supabase 프로젝트로 이식할 때.  
> 모두 `supabase/functions/<이름>/index.ts` 위치.

---

## B-0. `supabase/config.toml`

```toml
project_id = "yyc-options"

[functions.append-workbook-row]
verify_jwt = false

[functions.sign-application-workbook]
verify_jwt = false

[functions.reset-application-workbook]
verify_jwt = false
```

---

## B-1. `append-workbook-row/index.ts` (12장)

```ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import * as XLSX from "https://esm.sh/xlsx@0.18.5";

const HEADERS = [
  "순번","접수번호","용도","동","호","평형",
  "계약자명","주민등록번호 앞6","휴대폰","이메일","주소",
  "비상연락처(이름)","비상연락처(전화)",
  "선택옵션","합계금액","관리자메모","접수일시"
];
const SHEET_NAME = "신청서";

const corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST, OPTIONS",
  "access-control-allow-headers":
    "authorization, x-client-info, apikey, content-type, x-workbook-secret"
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const expected = Deno.env.get("WORKBOOK_WEBHOOK_SECRET") ?? "";
    const got = req.headers.get("x-workbook-secret") ?? "";
    if (!expected || got !== expected)
      return new Response("unauthorized", { status: 401, headers: corsHeaders });

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY  = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const bucket = Deno.env.get("WORKBOOK_BUCKET") ?? "application-workbook";
    const objectKey = Deno.env.get("WORKBOOK_OBJECT_KEY") ?? "yyc-contract-live_V1.xlsx";
    const templateUrl = Deno.env.get("TEMPLATE_PUBLIC_URL") ?? "";

    const body = await req.json();
    const r = body?.record ?? {};
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

    let buf: ArrayBuffer | null = null;
    const dl = await supabase.storage.from(bucket).download(objectKey);
    if (dl.data) buf = await dl.data.arrayBuffer();
    else if (templateUrl) {
      const res = await fetch(templateUrl);
      if (!res.ok) return new Response("422 template fetch failed", { status: 422, headers: corsHeaders });
      buf = await res.arrayBuffer();
    } else {
      return new Response("422 workbook missing and TEMPLATE_PUBLIC_URL unset", { status: 422, headers: corsHeaders });
    }

    const wb = XLSX.read(new Uint8Array(buf), { type: "array" });
    const ws = wb.Sheets[SHEET_NAME] ?? wb.Sheets[wb.SheetNames[0]];
    if (!ws) return new Response("422 sheet missing", { status: 422, headers: corsHeaders });

    const head = (XLSX.utils.sheet_to_json(ws, { header: 1, range: 0 })[0] ?? []) as string[];
    if (HEADERS.some((h, i) => (head[i] ?? "").toString().trim() !== h))
      return new Response("422 header mismatch on pivot sheet", { status: 422, headers: corsHeaders });

    const existing = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];
    const nextNo = existing.length;

    const optionsLabel = Array.isArray(r.options)
      ? r.options.map((o: any) => `${o.label}(${(o.price ?? 0).toLocaleString()}원)`).join(", ")
      : "";
    const createdAt = new Date(r.created_at ?? Date.now())
      .toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });

    XLSX.utils.sheet_add_aoa(ws, [[
      nextNo, r.receipt_no, "옵션신청",
      r.dong, r.ho, r.unit_type,
      r.customer_name, r.resident_id_first6,
      r.phone, r.email, r.address,
      r.emergency_name ?? "", r.emergency_phone ?? "",
      optionsLabel, r.total_amount ?? 0,
      r.admin_memo ?? "", createdAt
    ]], { origin: -1 });

    const out = XLSX.write(wb, { type: "array", bookType: "xlsx" });
    const up = await supabase.storage.from(bucket).upload(objectKey, new Blob([out]), {
      upsert: true,
      contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
    if (up.error) return new Response("500 " + up.error.message, { status: 500, headers: corsHeaders });

    return new Response(JSON.stringify({ ok: true, no: nextNo }), {
      headers: { ...corsHeaders, "content-type": "application/json" }
    });
  } catch (e) {
    return new Response("500 " + (e?.message ?? String(e)), { status: 500, headers: corsHeaders });
  }
});
```

---

## B-2. `sign-application-workbook/index.ts` (14장)

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
    const allowed = (Deno.env.get("WORKBOOK_RESET_ALLOWED_EMAILS") ?? "")
      .split(",").map(s => s.trim().toLowerCase()).filter(Boolean);

    const auth = req.headers.get("authorization") ?? "";
    if (!auth.startsWith("Bearer "))
      return new Response("unauthorized", { status: 401, headers: corsHeaders });

    const userClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: auth } },
      auth: { persistSession: false }
    });
    const { data: u, error: uerr } = await userClient.auth.getUser();
    if (uerr || !u?.user) return new Response("unauthorized", { status: 401, headers: corsHeaders });
    const email = (u.user.email ?? "").toLowerCase();
    if (allowed.length && !allowed.includes(email))
      return new Response("forbidden", { status: 403, headers: corsHeaders });

    const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });
    const expires = 60;
    const { data, error } = await admin.storage.from(bucket).createSignedUrl(objectKey, expires);
    if (error || !data?.signedUrl)
      return new Response("422 " + (error?.message ?? "no url"), { status: 422, headers: corsHeaders });

    return new Response(JSON.stringify({ url: data.signedUrl, expires_in: expires }), {
      headers: { ...corsHeaders, "content-type": "application/json" }
    });
  } catch (e) {
    return new Response("500 " + (e?.message ?? String(e)), { status: 500, headers: corsHeaders });
  }
});
```

---

## B-3. `reset-application-workbook/index.ts` (15장)

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
    const allowed = (Deno.env.get("WORKBOOK_RESET_ALLOWED_EMAILS") ?? "")
      .split(",").map(s => s.trim().toLowerCase()).filter(Boolean);

    const auth = req.headers.get("authorization") ?? "";
    if (!auth.startsWith("Bearer "))
      return new Response("unauthorized", { status: 401, headers: corsHeaders });

    const userClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: auth } },
      auth: { persistSession: false }
    });
    const { data: u, error: uerr } = await userClient.auth.getUser();
    if (uerr || !u?.user) return new Response("unauthorized", { status: 401, headers: corsHeaders });
    const email = (u.user.email ?? "").toLowerCase();
    if (allowed.length && !allowed.includes(email))
      return new Response("forbidden", { status: 403, headers: corsHeaders });

    if (!templateUrl) return new Response("422 TEMPLATE_PUBLIC_URL unset", { status: 422, headers: corsHeaders });
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
