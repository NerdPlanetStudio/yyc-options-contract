/**
 * applications INSERT 시(또는 동일 본문 POST) Storage 의 엑셀 워크북에 Sheet1 (2) 한 행 추가
 *
 * 검증: 헤더 x-workbook-secret === Deno.env.get("WORKBOOK_WEBHOOK_SECRET")
 * Storage: WORKBOOK_BUCKET / WORKBOOK_OBJECT_KEY (기본 application-workbook / yyc-contract-live.xlsx)
 * 파일 없음: TEMPLATE_PUBLIC_URL GET 으로 초기 템플릿 사용
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import * as XLSX from "npm:xlsx@0.18.5";

const SHEET = "Sheet1 (2)";
const HEADERS = [
  "순번",
  "코드A",
  "용도",
  "타입",
  "동",
  "호수",
  "계약자",
  "휴대폰 번호 4자리",
  "시트판넬",
  "거실 마감재 특화",
  "욕실 마감재 특화",
  "주방 마감 및 가구 특화",
  "드레스룸 특화",
  "붙박이장(침실1)",
  "붙박이장(침실2)",
  "붙박이장(침실3)",
  "인덕션(3구)",
  "빌트인오븐",
  "식기세척기",
  "냉장고패키지",
  "시스템에어컨",
  "비데일체형 양변기(욕실1)",
  "비데일체형 양변기(욕실2)",
  "비데(욕실1)",
  "비데(욕실2)",
  "스마트복합환풍기",
  "총액"
];
const USE_TYPE = "도시형생활주택";

function parseSelectedOptions(raw: unknown): Record<string, unknown>[] {
  if (Array.isArray(raw)) return raw as Record<string, unknown>[];
  if (typeof raw === "string") {
    try {
      const p = JSON.parse(raw);
      return Array.isArray(p) ? p : [];
    } catch {
      return [];
    }
  }
  return [];
}

function phoneTailDigits4(value: unknown): string {
  if (value == null || value === "") return "";
  const d = String(value).replace(/\D/g, "");
  if (!d) return "";
  return d.length <= 4 ? d : d.slice(-4);
}

function normCat(cat: unknown): string {
  return String(cat ?? "")
    .replace(/\s+/g, "")
    .trim();
}

function pivotIdx(o: Record<string, unknown>): number {
  const id = (o.option_id ?? o.id) as string | undefined;

  if (id === "a_ind") return 8;
  if (id === "a_oven") return 9;
  if (id === "a_dish") return 10;
  if (id === "a_fr") return 11;
  if (id === "a_ac") return 12;
  if (id === "a_bt1") return 13;
  if (id === "a_bt2") return 14;
  if (id === "a_bd1") return 15;
  if (id === "a_bd2") return 16;
  if (id === "a_bt") return 13;
  if (id === "a_bd") return 15;
  if (id === "a_vent") return 17;

  const c = normCat(o.category);
  const lab = String(o.label ?? o.name ?? "").trim();

  if (c.includes("벽마감재") || lab.includes("시트 판넬") || lab.includes("시트판넬")) return 0;
  if (c.includes("거실마감재") || lab.includes("거실 아트월")) return 1;
  if (c.includes("욕실마감재")) return 2;
  if (c.includes("주방마감및") || (c.includes("주방마감") && c.includes("가구"))) return 3;
  if (c.includes("주방마감")) return 3;
  if (c.includes("공간(드레스룸)") || c.includes("드레스룸")) return 4;
  if (c.includes("붙박이장")) {
    if (/(침실1|^실1\b|실1\s|실1붙)/.test(lab)) return 5;
    if (/(침실2|^실2\b|실2\s|실2붙)/.test(lab)) return 6;
    if (/(침실3|^실3\b|실3\s|실3붙)/.test(lab)) return 7;
    return -1;
  }
  return -1;
}

function accumulateAmounts(selected_options: unknown): number[] {
  const amounts = new Array(18).fill(0);
  for (const o of parseSelectedOptions(selected_options)) {
    const p = Number(o.price) || 0;
    const idx = pivotIdx(o);
    if (idx >= 0 && idx < amounts.length) amounts[idx] += p;
  }
  return amounts;
}

function headersMatch(row0: unknown[]): boolean {
  if (!row0 || row0.length < HEADERS.length) return false;
  return HEADERS.every((h, i) => String(row0[i] ?? "").trim() === h);
}

function findAppendRow(aoa: unknown[][]): number {
  if (!aoa || aoa.length < 2) return 1;
  let last = 0;
  for (let i = 1; i < aoa.length; i++) {
    const row = aoa[i] as unknown[];
    if (!row) continue;
    const code = row[1];
    const dong = row[4];
    const ho = row[5];
    const name = row[6];
    const has =
      (code != null && String(code).trim() !== "") ||
      (dong != null && String(dong).trim() !== "") ||
      (ho != null && String(ho).trim() !== "") ||
      (name != null && String(name).trim() !== "");
    if (has) last = i;
  }
  return last + 1;
}

function nextSeq(aoa: unknown[][], appendAt: number): number {
  let maxSeq = 0;
  for (let i = 1; i < appendAt; i++) {
    const row = aoa[i] as unknown[];
    if (!row) continue;
    const n = Number(row[0]);
    if (Number.isFinite(n)) maxSeq = Math.max(maxSeq, Math.floor(n));
  }
  return maxSeq + 1;
}

function buildRow(rec: Record<string, unknown>, seq: number): (string | number)[] {
  const amounts = accumulateAmounts(rec.selected_options);
  const optCells = amounts.map((x) => (x === 0 ? "" : x));
  const totalNum = Number(rec.total_price) || 0;
  return [
    seq,
    String(rec.receipt_no ?? ""),
    USE_TYPE,
    String(rec.unit_type ?? ""),
    String(rec.dong ?? ""),
    String(rec.ho ?? ""),
    String(rec.customer_name ?? ""),
    phoneTailDigits4(rec.phone),
    ...optCells,
    totalNum
  ];
}

function extractRecord(body: Record<string, unknown>): Record<string, unknown> | null {
  if (body.record && typeof body.record === "object") return body.record as Record<string, unknown>;
  if (body.type === "INSERT" && body.record) return body.record as Record<string, unknown>;
  return null;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const secret = Deno.env.get("WORKBOOK_WEBHOOK_SECRET") ?? "";
  const hdr = req.headers.get("x-workbook-secret") ?? "";
  if (!secret || hdr !== secret) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid json" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  const rec = extractRecord(body);
  if (!rec || (rec.receipt_no == null && rec.dong == null && rec.ho == null)) {
    return new Response(JSON.stringify({ error: "missing record" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const bucket = Deno.env.get("WORKBOOK_BUCKET") ?? "application-workbook";
  const objectKey = Deno.env.get("WORKBOOK_OBJECT_KEY") ?? "yyc-contract-live.xlsx";
  const templateUrl = Deno.env.get("TEMPLATE_PUBLIC_URL") ?? "";

  const supabase = createClient(supabaseUrl, serviceKey);

  let wb: XLSX.WorkBook;
  const { data: existing, error: dlErr } = await supabase.storage.from(bucket).download(objectKey);

  if (!dlErr && existing) {
    const ab = await existing.arrayBuffer();
    wb = XLSX.read(ab, { type: "array" });
  } else if (templateUrl) {
    const tr = await fetch(templateUrl);
    if (!tr.ok) {
      return new Response(
        JSON.stringify({ error: "template fetch failed", status: tr.status }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }
    const tab = await tr.arrayBuffer();
    wb = XLSX.read(tab, { type: "array" });
  } else {
    return new Response(
      JSON.stringify({
        error: "workbook missing and TEMPLATE_PUBLIC_URL unset",
        hint: "Upload yyc-contract-live.xlsx to storage or set TEMPLATE_PUBLIC_URL to your deployed /templates/yyc-contract-pivot-template.xlsx"
      }),
      { status: 422, headers: { "Content-Type": "application/json" } }
    );
  }

  const ws = wb.Sheets[SHEET];
  if (!ws) {
    return new Response(JSON.stringify({ error: `sheet missing: ${SHEET}` }), { status: 422, headers: { "Content-Type": "application/json" } });
  }

  const aoa = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" }) as unknown[][];
  if (!headersMatch((aoa[0] as unknown[]) ?? [])) {
    return new Response(JSON.stringify({ error: "header mismatch on Sheet1 (2)" }), {
      status: 422,
      headers: { "Content-Type": "application/json" }
    });
  }

  const appendAt = findAppendRow(aoa);
  const seq = nextSeq(aoa, appendAt);
  const newRow = buildRow(rec, seq);

  XLSX.utils.sheet_add_aoa(ws, [newRow], { origin: { r: appendAt, c: 0 } });

  const out = XLSX.write(wb, { bookType: "xlsx", type: "array" }) as Uint8Array;
  const { error: upErr } = await supabase.storage.from(bucket).upload(objectKey, new Blob([out]), {
    upsert: true,
    contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });

  if (upErr) {
    return new Response(JSON.stringify({ error: upErr.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }

  return new Response(JSON.stringify({ ok: true, appendedAt: appendAt, seq }), {
    headers: { "Content-Type": "application/json" }
  });
});
