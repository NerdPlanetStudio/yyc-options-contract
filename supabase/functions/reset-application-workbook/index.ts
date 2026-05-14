/**
 * 관리자 초기화 시 Storage 누적 xlsx 를 TEMPLATE_PUBLIC_URL 의 템플릿으로 덮어씀 (DB는 호출 측에서 비움)
 *
 * POST + Authorization: Bearer <access_token>
 * 선택: WORKBOOK_RESET_ALLOWED_EMAILS = "a@x.com,b@y.com" (비어 있으면 로그인만 되면 허용)
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors });
  }
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: cors });
  }

  const authHeader = req.headers.get("Authorization") ?? "";
  const m = authHeader.match(/^Bearer\s+(.+)$/i);
  const jwt = m?.[1]?.trim();
  if (!jwt) {
    return new Response(JSON.stringify({ error: "missing bearer token" }), {
      status: 401,
      headers: { ...cors, "Content-Type": "application/json" }
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const bucket = Deno.env.get("WORKBOOK_BUCKET") ?? "application-workbook";
  const objectKey = Deno.env.get("WORKBOOK_OBJECT_KEY") ?? "yyc-contract-live_V1.xlsx";
  const templateUrl = Deno.env.get("TEMPLATE_PUBLIC_URL") ?? "";
  const allowRaw = Deno.env.get("WORKBOOK_RESET_ALLOWED_EMAILS") ?? "";

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  const { data: userData, error: userErr } = await supabase.auth.getUser(jwt);
  if (userErr || !userData?.user?.email) {
    return new Response(JSON.stringify({ error: "invalid or expired session" }), {
      status: 401,
      headers: { ...cors, "Content-Type": "application/json" }
    });
  }

  const allowed = allowRaw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (allowed.length > 0) {
    const em = userData.user.email.toLowerCase();
    if (!allowed.includes(em)) {
      return new Response(JSON.stringify({ error: "forbidden" }), {
        status: 403,
        headers: { ...cors, "Content-Type": "application/json" }
      });
    }
  }

  if (!templateUrl) {
    return new Response(
      JSON.stringify({
        error: "TEMPLATE_PUBLIC_URL unset",
        hint: "append-workbook-row 과 동일하게 템플릿 공개 URL을 secrets 에 설정하세요."
      }),
      { status: 422, headers: { ...cors, "Content-Type": "application/json" } }
    );
  }

  const tr = await fetch(templateUrl);
  if (!tr.ok) {
    return new Response(
      JSON.stringify({ error: "template fetch failed", status: tr.status }),
      { status: 502, headers: { ...cors, "Content-Type": "application/json" } }
    );
  }
  const buf = new Uint8Array(await tr.arrayBuffer());
  if (buf.length < 100) {
    return new Response(JSON.stringify({ error: "template response too small" }), {
      status: 502,
      headers: { ...cors, "Content-Type": "application/json" }
    });
  }

  const { error: upErr } = await supabase.storage.from(bucket).upload(objectKey, new Blob([buf]), {
    upsert: true,
    contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });

  if (upErr) {
    return new Response(JSON.stringify({ error: upErr.message }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" }
    });
  }

  return new Response(JSON.stringify({ ok: true, bucket, objectKey }), {
    headers: { ...cors, "Content-Type": "application/json" }
  });
});
