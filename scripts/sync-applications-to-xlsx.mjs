#!/usr/bin/env node
/**
 * Supabase `applications` → 로컬 .xlsx 덮어쓰기 (관리자 CSV와 동일한 열 구성)
 *
 * 거의 실시간: --watch 로 주기 실행 (브라우저·관리자 페이지와 별개로 동작)
 *
 * 준비: Supabase Dashboard → Project Settings → API 에서 service_role 키 복사
 * (절대 Git 커밋 금지. 터미널 환경변수로만 주입)
 *
 * 한 번보내기:
 *   SUPABASE_URL="https://xxxx.supabase.co" \
 *   SUPABASE_SERVICE_ROLE_KEY="eyJ..." \
 *   OUTPUT_XLSX="/Users/dongwoolim/Desktop/임동우_옵션전자계약_동호및옵션금액 복사본.xlsx" \
 *   node scripts/sync-applications-to-xlsx.mjs
 *
 * 25초마다 반복:
 *   ...동일 환경변수... \
 *   node scripts/sync-applications-to-xlsx.mjs --watch --interval=25
 */

import fs from "fs";
import path from "path";
import XLSX from "xlsx";
import {
  parseSelectedOptions,
  sumSelectedOptionsPrices,
  buildCsvOptionColumnDefs,
  accumulateCsvOptionAmounts
} from "../src/applicationCsvShared.js";
import { TYPES, getAppliances } from "../src/optionsCatalog.js";

/** 옵션 열 정의 — `src/optionsCatalog.js` + `buildCsvOptionColumnDefs` (관리자 CSV와 동일) */
const OPTION_CSV_DEFS = buildCsvOptionColumnDefs(TYPES, getAppliances);

const COMPLEX_NAME = "청량리역 요진 와이시티";

function parseArgs(argv) {
  const watch = argv.includes("--watch");
  let interval = 25;
  const iv = argv.find((a) => a.startsWith("--interval="));
  if (iv) {
    const n = Number(iv.split("=")[1]);
    if (Number.isFinite(n) && n >= 5) interval = n;
  }
  return { watch, interval };
}

function formatAdminDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
}

function formatPhoneTailDisplay(value) {
  if (value == null || value === "") return "-";
  const d = String(value).replace(/\D/g, "");
  if (!d) return "-";
  return d.length <= 4 ? d : d.slice(-4);
}

function formatSelectedOptionsForCsv(selected_options) {
  const arr = parseSelectedOptions(selected_options);
  if (arr.length === 0) return "미선택(전체 미선택형)";
  return arr
    .map((o) => {
      const cat = (o.category || "").trim();
      const lab = (o.label || o.name || "-").trim();
      const price = Number(o.price || 0).toLocaleString("ko-KR");
      return cat ? `${cat}: ${lab} (${price}원)` : `${lab} (${price}원)`;
    })
    .join(" | ");
}

function pivotCellForXlsx(n) {
  const v = Number(n) || 0;
  return v === 0 ? "" : v;
}

function buildHeaderRow() {
  return [
    "순번",
    "관리번호",
    "단지",
    "타입",
    "동",
    "호",
    "계약자",
    "휴대폰 번호 뒷자리",
    ...OPTION_CSV_DEFS.map((d) => d.header),
    "기타유상",
    "총액",
    "금액일치",
    "접수일시",
    "상태",
    "생년월일",
    "메모",
    "옵션내역",
    "접수ID"
  ];
}

function rowFromApplication(r, rowIdx) {
  const optSum = sumSelectedOptionsPrices(r.selected_options);
  const totalNum = Number(r.total_price) || 0;
  const sumMatch = Math.abs(optSum - totalNum) < 0.01 ? "일치" : "불일치(점검)";
  const optLine =
    r.selected_options_summary && String(r.selected_options_summary).trim()
      ? String(r.selected_options_summary).trim()
      : formatSelectedOptionsForCsv(r.selected_options);
  const { amounts, extra } = accumulateCsvOptionAmounts(r.selected_options, OPTION_CSV_DEFS);
  const pivotCells = amounts.map(pivotCellForXlsx);

  return [
    rowIdx + 1,
    r.receipt_no ?? "",
    COMPLEX_NAME,
    r.unit_type ?? "",
    r.dong ?? "",
    r.ho ?? "",
    r.customer_name ?? "",
    formatPhoneTailDisplay(r.phone),
    ...pivotCells,
    pivotCellForXlsx(extra),
    Number(r.total_price) || 0,
    sumMatch,
    formatAdminDate(r.created_at),
    r.status ?? "",
    r.birth_date || "",
    r.admin_memo ?? "",
    optLine,
    r.id ?? ""
  ];
}

async function fetchAllApplications(supabaseUrl, serviceKey) {
  const rows = [];
  const pageSize = 1000;
  let offset = 0;
  for (;;) {
    const res = await fetch(
      `${supabaseUrl.replace(/\/$/, "")}/rest/v1/applications?select=*&order=created_at.desc`,
      {
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          Range: `${offset}-${offset + pageSize - 1}`
        }
      }
    );
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`applications 조회 실패 HTTP ${res.status}: ${t.slice(0, 500)}`);
    }
    const batch = await res.json();
    if (!Array.isArray(batch) || batch.length === 0) break;
    rows.push(...batch);
    if (batch.length < pageSize) break;
    offset += pageSize;
  }
  return rows;
}

function writeWorkbook(outPath, applications) {
  const header = buildHeaderRow();
  const data = [header, ...applications.map((r, i) => rowFromApplication(r, i))];
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "접수동기화");
  const dir = path.dirname(outPath);
  if (dir && !fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const tmp = `${outPath}.tmp.${process.pid}.xlsx`;
  XLSX.writeFile(wb, tmp);
  fs.renameSync(tmp, outPath);
}

async function runOnce(supabaseUrl, serviceKey, outPath) {
  const applications = await fetchAllApplications(supabaseUrl, serviceKey);
  writeWorkbook(outPath, applications);
  const stamp = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
  console.log(`[${stamp}] 저장 완료: ${outPath} (${applications.length}건)`);
}

async function main() {
  const { watch, interval } = parseArgs(process.argv.slice(2));
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const outPath =
    process.env.OUTPUT_XLSX ||
    path.join(
      process.env.HOME || "",
      "Desktop",
      "임동우_옵션전자계약_동호및옵션금액 복사본.xlsx"
    );

  if (!supabaseUrl || !serviceKey) {
    console.error("SUPABASE_URL 과 SUPABASE_SERVICE_ROLE_KEY 환경변수가 필요합니다.");
    process.exit(1);
  }

  const run = async () => {
    try {
      await runOnce(supabaseUrl, serviceKey, outPath);
    } catch (e) {
      console.error(e.message || e);
    }
  };

  await run();
  if (!watch) return;

  console.log(`--watch: ${interval}초마다 다시 저장합니다. 종료: Ctrl+C`);
  setInterval(run, interval * 1000);
}

main();
