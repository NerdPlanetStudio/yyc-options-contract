/**
 * 관리자 JWT 검증 후 비공개 Storage 누적 xlsx 의 서명 URL(짧은 만료) 발급
 *
 * POST + Authorization: Bearer <access_token>  (필요시 body: { expiresIn: 60 })
 * 선택 secret: WORKBOOK_RESET_ALLOWED_EMAILS — 비어 있으면 로그인된 사용자 누구나 가능
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-api-version, prefer",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Max-Age": "86400"
};

const DEFAULT_EXPIRES = 60;
const MAX_EXPIRES = 300;

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

  let expiresIn = DEFAULT_EXPIRES;
  try {
    const body = await req.json().catch(() => ({}));
    if (body && typeof body === "object" && "expiresIn" in body) {
      const n = Number((body as Record<string, unknown>).expiresIn);
      if (Number.isFinite(n) && n > 0 && n <= MAX_EXPIRES) expiresIn = Math.floor(n);
    }
  } catch {
    /* ignore */
  }

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(objectKey, expiresIn, {
      download: objectKey.split("/").pop() || "yyc-contract.xlsx"
    });

  if (error || !data?.signedUrl) {
    return new Response(JSON.stringify({ error: error?.message || "sign url failed" }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" }
    });
  }

  return new Response(JSON.stringify({ signedUrl: data.signedUrl, expiresIn }), {
    headers: { ...cors, "Content-Type": "application/json" }
  });
});
