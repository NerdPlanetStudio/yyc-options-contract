import React, { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";

/** 로컬에 `allowedResidents.json`이 있으면 우선(비공개), 없으면 샘플만 — 공개 저장소에 실명 DB를 올리지 않기 위함 */
const residentJsonModules = import.meta.glob("./data/*.json", { eager: true });
const realJson = Object.entries(residentJsonModules).find(([p]) => /\/allowedResidents\.json$/.test(p));
const sampleJson = Object.entries(residentJsonModules).find(([p]) => /allowedResidents\.sample\.json$/.test(p));
const allowedResidents = realJson?.[1]?.default ?? sampleJson?.[1]?.default ?? [];

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://rjcrywtpsjehobckrqjj.supabase.co";
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_-HuVy_kanJ9qo-KrSGXXlA_bPn1nx5J";

/** Desktop 더미데이터.xlsx 기준 세대 — 동·호·계약자명·휴대폰 뒷 4자리 일치 행을 찾고, 선택 평형(typeKey)까지 같아야 통과 */
function matchAllowedResident(dong, ho, contractorName, phoneLast4) {
  const d = String(dong ?? "").replace(/\D/g, "");
  const h = String(ho ?? "").replace(/\D/g, "");
  const name = String(contractorName ?? "")
    .trim()
    .replace(/\s+/g, " ");
  const p = String(phoneLast4 ?? "").replace(/\D/g, "");
  if (!d || !h || !name || p.length !== 4) return null;
  return (
    allowedResidents.find(
      (r) => r.dong === d && r.ho === h && r.name === name && r.phoneTail === p
    ) ?? null
  );
}

/** Supabase 등록부 RPC — 공개 배포에서 실세대 검증 */
async function verifyYycResidentRpc(dong, ho, contractorName, phoneLast4) {
  const d = String(dong ?? "").replace(/\D/g, "");
  const h = String(ho ?? "").replace(/\D/g, "");
  const name = String(contractorName ?? "")
    .trim()
    .replace(/\s+/g, " ");
  const p = String(phoneLast4 ?? "").replace(/\D/g, "");
  if (!d || !h || !name || p.length !== 4) return null;

  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/verify_yyc_resident`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    },
    body: JSON.stringify({
      p_dong: d,
      p_ho: h,
      p_contractor: name,
      p_phone_tail: p
    })
  });

  const raw = await res.text();
  if (!res.ok) {
    throw new Error(raw || `HTTP ${res.status}`);
  }
  if (!raw || raw === "null") return null;
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  const first = Array.isArray(parsed) ? parsed[0] : parsed;
  if (first && typeof first.type_key === "string") return { typeKey: first.type_key };
  return null;
}

/**
 * 배포: Supabase RPC 성공 시 DB만 신뢰(빈 결과면 불일치).
 * 로컬 dev: RPC 200·빈 배열일 때만 로컬 JSON 폴백.
 * RPC 호출 실패 시: 로컬 매칭 있으면 폴백, 없으면 안내 오류 throw.
 */
async function verifyResidentForGate(dong, ho, contractorName, phoneLast4) {
  let rpcRow = null;
  let rpcFailed = false;
  let rpcErrText = "";
  try {
    rpcRow = await verifyYycResidentRpc(dong, ho, contractorName, phoneLast4);
  } catch (e) {
    rpcFailed = true;
    rpcErrText = e?.message || String(e);
  }

  const localRow = matchAllowedResident(dong, ho, contractorName, phoneLast4);

  if (!rpcFailed) {
    if (rpcRow) return rpcRow;
    if (import.meta.env.DEV && localRow) return localRow;
    return null;
  }

  if (localRow) return localRow;

  let hint =
    "\n\n[조치] Supabase → SQL Editor 에서 supabase/sql/yyc_resident_registry.sql 전체를 실행하고,\n" +
    "로컬에 allowedResidents.json 이 있다면 터미널에서 npm run db:residents-sql 로 INSERT 문을 만든 뒤 같은 Editor 에서 실행해 주세요.";
  try {
    const j = JSON.parse(rpcErrText);
    if (String(j?.code || "") === "PGRST202" || String(j?.message || "").includes("verify_yyc_resident")) {
      hint =
        "\n\n[원인] DB에 verify_yyc_resident 함수가 없습니다.\n[조치] supabase/sql/yyc_resident_registry.sql 전체를 SQL Editor 에서 실행한 뒤, 세대 데이터 INSERT 까지 완료해 주세요.";
    }
  } catch {
    /* raw */
  }
  throw new Error((rpcErrText || "세대 검증 서버를 호출하지 못했습니다.") + hint);
}

/** 게이트용과 동일 로직이나, 자동 평형 채우기용 — 절대 throw 하지 않음 */
async function lookupResidentTypeQuiet(dong, ho, contractorName, phoneLast4) {
  try {
    return await verifyResidentForGate(dong, ho, contractorName, phoneLast4);
  } catch {
    return matchAllowedResident(dong, ho, contractorName, phoneLast4);
  }
}

/** 예: YYC-2026-00004 — DB 함수가 아직 옛 버전일 때 */
function looksLikeLegacyYycReceiptNo(s) {
  const t = String(s || "").trim();
  const parts = t.split("-");
  if (parts.length !== 3 || parts[0] !== "YYC") return false;
  return /^\d{4}$/.test(parts[1]) && /^\d+$/.test(parts[2]);
}

/** Supabase `next_yyc_receipt_no` RPC → `YYC-20260511001` (서울 YYYYMMDD + 3자리 일련; 단지 155세대라 연간 001~999면 충분, sql/next_yyc_receipt_no.sql) */
async function fetchNextReceiptNoFromSupabase() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/next_yyc_receipt_no`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`
    },
    body: "{}"
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error("접수번호 발급 실패:", errorText);
    let hint = "";
    try {
      const j = JSON.parse(errorText);
      if (String(j?.code || "") === "PGRST202" || String(j?.message || "").includes("next_yyc_receipt_no")) {
        hint =
          "\n\n[원인] Supabase DB에 함수 public.next_yyc_receipt_no 가 아직 없습니다.\n[조치] 프로젝트의 supabase/sql/next_yyc_receipt_no.sql 전체를 Supabase → SQL Editor 에서 실행한 뒤 다시 시도하세요.";
      }
    } catch {
      /* raw text */
    }
    throw new Error(
      (errorText || "접수번호를 발급하지 못했습니다.") + hint
    );
  }
  const raw = await res.text();
  if (!raw) throw new Error("접수번호가 비어 있습니다.");
  let receipt;
  try {
    const parsed = JSON.parse(raw);
    receipt = typeof parsed === "string" ? parsed : String(parsed);
  } catch {
    receipt = raw.replace(/^"|"$/g, "").trim();
  }
  if (looksLikeLegacyYycReceiptNo(receipt)) {
    throw new Error(
      "접수번호 RPC가 예전 형식(YYC-연도-일련)을 돌려주고 있습니다.\n\n" +
        "Supabase → SQL Editor에서 supabase/sql/next_yyc_receipt_no.sql 파일 전체를 실행해 next_yyc_receipt_no 함수를 최신으로 올려 주세요.\n\n" +
        "※ 관리자 목록에 이미 있는 접수번호는 저장 당시 값이라 바뀌지 않습니다. SQL 반영 후 새로 「신청완료」한 건만 새 형식(YYC-YYYYMMDD001)입니다."
    );
  }
  return receipt;
}

/** 신청 저장용 — React 상태 기준( DOM 미동기·빈 RPC 응답 이슈 방지 ) */
function buildApplicationPayloadFromState({ dong, ho, contractor, phoneLast4, unitType, selectedList, total, signData, receiptNo }) {
  const selected_options = selectedList.map((o) => ({
    category: o.cat,
    label: (o.label || o.name || "").trim(),
    price: Number(o.price) || 0
  }));
  const phone = String(phoneLast4 ?? "").replace(/\D/g, "").slice(0, 4);
  return {
    receipt_no: receiptNo,
    customer_name: (contractor || "").trim() || "미입력",
    phone: phone || "",
    dong: String(dong ?? "").replace(/\D/g, "") || "",
    ho: String(ho ?? "").replace(/\D/g, "") || "",
    unit_type: (unitType || "").trim() || "미입력",
    selected_options,
    total_price: Number(total) || 0,
    signature_data_url: signData || "",
    printed: true,
    status: "접수됨"
  };
}

async function saveApplicationToSupabase(payload) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/submit_application`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`
    },
    body: JSON.stringify({ payload })
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Supabase RPC 신청 저장 실패:", errorText);
    throw new Error(`[RPC submit_application] ${errorText || "Supabase 신청 저장 실패"}`);
  }

  const raw = await res.text();
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

async function submitApplicationToAdmin(payload) {
  await saveApplicationToSupabase(payload);
  window.__yycApplicationSubmitted = true;
}

const ADMIN_SESSION_KEY = "yyc_admin_session";

function getAdminSession() {
  try {
    return JSON.parse(localStorage.getItem(ADMIN_SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

function setAdminSession(session) {
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
}

function clearAdminSession() {
  localStorage.removeItem(ADMIN_SESSION_KEY);
}

async function supabaseAdminLogin(email, password) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_KEY
    },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("관리자 로그인 실패:", errorText);
    throw new Error("로그인에 실패했습니다. 이메일/비밀번호를 확인해 주세요.");
  }

  return res.json();
}

async function adminFetchApplications() {
  const session = getAdminSession();
  if (!session?.access_token) throw new Error("로그인이 필요합니다.");

  const res = await fetch(`${SUPABASE_URL}/rest/v1/applications?select=*&order=created_at.desc`, {
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${session.access_token}`
    }
  });

  if (!res.ok) {
    if (res.status === 401) clearAdminSession();
    const errorText = await res.text();
    console.error("접수 목록 조회 실패:", errorText);
    throw new Error("접수 목록을 불러오지 못했습니다. 다시 로그인해 주세요.");
  }

  return res.json();
}

async function adminUpdateApplication(id, patch) {
  const session = getAdminSession();
  if (!session?.access_token) throw new Error("로그인이 필요합니다.");

  const res = await fetch(`${SUPABASE_URL}/rest/v1/applications?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${session.access_token}`,
      "Prefer": "return=representation"
    },
    body: JSON.stringify({ ...patch, updated_at: new Date().toISOString() })
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("접수 정보 수정 실패:", errorText);
    throw new Error("접수 정보 수정에 실패했습니다.");
  }

  return res.json();
}

/** 초기화용 — `id` 만 여러 페이지에 나눠 조회 (기본 1000건 제한 회피) */
async function adminFetchAllApplicationIds() {
  const session = getAdminSession();
  if (!session?.access_token) throw new Error("로그인이 필요합니다.");

  const ids = [];
  const pageSize = 1000;
  let offset = 0;

  for (;;) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/applications?select=id&order=created_at.desc`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${session.access_token}`,
        Range: `${offset}-${offset + pageSize - 1}`
      }
    });

    if (!res.ok) {
      if (res.status === 401) clearAdminSession();
      const errorText = await res.text();
      console.error("접수 id 목록 조회 실패:", errorText);
      throw new Error("접수 목록을 불러오지 못했습니다. 다시 로그인해 주세요.");
    }

    const batch = await res.json();
    if (!Array.isArray(batch) || batch.length === 0) break;
    for (const r of batch) {
      if (r?.id) ids.push(r.id);
    }
    if (batch.length < pageSize) break;
    offset += pageSize;
  }

  return ids;
}

/** 관리자 초기화 — `applications` 행 삭제 (배치). Supabase 에 DELETE 정책이 있어야 합니다. */
async function adminDeleteApplicationsByIds(ids) {
  const session = getAdminSession();
  if (!session?.access_token) throw new Error("로그인이 필요합니다.");

  const unique = [...new Set((ids || []).map(String).filter(Boolean))];
  if (unique.length === 0) return;

  const chunkSize = 60;
  for (let i = 0; i < unique.length; i += chunkSize) {
    const chunk = unique.slice(i, i + chunkSize);
    const inList = chunk.join(",");
    const res = await fetch(`${SUPABASE_URL}/rest/v1/applications?id=in.(${inList})`, {
      method: "DELETE",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${session.access_token}`,
        Prefer: "return=minimal"
      }
    });

    if (!res.ok) {
      if (res.status === 401) clearAdminSession();
      const errorText = await res.text();
      console.error("접수 삭제 실패:", errorText);
      let msg = "접수 데이터 삭제에 실패했습니다.";
      if (res.status === 401) msg = "로그인이 만료되었습니다. 다시 로그인해 주세요.";
      else if (res.status === 403)
        msg +=
          " Supabase `applications` 테이블에 authenticated DELETE 정책이 있는지 확인해 주세요. (supabase/sql/applications_delete_policy.sql)";
      throw new Error(msg);
    }
  }
}

function parseSupabaseErrorMessage(raw) {
  if (raw == null) return "";
  const s = String(raw);
  try {
    const j = JSON.parse(s);
    if (j && typeof j.message === "string" && j.message) return j.message;
  } catch {
    /* ignore */
  }
  return s;
}

function isAdminClearRpcMissing(err) {
  const t = String(err?.message || "");
  if (err?.status === 404) return true;
  if (t.includes("PGRST202")) return true;
  if (/Could not find the function/i.test(t)) return true;
  return false;
}

/** 관리자 초기화(권장) — DB의 applications 전부 삭제. Supabase 에 admin_clear_all_applications.sql 실행 필요 */
async function adminClearAllApplicationsRpc() {
  const session = getAdminSession();
  if (!session?.access_token) throw new Error("로그인이 필요합니다.");

  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/admin_clear_all_applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${session.access_token}`
    },
    body: "{}"
  });

  const raw = await res.text();
  if (!res.ok) {
    if (res.status === 401) clearAdminSession();
    const err = new Error(parseSupabaseErrorMessage(raw) || "admin_clear_all_applications RPC 실패");
    err.status = res.status;
    throw err;
  }
  if (!raw) return 0;
  try {
    const v = JSON.parse(raw);
    return typeof v === "number" ? v : Number(v) || 0;
  } catch {
    return 0;
  }
}

function installAdminStyles() {
  if (document.getElementById("yyc-admin-style")) return;

  const style = document.createElement("style");
  style.id = "yyc-admin-style";
  style.textContent = `.admin-wrap{min-height:100vh;background:#f1f5f9;color:#1e293b;font-family:'Pretendard',-apple-system,BlinkMacSystemFont,sans-serif;padding:1rem;box-sizing:border-box}.admin-shell{max-width:1200px;margin:0 auto}.admin-top{background:linear-gradient(135deg,#1e3a5f 0%,#2c5282 100%);color:#fff;text-align:center;padding:2.75rem 1.5rem;border-radius:1rem;margin-bottom:1.5rem;box-shadow:0 1px 3px rgba(0,0,0,.08)}.admin-title h1{font-size:2.5rem;font-weight:800;margin:0 0 .75rem;letter-spacing:-.03em;color:#fff}.admin-title p{font-size:1rem;opacity:.85;margin:0;color:#fff}.admin-actions{display:flex;justify-content:center;gap:.5rem;flex-wrap:wrap;margin-top:1.25rem}.admin-card{background:#fff;border-radius:1rem;padding:2rem;box-shadow:0 1px 3px rgba(0,0,0,.08);border:0;box-sizing:border-box}.admin-login{width:min(440px,calc(100vw - 2rem));margin:12vh auto 0;text-align:left;overflow:hidden}.admin-login .admin-title{background:linear-gradient(135deg,#1e3a5f 0%,#2c5282 100%);color:#fff;text-align:center;margin:-2rem -2rem 1.5rem;padding:2rem 1.5rem;border-radius:1rem 1rem 0 0}.admin-login .admin-title h1{font-size:1.75rem;margin:0 0 .5rem;color:#fff}.admin-login .admin-title p{font-size:.875rem;color:#fff;opacity:.85}.admin-field{display:flex;flex-direction:column;gap:.45rem;margin-bottom:1rem}.admin-field label{font-size:.875rem;font-weight:700;color:#1e3a5f}.admin-input,.admin-select,.admin-textarea{width:100%;box-sizing:border-box;border:1px solid #cbd5e1;border-radius:.5rem;padding:.675rem .875rem;font-size:.9375rem;background:#fff;color:#1e293b;outline:none;transition:border-color .2s,box-shadow .2s}.admin-input:focus,.admin-select:focus,.admin-textarea:focus{border-color:#1e3a5f;box-shadow:0 0 0 3px rgba(30,58,95,.12)}.admin-textarea{min-height:100px;resize:vertical}.admin-btn{display:inline-flex;align-items:center;justify-content:center;border:none;border-radius:.5rem;background:#1e3a5f;color:#fff;font-size:.9375rem;font-weight:800;padding:.75rem 1.25rem;cursor:pointer;transition:background .2s,border-color .2s;text-decoration:none}.admin-btn:hover{background:#2c5282}.admin-btn.secondary{background:#fff;color:#475569;border:1px solid #cbd5e1}.admin-btn.secondary:hover{background:#f8fafc;border-color:#94a3b8}.admin-btn.danger{background:#991b1b;color:#fff}.admin-btn.danger:hover{background:#b91c1c;color:#fff}.admin-filters{display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr auto;gap:.75rem;margin-bottom:1rem;padding-bottom:1rem;border-bottom:2px solid #e2e8f0}.admin-layout{display:grid;grid-template-columns:minmax(0,1fr) 390px;gap:1rem;align-items:start}.admin-table-wrap{overflow:auto;border:1px solid #e2e8f0;border-radius:.75rem;background:#fff}.admin-table{width:100%;border-collapse:collapse;min-width:1080px}.admin-table th{background:#1e3a5f;color:#fff;text-align:left;font-size:.8125rem;padding:.75rem;white-space:nowrap;font-weight:700}.admin-table td{border-bottom:1px solid #e2e8f0;padding:.75rem;font-size:.875rem;vertical-align:middle}.admin-table tr{cursor:pointer;transition:background .15s}.admin-table tr:hover{background:#f8fafc}.admin-table tr.active{background:#eef2ff}.admin-badge{display:inline-block;border-radius:2rem;padding:.25rem .75rem;font-size:.75rem;font-weight:800;background:#e0f2fe;color:#075985;white-space:nowrap}.admin-badge.done{background:#dcfce7;color:#166534}.admin-badge.cancel{background:#fee2e2;color:#991b1b}.admin-price{text-align:right;font-weight:800;color:#1e3a5f;white-space:nowrap}.admin-detail{position:sticky;top:1rem}.admin-detail-empty{text-align:center;color:#94a3b8;padding:3rem 1rem}.admin-detail h2{font-size:1.125rem;color:#1e3a5f;margin:0 0 1rem;padding-bottom:.5rem;border-bottom:2px solid #e2e8f0}.admin-kv{display:grid;grid-template-columns:90px 1fr;gap:.5rem .75rem;font-size:.875rem;margin-bottom:1rem}.admin-kv b{color:#64748b}.admin-options{border-top:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0;padding:.5rem 0;margin:1rem 0;max-height:240px;overflow:auto}.admin-option{display:flex;justify-content:space-between;gap:.75rem;font-size:.8125rem;padding:.5rem 0;border-bottom:1px dashed #e2e8f0}.admin-option:last-child{border-bottom:0}.admin-sign{max-width:180px;max-height:80px;border:1px solid #e2e8f0;border-radius:.5rem;background:#fff;display:block;margin-top:.5rem}.admin-error{color:#b91c1c;font-size:.875rem;margin-top:.75rem;white-space:pre-wrap}.admin-loading{color:#64748b;font-size:.875rem;margin:.75rem 0}@media(max-width:900px){.admin-filters{grid-template-columns:1fr 1fr}.admin-layout{grid-template-columns:1fr}.admin-detail{position:static}.admin-title h1{font-size:1.75rem}.admin-top{padding:2rem 1rem}.admin-actions{margin-top:1rem}}`;
  document.head.appendChild(style);
}

function formatAdminDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
}

function formatAdminPrice(value) {
  return `${Number(value || 0).toLocaleString("ko-KR")}원`;
}

/** 휴대폰 뒷자리(저장값) 표시 — 숫자만 남겨 최대 4자리 */
function formatPhoneTailDisplay(value) {
  if (value == null || value === "") return "-";
  const d = String(value).replace(/\D/g, "");
  if (!d) return "-";
  return d.length <= 4 ? d : d.slice(-4);
}

function statusClass(status) {
  if (status === "계약완료") return "done";
  if (status === "취소") return "cancel";
  return "";
}

function csvEscape(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function downloadApplicationsCsv(rows) {
  const header = ["접수번호","접수일시","고객명","휴대폰뒷자리","동","호","타입","총액","상태","메모"];
  const body = rows.map((r) => [
    r.receipt_no,
    formatAdminDate(r.created_at),
    r.customer_name,
    formatPhoneTailDisplay(r.phone),
    r.dong,
    r.ho,
    r.unit_type,
    r.total_price,
    r.status,
    r.admin_memo
  ].map(csvEscape).join(","));

  const blob = new Blob(["﻿" + [header.map(csvEscape).join(","), ...body].join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `요진와이시티_옵션신청_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function isAdminRoute() {
  const hash = (window.location.hash || "").toLowerCase();
  const path = (window.location.pathname || "").toLowerCase();
  return hash.startsWith("#admin") || path.endsWith("/admin") || path.includes("/admin/");
}

function escapeHtmlAttr(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function renderAdminDashboardIfNeeded() {
  if (!isAdminRoute()) return;

  installAdminStyles();

  const root = document.getElementById("root");
  if (!root) return;

  root.innerHTML = `<div class="admin-wrap"><div class="admin-shell" id="yyc-admin-shell"></div></div>`;
  const shell = document.getElementById("yyc-admin-shell");

  const renderLogin = (message = "") => {
    shell.innerHTML = `<div class="admin-card admin-login"><div class="admin-title"><h1>관리자 로그인</h1><p>청량리역 요진 와이시티 옵션 신청 접수 관리</p></div><form id="admin-login-form"><div class="admin-field"><label>이메일</label><input class="admin-input" name="email" type="email" autocomplete="email" placeholder="관리자 이메일" required /></div><div class="admin-field"><label>비밀번호</label><input class="admin-input" name="password" type="password" autocomplete="current-password" placeholder="비밀번호" required /></div><button class="admin-btn" style="width:100%" type="submit">로그인</button>${message ? `<div class="admin-error">${message}</div>` : ""}</form></div>`;

    document.getElementById("admin-login-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const form = e.currentTarget;
      const btn = form.querySelector("button");
      btn.disabled = true;
      btn.textContent = "로그인 중...";

      try {
        const session = await supabaseAdminLogin(form.email.value, form.password.value);
        setAdminSession(session);
        await renderList();
      } catch (err) {
        renderLogin(err.message || "로그인에 실패했습니다.");
      }
    });
  };

  const renderList = async () => {
    if (!getAdminSession()?.access_token) {
      renderLogin();
      return;
    }

    shell.innerHTML = `<div class="admin-top"><div class="admin-title"><h1>옵션 신청 관리자</h1><p>고객이 신청완료를 누르면 접수 기록이 이곳에 저장됩니다.</p></div><div class="admin-actions"><button type="button" class="admin-btn secondary" id="admin-refresh">새로고침</button><button type="button" class="admin-btn secondary" id="admin-csv">CSV 다운로드</button><button type="button" class="admin-btn danger" id="admin-logout">로그아웃</button></div></div><div class="admin-card" id="yyc-admin-list-card"><div class="admin-loading">접수 목록을 불러오는 중...</div></div>`;

    document.getElementById("admin-logout").onclick = () => {
      clearAdminSession();
      renderLogin();
    };

    try {
      let rows = await adminFetchApplications();
      let filtered = [...rows];
      let selected = filtered[0] || null;

      const renderRows = () => {
        const listCard = shell.querySelector("#yyc-admin-list-card");
        if (!listCard) return;

        const keyword = (document.getElementById("admin-search")?.value || "").trim().toLowerCase();
        const status = document.getElementById("admin-status-filter")?.value || "";
        const unitType = document.getElementById("admin-type-filter")?.value || "";
        const dong = (document.getElementById("admin-dong-filter")?.value || "").trim();

        filtered = rows.filter((row) => {
          const haystack = [row.receipt_no,row.customer_name,row.dong,row.ho,row.unit_type,row.status,row.phone].join(" ").toLowerCase();
          return (!keyword || haystack.includes(keyword)) &&
            (!status || row.status === status) &&
            (!unitType || row.unit_type === unitType) &&
            (!dong || String(row.dong || "").includes(dong));
        });

        if (selected && !filtered.some((r) => r.id === selected.id)) selected = filtered[0] || null;

        const typeOptions = Array.from(new Set(rows.map((r) => r.unit_type).filter(Boolean)))
          .map((t) => `<option value="${escapeHtmlAttr(t)}">${escapeHtmlAttr(t)}</option>`).join("");

        const kwAttr = escapeHtmlAttr(keyword);
        const dongAttr = escapeHtmlAttr(dong);

        listCard.innerHTML = `<div class="admin-filters"><input id="admin-search" class="admin-input" placeholder="고객명/동호/휴대폰뒷자리/접수번호 검색" value="${kwAttr}" /><input id="admin-dong-filter" class="admin-input" placeholder="동 검색" value="${dongAttr}" /><select id="admin-type-filter" class="admin-select"><option value="">전체 타입</option>${typeOptions}</select><select id="admin-status-filter" class="admin-select"><option value="">전체 상태</option><option value="접수됨">접수됨</option><option value="확인중">확인중</option><option value="계약완료">계약완료</option><option value="취소">취소</option></select><button type="button" class="admin-btn danger" id="admin-filter-reset" title="저장된 모든 접수를 삭제합니다">초기화</button></div><div class="admin-layout"><div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>접수번호</th><th>접수일시</th><th>동/호</th><th>타입</th><th>총액</th><th>휴대폰 뒷자리</th><th>고객명</th><th>상태</th></tr></thead><tbody>${filtered.map((r) => `
                    <tr data-id="${r.id}" class="${selected?.id === r.id ? "active" : ""}">
                      <td style="font-size:12px;white-space:nowrap">${r.receipt_no || "-"}</td>
                      <td>${formatAdminDate(r.created_at)}</td>
                      <td>${r.dong || "-"}동 ${r.ho || "-"}호</td>
                      <td>${r.unit_type || "-"}</td>
                      <td class="admin-price">${formatAdminPrice(r.total_price)}</td>
                      <td>${formatPhoneTailDisplay(r.phone)}</td>
                      <td><b>${r.customer_name || "-"}</b></td>
                      <td><span class="admin-badge ${statusClass(r.status)}">${r.status || "접수됨"}</span></td>
                    </tr>
                  `).join("") || `<tr><td colspan="8" style="text-align:center;color:#94a3b8;padding:32px">접수 기록이 없습니다.</td></tr>`}</tbody></table></div><div class="admin-card admin-detail" id="admin-detail"></div></div>`;

        if (unitType) document.getElementById("admin-type-filter").value = unitType;
        if (status) document.getElementById("admin-status-filter").value = status;

        ["admin-search","admin-dong-filter","admin-type-filter","admin-status-filter"].forEach((id) => {
          document.getElementById(id).addEventListener("input", renderRows);
          document.getElementById(id).addEventListener("change", renderRows);
        });

        const resetBtn = document.getElementById("admin-filter-reset");
        if (resetBtn) {
          resetBtn.onclick = async (ev) => {
            ev.preventDefault();
            ev.stopPropagation();

            let ids = [];
            try {
              ids = await adminFetchAllApplicationIds();
            } catch {
              ids = rows.map((r) => r.id).filter(Boolean);
            }

            if (ids.length > 0) {
              if (
                !confirm(
                  "Supabase에 저장된 모든 접수(고객) 데이터를 삭제합니다. 복구할 수 없습니다. 계속할까요?"
                )
              ) {
                return;
              }
            }

            resetBtn.disabled = true;
            const prevLabel = resetBtn.textContent;
            resetBtn.textContent = "삭제 중...";

            try {
              if (ids.length > 0) {
                try {
                  await adminClearAllApplicationsRpc();
                } catch (rpcErr) {
                  if (!isAdminClearRpcMissing(rpcErr)) throw rpcErr;
                  await adminDeleteApplicationsByIds(ids);
                }
                const remaining = await adminFetchAllApplicationIds();
                if (remaining.length > 0) {
                  throw new Error(
                    `삭제 후에도 서버에 접수가 ${remaining.length}건 남아 있습니다.\n\nSupabase SQL Editor에서 supabase/sql/admin_clear_all_applications.sql 전체를 실행한 뒤 다시 초기화해 주세요.`
                  );
                }
              }

              const s = document.getElementById("admin-search");
              const d = document.getElementById("admin-dong-filter");
              const ty = document.getElementById("admin-type-filter");
              const st = document.getElementById("admin-status-filter");
              if (s) s.value = "";
              if (d) d.value = "";
              if (ty) ty.value = "";
              if (st) st.value = "";
              rows = [];
              selected = null;
              renderRows();
            } catch (err) {
              alert(parseSupabaseErrorMessage(err.message) || err.message || "삭제에 실패했습니다.");
              await renderList();
            } finally {
              resetBtn.disabled = false;
              resetBtn.textContent = prevLabel;
            }
          };
        }

        document.querySelectorAll(".admin-table tbody tr[data-id]").forEach((tr) => {
          tr.onclick = () => {
            selected = rows.find((r) => r.id === tr.dataset.id);
            renderRows();
          };
        });

        renderDetail();
      };

      const renderDetail = () => {
        const box = document.getElementById("admin-detail");
        if (!selected) {
          box.innerHTML = `<div class="admin-detail-empty">접수 항목을 선택하세요.</div>`;
          return;
        }

        const options = Array.isArray(selected.selected_options) ? selected.selected_options : [];

        box.innerHTML = `<h2>접수 상세</h2><div class="admin-kv"><b>접수번호</b><span>${selected.receipt_no || "-"}</span><b>접수일시</b><span>${formatAdminDate(selected.created_at)}</span><b>고객명</b><span>${selected.customer_name || "-"}</span><b>휴대폰 뒷자리</b><span>${formatPhoneTailDisplay(selected.phone)}</span><b>동/호</b><span>${selected.dong || "-"}동 ${selected.ho || "-"}호</span><b>타입</b><span>${selected.unit_type || "-"}</span><b>총액</b><span class="admin-price" style="text-align:left">${formatAdminPrice(selected.total_price)}</span></div><div class="admin-field"><label>처리 상태</label><select class="admin-select" id="admin-detail-status"><option value="접수됨">접수됨</option><option value="확인중">확인중</option><option value="계약완료">계약완료</option><option value="취소">취소</option></select></div><div class="admin-options">${options.map((o) => `
              <div class="admin-option">
                <span><b>${o.category || "-"}</b><br>${o.label || o.name || "-"}</span>
                <b>${formatAdminPrice(o.price)}</b>
              </div>
            `).join("") || `<div style="color:#94a3b8;font-size:13px">선택 옵션 없음</div>`}</div><div class="admin-field"><label>서명</label>${selected.signature_data_url ? `<img class="admin-sign" src="${selected.signature_data_url}" alt="서명" />` : `<span style="color:#94a3b8;font-size:13px">서명 없음</span>`}</div><div class="admin-field"><label>관리자 메모</label><textarea class="admin-textarea" id="admin-detail-memo" placeholder="확인 내용이나 특이사항을 입력하세요.">${selected.admin_memo || ""}</textarea></div><button class="admin-btn" id="admin-detail-save" style="width:100%">상태/메모 저장</button><div id="admin-detail-msg" class="admin-loading"></div>`;

        document.getElementById("admin-detail-status").value = selected.status || "접수됨";

        document.getElementById("admin-detail-save").onclick = async () => {
          const msg = document.getElementById("admin-detail-msg");
          msg.textContent = "저장 중...";

          try {
            const patch = {
              status: document.getElementById("admin-detail-status").value,
              admin_memo: document.getElementById("admin-detail-memo").value
            };
            const updated = (await adminUpdateApplication(selected.id, patch))[0];
            Object.assign(selected, updated || patch);
            const original = rows.find((r) => r.id === selected.id);
            if (original) Object.assign(original, selected);
            msg.textContent = "저장되었습니다.";
            renderRows();
          } catch (err) {
            msg.innerHTML = `<span class="admin-error">${err.message || "저장 실패"}</span>`;
          }
        };
      };

      shell.querySelector("#admin-refresh").onclick = renderList;
      shell.querySelector("#admin-csv").onclick = () => downloadApplicationsCsv(filtered.length ? filtered : rows);

      renderRows();
    } catch (err) {
      renderLogin(err.message || "관리자 화면을 불러오지 못했습니다.");
    }
  };

  renderList();
}

window.addEventListener("hashchange", () => {
  if (isAdminRoute()) renderAdminDashboardIfNeeded();
  else window.location.reload();
});

setTimeout(renderAdminDashboardIfNeeded, 0);

const TYPES = [
  {key:'43',name:'43㎡',opts:[
    {id:'living',cat:'거실마감재 특화',label:'거실 아트월(포세린타일, 600X1200) + 포세린타일(600X600) 바닥(복도,거실,주방) + 거실 천정 조명(상간접등, 하직부등)',base:'거실 아트월(포세린타일, 600X600) + 강마루 바닥(복도,거실,주방) + 거실 천정 직부등',price:3800000,notes:['※ 타일은 자재특성상 색상 및 무늬가 동일하지 않고 고유한 물성에 의하여 휠 발생이 생길수 있으며, 타일 나누기는 추가 또는 변경될수있습니다.','※ 아트월 설치 시 타일 이음새 구분이 발생되며 이음새 구분 위치 및 무늬결 및 재료분리대가 견본주택과 상이하게 설치될 수 있습니다.']},
    {id:'kitchen',cat:'주방 마감 특화',label:'주방 벽체 및 상판 엔지니어드 스톤',base:'주방 벽체 도기질타일(600X300,가로방향)및 상판 인조대리석',price:1500000,notes:['※ 인조대리석 및 석재 / 타일 자재의 경우 제조과정에 따라 무늬 및 색상이 다소 차이가 발생 할 수 있으며, 이는 하자 사항이 아닙니다.','※ 엔지니어드스톤, 인조대리석 등의 색상, 디자인, 재질, 단차, 코너, 마감재접합부, 패턴 등은 본 공사 시 견본주택과 다소 상이할 수 있습니다.','※ 설치되는 가구의 비노출면(후면, 하부, 천장)에는 마루, 타일, 도배, 천연가공석, 엔지니어드스톤 등 마감재가 시공되지 않습니다.']},
    {id:'closet_침실2',cat:'붙박이장',label:'침실2 붙박이장(여닫이)',base:'',price:1800000,notes:['▶ 기본 품목(미선택형): 실크벽지 / 유상 품목(선택형): 침실2 붙박이장','※ 붙박이장과 접해있는 벽, 바닥, 천장에는 마감재가 설치되지 않습니다.']},
    {id:'bath',cat:'욕실마감재 특화',label:'벽체 : 포세린 타일(600X600)',base:'벽체 : 도기질 타일(300X600, 세로방향)',price:500000,notes:['※ 타일은 자재특성상 색상 및 무늬가 동일하지 않고 고유한 물성에 의하여 휠 발생이 생길수 있으며, 타일 나누기는 추가 또는 변경될수있습니다.','※ 욕실 벽, 바닥 타일의 줄눈 위치가 일치하지 않을 수 있으며, 줄눈 및 타일 사이즈가 일정하지 않을 수 있습니다.']}
  ],ac:4700000,vent:600000,dual:false,floorPlan:'https://i.imgur.com/HiJ8Nbn.png',fridgeBaseImg:'https://i.imgur.com/FrICl3o.png',fridgeImg:'https://i.imgur.com/mHj5GjG.png'},
  {key:'48A',name:'48㎡A',opts:[
    {id:'living',cat:'거실마감재 특화',label:'거실 아트월(포세린타일, 600X1200) + 포세린타일(600X600) 바닥(복도,거실,주방) + 거실 천정 조명(상간접등, 하직부등)',base:'거실 아트월(포세린타일, 600X600) + 강마루 바닥(복도,거실,주방) + 거실 천정 직부등',price:3800000,notes:['※ 타일은 자재특성상 색상 및 무늬가 동일하지 않고 고유한 물성에 의하여 휠 발생이 생길수 있으며, 타일 나누기는 추가 또는 변경될수있습니다.','※ 아트월 설치 시 타일 이음새 구분이 발생되며 이음새 구분 위치 및 무늬결 및 재료분리대가 견본주택과 상이하게 설치될 수 있습니다.']},
    {id:'kitchen',cat:'주방 마감 특화',label:'주방 벽체 및 상판 엔지니어드 스톤',base:'주방 벽체 도기질타일(600X300,가로방향)및 상판 인조대리석',price:2700000,notes:['※ 인조대리석 및 석재 / 타일 자재의 경우 제조과정에 따라 무늬 및 색상이 다소 차이가 발생 할 수 있으며, 이는 하자 사항이 아닙니다.','※ 엔지니어드스톤, 인조대리석 등의 색상, 디자인, 재질, 단차, 코너, 마감재접합부, 패턴 등은 본 공사 시 견본주택과 다소 상이할 수 있습니다.','※ 설치되는 가구의 비노출면(후면, 하부, 천장)에는 마루, 타일, 도배, 천연가공석, 엔지니어드스톤 등 마감재가 시공되지 않습니다.']},
    {id:'closet_침실2',cat:'붙박이장',label:'침실2 붙박이장(여닫이)',base:'',price:1700000,notes:['▶ 기본 품목(미선택형): 실크벽지 / 유상 품목(선택형): 침실2 붙박이장','※ 붙박이장과 접해있는 벽, 바닥, 천장에는 마감재가 설치되지 않습니다.']},
    {id:'bath',cat:'욕실마감재 특화',label:'벽체 : 포세린 타일(600X600)',base:'벽체 : 도기질 타일(300X600, 세로방향)',price:500000,notes:['※ 타일은 자재특성상 색상 및 무늬가 동일하지 않고 고유한 물성에 의하여 휠 발생이 생길수 있으며, 타일 나누기는 추가 또는 변경될수있습니다.','※ 욕실 벽, 바닥 타일의 줄눈 위치가 일치하지 않을 수 있으며, 줄눈 및 타일 사이즈가 일정하지 않을 수 있습니다.']}
  ],ac:5800000,vent:600000,dual:false,floorPlan:'https://i.imgur.com/ThftPeK.png',fridgeBaseImg:'https://i.imgur.com/Wwqgatz.png',fridgeImg:'https://i.imgur.com/CUL8p92.png'},
  {key:'48B',name:'48㎡B',opts:[
    {id:'living',cat:'거실마감재 특화',label:'거실 아트월(포세린타일, 600X1200) + 포세린타일(600X600) 바닥(복도,거실,주방) + 거실 천정 조명(상간접등, 하직부등)',base:'거실 아트월(포세린타일, 600X600) + 강마루 바닥(복도,거실,주방) + 거실 천정 직부등',price:3800000,notes:['※ 타일은 자재특성상 색상 및 무늬가 동일하지 않고 고유한 물성에 의하여 휠 발생이 생길수 있으며, 타일 나누기는 추가 또는 변경될수있습니다.','※ 아트월 설치 시 타일 이음새 구분이 발생되며 이음새 구분 위치 및 무늬결 및 재료분리대가 견본주택과 상이하게 설치될 수 있습니다.']},
    {id:'kitchen',cat:'주방 마감 특화',label:'주방 벽체 및 상판 엔지니어드 스톤',base:'주방 벽체 도기질타일(600X300,가로방향)및 상판 인조대리석',price:2700000,notes:['※ 인조대리석 및 석재 / 타일 자재의 경우 제조과정에 따라 무늬 및 색상이 다소 차이가 발생 할 수 있으며, 이는 하자 사항이 아닙니다.','※ 엔지니어드스톤, 인조대리석 등의 색상, 디자인, 재질, 단차, 코너, 마감재접합부, 패턴 등은 본 공사 시 견본주택과 다소 상이할 수 있습니다.','※ 설치되는 가구의 비노출면(후면, 하부, 천장)에는 마루, 타일, 도배, 천연가공석, 엔지니어드스톤 등 마감재가 시공되지 않습니다.']},
    {id:'closet_침실2',cat:'붙박이장',label:'침실2 붙박이장(여닫이)',base:'',price:1700000,notes:['▶ 기본 품목(미선택형): 실크벽지 / 유상 품목(선택형): 침실2 붙박이장','※ 붙박이장과 접해있는 벽, 바닥, 천장에는 마감재가 설치되지 않습니다.']},
    {id:'bath',cat:'욕실마감재 특화',label:'벽체 : 포세린 타일(600X600)',base:'벽체 : 도기질 타일(300X600, 세로방향)',price:500000,notes:['※ 타일은 자재특성상 색상 및 무늬가 동일하지 않고 고유한 물성에 의하여 휠 발생이 생길수 있으며, 타일 나누기는 추가 또는 변경될수있습니다.','※ 욕실 벽, 바닥 타일의 줄눈 위치가 일치하지 않을 수 있으며, 줄눈 및 타일 사이즈가 일정하지 않을 수 있습니다.']}
  ],ac:5800000,vent:600000,dual:false},
  {key:'52A',name:'52㎡A',opts:[
    {id:'living',cat:'거실마감재 특화',label:'거실 아트월(포세린타일, 600X1200) + 포세린타일(600X600) 바닥(복도,거실,주방) + 거실 천정 조명(상간접등, 하직부등)',base:'거실 아트월(포세린타일, 600X600) + 강마루 바닥(복도,거실,주방) + 거실 천정 직부등',price:4000000,notes:['※ 타일은 자재특성상 색상 및 무늬가 동일하지 않고 고유한 물성에 의하여 휠 발생이 생길수 있으며, 타일 나누기는 추가 또는 변경될수있습니다.','※ 아트월 설치 시 타일 이음새 구분이 발생되며 이음새 구분 위치 및 무늬결 및 재료분리대가 견본주택과 상이하게 설치될 수 있습니다.']},
    {id:'kitchen',cat:'주방 마감 특화',label:'주방 벽체 및 상판 엔지니어드 스톤',base:'주방 벽체 도기질타일(600X300,가로방향)및 상판 인조대리석',price:2700000,notes:['※ 인조대리석 및 석재 / 타일 자재의 경우 제조과정에 따라 무늬 및 색상이 다소 차이가 발생 할 수 있으며, 이는 하자 사항이 아닙니다.','※ 엔지니어드스톤, 인조대리석 등의 색상, 디자인, 재질, 단차, 코너, 마감재접합부, 패턴 등은 본 공사 시 견본주택과 다소 상이할 수 있습니다.','※ 설치되는 가구의 비노출면(후면, 하부, 천장)에는 마루, 타일, 도배, 천연가공석, 엔지니어드스톤 등 마감재가 시공되지 않습니다.']},
    {id:'closet_침실2',cat:'붙박이장',label:'침실2 붙박이장(여닫이)',base:'',price:2200000,notes:['▶ 기본 품목(미선택형): 실크벽지 / 유상 품목(선택형): 침실2 붙박이장','※ 붙박이장과 접해있는 벽, 바닥, 천장에는 마감재가 설치되지 않습니다.']},
    {id:'bath',cat:'욕실마감재 특화',label:'벽체 : 포세린 타일(600X600)',base:'벽체 : 도기질 타일(300X600, 세로방향)',price:500000,notes:['※ 타일은 자재특성상 색상 및 무늬가 동일하지 않고 고유한 물성에 의하여 휠 발생이 생길수 있으며, 타일 나누기는 추가 또는 변경될수있습니다.','※ 욕실 벽, 바닥 타일의 줄눈 위치가 일치하지 않을 수 있으며, 줄눈 및 타일 사이즈가 일정하지 않을 수 있습니다.']},
    {id:'space',cat:'공간(드레스룸) 특화',label:'침실1 가구도어+시스템선반',base:'',price:2100000,notes:['※ 공간특화 옵션 선택 시 부위별 가구 설치 및 레이아웃이 변경될 수 있습니다.','※ 공간특화 옵션 선택 시 타입별 위치에 따라 가구의 방향이 상이할 수 있으니 계약 시 필히 확인하시기 바랍니다.']}
  ],ac:4700000,vent:600000,dual:false},
  {key:'52B',name:'52㎡B',opts:[
    {id:'living',cat:'거실마감재 특화',label:'거실 아트월(포세린타일, 600X1200) + 포세린타일(600X600) 바닥(복도,거실,주방) + 거실 천정 조명(상간접등, 하직부등)',base:'거실 아트월(포세린타일, 600X600) + 강마루 바닥(복도,거실,주방) + 거실 천정 직부등',price:4000000,notes:['※ 타일은 자재특성상 색상 및 무늬가 동일하지 않고 고유한 물성에 의하여 휠 발생이 생길수 있으며, 타일 나누기는 추가 또는 변경될수있습니다.','※ 아트월 설치 시 타일 이음새 구분이 발생되며 이음새 구분 위치 및 무늬결 및 재료분리대가 견본주택과 상이하게 설치될 수 있습니다.']},
    {id:'kitchen',cat:'주방 마감 특화',label:'주방 벽체 및 상판 엔지니어드 스톤',base:'주방 벽체 도기질타일(600X300,가로방향)및 상판 인조대리석',price:2100000,notes:['※ 인조대리석 및 석재 / 타일 자재의 경우 제조과정에 따라 무늬 및 색상이 다소 차이가 발생 할 수 있으며, 이는 하자 사항이 아닙니다.','※ 엔지니어드스톤, 인조대리석 등의 색상, 디자인, 재질, 단차, 코너, 마감재접합부, 패턴 등은 본 공사 시 견본주택과 다소 상이할 수 있습니다.','※ 설치되는 가구의 비노출면(후면, 하부, 천장)에는 마루, 타일, 도배, 천연가공석, 엔지니어드스톤 등 마감재가 시공되지 않습니다.']},
    {id:'closet_침실2',cat:'붙박이장',label:'침실2 붙박이장(여닫이)',base:'',price:1800000,notes:['▶ 기본 품목(미선택형): 실크벽지 / 유상 품목(선택형): 침실2 붙박이장','※ 붙박이장과 접해있는 벽, 바닥, 천장에는 마감재가 설치되지 않습니다.']},
    {id:'bath',cat:'욕실마감재 특화',label:'벽체 : 포세린 타일(600X600)',base:'벽체 : 도기질 타일(300X600, 세로방향)',price:500000,notes:['※ 타일은 자재특성상 색상 및 무늬가 동일하지 않고 고유한 물성에 의하여 휠 발생이 생길수 있으며, 타일 나누기는 추가 또는 변경될수있습니다.','※ 욕실 벽, 바닥 타일의 줄눈 위치가 일치하지 않을 수 있으며, 줄눈 및 타일 사이즈가 일정하지 않을 수 있습니다.']},
    {id:'space',cat:'공간(드레스룸) 특화',label:'침실3 가구도어+시스템선반',base:'',price:1100000,notes:['※ 공간특화 옵션 선택 시 부위별 가구 설치 및 레이아웃이 변경될 수 있습니다.','※ 공간특화 옵션 선택 시 타입별 위치에 따라 가구의 방향이 상이할 수 있으니 계약 시 필히 확인하시기 바랍니다.']}
  ],ac:5800000,vent:600000,dual:false},
  {key:'52C',name:'52㎡C',opts:[
    {id:'living',cat:'거실마감재 특화',label:'거실 아트월(포세린타일, 600X1200) + 포세린타일(600X600) 바닥(복도,거실,주방) + 거실 천정 조명(상간접등, 하직부등)',base:'거실 아트월(포세린타일, 600X600) + 강마루 바닥(복도,거실,주방) + 거실 천정 직부등',price:4100000,notes:['※ 타일은 자재특성상 색상 및 무늬가 동일하지 않고 고유한 물성에 의하여 휠 발생이 생길수 있으며, 타일 나누기는 추가 또는 변경될수있습니다.','※ 아트월 설치 시 타일 이음새 구분이 발생되며 이음새 구분 위치 및 무늬결 및 재료분리대가 견본주택과 상이하게 설치될 수 있습니다.']},
    {id:'kitchen',cat:'주방 마감 특화',label:'주방 벽체 및 상판 엔지니어드 스톤',base:'주방 벽체 도기질타일(600X300,가로방향)및 상판 인조대리석',price:1500000,notes:['※ 인조대리석 및 석재 / 타일 자재의 경우 제조과정에 따라 무늬 및 색상이 다소 차이가 발생 할 수 있으며, 이는 하자 사항이 아닙니다.','※ 엔지니어드스톤, 인조대리석 등의 색상, 디자인, 재질, 단차, 코너, 마감재접합부, 패턴 등은 본 공사 시 견본주택과 다소 상이할 수 있습니다.','※ 설치되는 가구의 비노출면(후면, 하부, 천장)에는 마루, 타일, 도배, 천연가공석, 엔지니어드스톤 등 마감재가 시공되지 않습니다.']},
    {id:'closet_침실2',cat:'붙박이장',label:'침실2 붙박이장(여닫이)',base:'',price:2200000,notes:['▶ 기본 품목(미선택형): 실크벽지 / 유상 품목(선택형): 침실2 붙박이장','※ 붙박이장과 접해있는 벽, 바닥, 천장에는 마감재가 설치되지 않습니다.']},
    {id:'bath',cat:'욕실마감재 특화',label:'벽체 : 포세린 타일(600X600)',base:'벽체 : 도기질 타일(300X600, 세로방향)',price:500000,notes:['※ 타일은 자재특성상 색상 및 무늬가 동일하지 않고 고유한 물성에 의하여 휠 발생이 생길수 있으며, 타일 나누기는 추가 또는 변경될수있습니다.','※ 욕실 벽, 바닥 타일의 줄눈 위치가 일치하지 않을 수 있으며, 줄눈 및 타일 사이즈가 일정하지 않을 수 있습니다.']},
    {id:'space',cat:'공간(드레스룸) 특화',label:'침실1 가구도어+시스템선반',base:'',price:2100000,notes:['※ 공간특화 옵션 선택 시 부위별 가구 설치 및 레이아웃이 변경될 수 있습니다.','※ 공간특화 옵션 선택 시 타입별 위치에 따라 가구의 방향이 상이할 수 있으니 계약 시 필히 확인하시기 바랍니다.']}
  ],ac:4700000,vent:600000,dual:false},
  {key:'55A',name:'55㎡A',opts:[
    {id:'living',cat:'거실마감재 특화',label:'거실 아트월(포세린타일, 600X1200) + 포세린타일(600X600) 바닥(복도,거실,주방) + 거실 천정 조명(상간접등, 하직부등)',base:'거실 아트월(포세린타일, 600X600) + 강마루 바닥(복도,거실,주방) + 거실 천정 직부등',price:4500000,notes:['※ 타일은 자재특성상 색상 및 무늬가 동일하지 않고 고유한 물성에 의하여 휠 발생이 생길수 있으며, 타일 나누기는 추가 또는 변경될수있습니다.','※ 아트월 설치 시 타일 이음새 구분이 발생되며 이음새 구분 위치 및 무늬결 및 재료분리대가 견본주택과 상이하게 설치될 수 있습니다.']},
    {id:'kitchen',cat:'주방 마감 및 가구 특화',label:'주방 벽체 및 상판 엔지니어드 스톤 + 주방가구(아일랜드장)',base:'주방 벽체 도기질타일(600X300,가로방향)및 상판 인조대리석',price:4800000,notes:['※ 인조대리석 및 석재 / 타일 자재의 경우 제조과정에 따라 무늬 및 색상이 다소 차이가 발생 할 수 있으며, 이는 하자 사항이 아닙니다.','※ 엔지니어드스톤, 인조대리석 등의 색상, 디자인, 재질, 단차, 코너, 마감재접합부, 패턴 등은 본 공사 시 견본주택과 다소 상이할 수 있습니다.','※ 설치되는 가구의 비노출면(후면, 하부, 천장)에는 마루, 타일, 도배, 천연가공석, 엔지니어드스톤 등 마감재가 시공되지 않습니다.']},
    {id:'closet_침실2',cat:'붙박이장',label:'침실2 붙박이장(여닫이)',base:'',price:1700000,notes:['▶ 기본 품목(미선택형): 실크벽지 / 유상 품목(선택형): 침실2 붙박이장','※ 붙박이장과 접해있는 벽, 바닥, 천장에는 마감재가 설치되지 않습니다.']},
    {id:'bath',cat:'욕실마감재 특화',label:'벽체 : 포세린 타일(600X600)',base:'벽체 : 도기질 타일(300X600, 세로방향)',price:500000,notes:['※ 타일은 자재특성상 색상 및 무늬가 동일하지 않고 고유한 물성에 의하여 휠 발생이 생길수 있으며, 타일 나누기는 추가 또는 변경될수있습니다.','※ 욕실 벽, 바닥 타일의 줄눈 위치가 일치하지 않을 수 있으며, 줄눈 및 타일 사이즈가 일정하지 않을 수 있습니다.']},
    {id:'space',cat:'공간(드레스룸) 특화',label:'침실1 가변형벽체(침실1/침실3 통합형)+가구도어+시스템선반',base:'',price:1100000,notes:['※ 공간특화 옵션 선택 시 부위별 가구 설치 및 레이아웃이 변경될 수 있습니다.','※ 공간특화 옵션 선택 시 타입별 위치에 따라 가구의 방향이 상이할 수 있으니 계약 시 필히 확인하시기 바랍니다.']}
  ],ac:5800000,vent:600000,dual:false},
  {key:'55B',name:'55㎡B',opts:[
    {id:'living',cat:'거실마감재 특화',label:'거실 아트월(포세린타일, 600X1200) + 포세린타일(600X600) 바닥(복도,거실,주방) + 거실 천정 조명(상간접등, 하직부등)',base:'거실 아트월(포세린타일, 600X600) + 강마루 바닥(복도,거실,주방) + 거실 천정 직부등',price:4000000,notes:['※ 타일은 자재특성상 색상 및 무늬가 동일하지 않고 고유한 물성에 의하여 휠 발생이 생길수 있으며, 타일 나누기는 추가 또는 변경될수있습니다.','※ 아트월 설치 시 타일 이음새 구분이 발생되며 이음새 구분 위치 및 무늬결 및 재료분리대가 견본주택과 상이하게 설치될 수 있습니다.']},
    {id:'kitchen',cat:'주방 마감 및 가구 특화',label:'주방 벽체 및 상판 엔지니어드 스톤 + 주방가구(아일랜드장)',base:'주방 벽체 도기질타일(600X300,가로방향)및 상판 인조대리석',price:4400000,notes:['※ 인조대리석 및 석재 / 타일 자재의 경우 제조과정에 따라 무늬 및 색상이 다소 차이가 발생 할 수 있으며, 이는 하자 사항이 아닙니다.','※ 엔지니어드스톤, 인조대리석 등의 색상, 디자인, 재질, 단차, 코너, 마감재접합부, 패턴 등은 본 공사 시 견본주택과 다소 상이할 수 있습니다.','※ 설치되는 가구의 비노출면(후면, 하부, 천장)에는 마루, 타일, 도배, 천연가공석, 엔지니어드스톤 등 마감재가 시공되지 않습니다.']},
    {id:'closet_침실1',cat:'붙박이장',label:'침실1 붙박이장(여닫이)',base:'',price:1600000,notes:['▶ 기본 품목(미선택형): 실크벽지 / 유상 품목(선택형): 침실1 붙박이장','※ 붙박이장과 접해있는 벽, 바닥, 천장에는 마감재가 설치되지 않습니다.']},
    {id:'bath',cat:'욕실마감재 특화',label:'벽체 : 포세린 타일(600X600)',base:'벽체 : 도기질 타일(300X600, 세로방향)',price:500000,notes:['※ 타일은 자재특성상 색상 및 무늬가 동일하지 않고 고유한 물성에 의하여 휠 발생이 생길수 있으며, 타일 나누기는 추가 또는 변경될수있습니다.','※ 욕실 벽, 바닥 타일의 줄눈 위치가 일치하지 않을 수 있으며, 줄눈 및 타일 사이즈가 일정하지 않을 수 있습니다.']},
    {id:'space',cat:'공간(드레스룸) 특화',label:'침실3 가구도어+시스템선반+화장대+주방 수납장',base:'',price:4100000,notes:['※ 공간특화 옵션 선택 시 부위별 가구 설치 및 레이아웃이 변경될 수 있습니다.','※ 공간특화 옵션 선택 시 타입별 위치에 따라 가구의 방향이 상이할 수 있으니 계약 시 필히 확인하시기 바랍니다.']}
  ],ac:5800000,vent:600000,dual:false},
  {key:'59A',name:'59㎡A',opts:[
    {id:'wall',cat:'벽 마감재 특화',label:'벽(현관, 복도, 거실, 주방) 시트 판넬',base:'실크 벽지',price:3400000},
    {id:'living',cat:'거실마감재 특화',label:'거실 아트월(포세린타일, 600X1200) + 포세린타일(600X600) 바닥(복도,거실,주방) + 거실 천정 조명(상간접등, 하직부등)',base:'거실 아트월(포세린타일, 600X600) + 강마루 바닥(복도,거실,주방) + 거실 천정 직부등',price:4200000,notes:['※ 타일은 자재특성상 색상 및 무늬가 동일하지 않고 고유한 톤에서 미세한 차이가 발생할 수 있으며, 타일 나누기는 추가 또는 변경될 수 있습니다.','※ 아트월 설치 시 타일 이음새 구분이 발생하며 제조과정에 따라 건별 주택에 상이하게 설치될 수 있습니다.']},
    {id:'bath',cat:'욕실마감재 특화',label:'벽체 : 포세린 타일(600X600)',base:'벽체 : 도기질 타일(300X600, 세로방향)',price:800000,notes:['※ 타일은 자재특성상 색상 및 무늬가 동일하지 않고 고유한 물성에 의하여 휠 발생이 생길수 있으며, 타일 나누기는 추가 또는 변경될수있습니다.','※ 욕실 벽, 바닥 타일의 줄눈의 위치가 일치하지 않을 수 있으며, 줄눈 및 타일 사이즈가 일정하지 않을 수 있습니다.']},
    {id:'kitchen',cat:'주방 마감 및 가구 특화',label:'주방 벽체 및 상판 엔지니어드 스톤 + 주방가구(아일랜드장)',base:'주방 벽체 도기질타일(600X300, 가로방향) + 상판 인조대리석',price:4500000,baseImg:'https://i.imgur.com/y8vaEXd.png',img:'https://i.imgur.com/ukypmcj.png',notes:['※ 인조대리석 및 석재 / 타일 자재의 경우 제조과정에 따라 무늬 및 색상이 다소 차이가 발생 할 수 있으며, 이는 하자 사항이 아닙니다.','※ 엔지니어드스톤, 인조대리석 등의 색상, 디자인, 재질, 단차, 코너, 마감재접합부, 패턴 등은 본 공사 시 견본주택과 다소 상이할 수 있습니다.','※ 설치되는 가구의 비노출면(후면, 하부, 천장)에는 마루, 타일, 도배, 천연가공석, 엔지니어드스톤 등 마감재가 시공되지 않습니다.']},
    {id:'closet_침실1',cat:'붙박이장',label:'침실1 붙박이장(슬라이딩)',base:'',price:3900000,baseImg:'https://i.imgur.com/NMrqttd.png',img:'https://i.imgur.com/Q3MsWer.png'},
    {id:'closet_침실2',cat:'붙박이장',label:'침실2 붙박이장(여닫이)',base:'',price:1700000,group:'g59A',notes:['▶ 기본 품목(미선택형): 실크벽지 / 유상 품목(선택형): 침실1 붙박이장 + 화장대, 침실2 붙박이장','※ 붙박이장과 접해있는 벽, 바닥, 천장에는 마감재가 설치되지 않습니다.','※ 침실2 붙박이장 옵션 선택시 공간특화(드레스룸) 선택 불가하니 참고 바랍니다']},
    {id:'space',cat:'공간(드레스룸) 특화',label:'가변형벽체(침실2/침실3 통합)+가구도어+시스템선반',base:'',price:1200000,baseImg:'https://i.imgur.com/lMFgSQC.png',img:'https://i.imgur.com/APPHDdE.png',group:'g59A',notes:['※ 공간특화 옵션 선택 시 부위별 가구 설치 및 레이아웃이 변경될 수 있습니다.','※ 공간특화 옵션 선택시 침실2 붙박이장 옵션 선택 불가하오니 참고 바랍니다.']},
  ],ac:6400000,vent:1200000,dual:true,floorPlan:'https://i.imgur.com/UW6y8Yf.png'},
  {key:'59B',name:'59㎡B',opts:[
    {id:'wall',cat:'벽 마감재 특화',label:'벽(현관, 복도, 거실, 주방) 시트 판넬',base:'실크 벽지',price:3300000},
    {id:'living',cat:'거실마감재 특화',label:'거실 아트월(포세린타일, 600X1200) + 포세린타일(600X600) 바닥(복도,거실,주방) + 거실 천정 조명(상간접등, 하직부등)',base:'거실 아트월(포세린타일, 600X600) + 강마루 바닥(복도,거실,주방) + 거실 천정 직부등',price:4100000,notes:['※ 타일은 자재특성상 색상 및 무늬가 동일하지 않고 고유한 물성에 의하여 휠 발생이 생길수 있으며, 타일 나누기는 추가 또는 변경될수있습니다.','※ 아트월 설치 시 타일 이음새 구분이 발생되며 이음새 구분 위치 및 무늬결 및 재료분리대가 견본주택과 상이하게 설치될 수 있습니다.']},
    {id:'bath',cat:'욕실마감재 특화',label:'벽체 : 포세린 타일(600X600)',base:'벽체 : 도기질 타일(300X600, 세로방향)',price:800000,notes:['※ 타일은 자재특성상 색상 및 무늬가 동일하지 않고 고유한 물성에 의하여 휠 발생이 생길수 있으며, 타일 나누기는 추가 또는 변경될수있습니다.','※ 욕실 벽, 바닥 타일의 줄눈 위치가 일치하지 않을 수 있으며, 줄눈 및 타일 사이즈가 일정하지 않을 수 있습니다.']},
    {id:'kitchen',cat:'주방 마감 및 가구 특화',label:'주방 벽체 및 상판 엔지니어드 스톤 + 주방가구(아일랜드장)',base:'주방 벽체 도기질타일(600X300,가로방향)및 상판 인조대리석',price:3800000,notes:['※ 인조대리석 및 석재 / 타일 자재의 경우 제조과정에 따라 무늬 및 색상이 다소 차이가 발생 할 수 있으며, 이는 하자 사항이 아닙니다.','※ 엔지니어드스톤, 인조대리석 등의 색상, 디자인, 재질, 단차, 코너, 마감재접합부, 패턴 등은 본 공사 시 견본주택과 다소 상이할 수 있습니다.','※ 설치되는 가구의 비노출면(후면, 하부, 천장)에는 마루, 타일, 도배, 천연가공석, 엔지니어드스톤 등 마감재가 시공되지 않습니다.']},
    {id:'closet_침실1',cat:'붙박이장',label:'침실1 붙박이장(슬라이딩)',base:'',price:3900000},
    {id:'closet_침실2',cat:'붙박이장',label:'침실2 붙박이장(여닫이)',base:'',price:1700000,group:'g59B',notes:['▶ 기본 품목(미선택형): 실크벽지 / 유상 품목(선택형): 침실1 붙박이장, 침실2 붙박이장','※ 붙박이장과 접해있는 벽, 바닥, 천장에는 마감재가 설치되지 않습니다.','※ 침실2 붙박이장 옵션 선택시 공간특화(드레스룸) 선택 불가하니 참고 바랍니다']},
    {id:'space',cat:'공간(드레스룸) 특화',label:'가변형벽체(침실2/침실3 통합형)+가구도어+시스템선반',base:'',price:1200000,group:'g59B',notes:['※ 공간특화 옵션 선택 시 부위별 가구 설치 및 레이아웃이 변경될 수 있습니다.','※ 공간특화 옵션 선택시 침실2 붙박이장 옵션 선택 불가하오니 참고 바랍니다.']}
  ],ac:6400000,vent:1200000,dual:true},
  {key:'59C',name:'59㎡C',opts:[
    {id:'wall',cat:'벽 마감재 특화',label:'벽(현관, 복도, 거실, 주방) 시트 판넬',base:'실크 벽지',price:2800000},
    {id:'living',cat:'거실마감재 특화',label:'거실 아트월(포세린타일, 600X1200) + 포세린타일(600X600) 바닥(복도,거실,주방) + 거실 천정 조명(상간접등, 하직부등)',base:'거실 아트월(포세린타일, 600X600) + 강마루 바닥(복도,거실,주방) + 거실 천정 직부등',price:4100000,notes:['※ 타일은 자재특성상 색상 및 무늬가 동일하지 않고 고유한 물성에 의하여 휠 발생이 생길수 있으며, 타일 나누기는 추가 또는 변경될수있습니다.','※ 아트월 설치 시 타일 이음새 구분이 발생되며 이음새 구분 위치 및 무늬결 및 재료분리대가 견본주택과 상이하게 설치될 수 있습니다.']},
    {id:'bath',cat:'욕실마감재 특화',label:'벽체 : 포세린 타일(600X600)',base:'벽체 : 도기질 타일(300X600, 세로방향)',price:700000,notes:['※ 타일은 자재특성상 색상 및 무늬가 동일하지 않고 고유한 물성에 의하여 휠 발생이 생길수 있으며, 타일 나누기는 추가 또는 변경될수있습니다.','※ 욕실 벽, 바닥 타일의 줄눈 위치가 일치하지 않을 수 있으며, 줄눈 및 타일 사이즈가 일정하지 않을 수 있습니다.']},
    {id:'kitchen',cat:'주방 마감 및 가구 특화',label:'주방 벽체 및 상판 엔지니어드 스톤 + 주방가구(아일랜드장)',base:'주방 벽체 도기질타일(600X300,가로방향)및 상판 인조대리석',price:2400000,notes:['※ 인조대리석 및 석재 / 타일 자재의 경우 제조과정에 따라 무늬 및 색상이 다소 차이가 발생 할 수 있으며, 이는 하자 사항이 아닙니다.','※ 엔지니어드스톤, 인조대리석 등의 색상, 디자인, 재질, 단차, 코너, 마감재접합부, 패턴 등은 본 공사 시 견본주택과 다소 상이할 수 있습니다.','※ 설치되는 가구의 비노출면(후면, 하부, 천장)에는 마루, 타일, 도배, 천연가공석, 엔지니어드스톤 등 마감재가 시공되지 않습니다.']},
    {id:'closet_침실1',cat:'붙박이장',label:'침실1 화장대+수납장(장식장)+드레스룸도어+시스템선반',base:'',price:5300000},
    {id:'closet_침실2',cat:'붙박이장',label:'침실2 붙박이장(여닫이)',base:'',price:1700000,group:'g59C',notes:['▶ 기본 품목(미선택형): 실크벽지 / 유상 품목(선택형): 침실1 붙박이장 + 화장대, 침실2 붙박이장','※ 붙박이장과 접해있는 벽, 바닥, 천장에는 마감재가 설치되지 않습니다.','※ 침실2 붙박이장 옵션 선택시 공간특화(드레스룸) 선택 불가하니 참고 바랍니다']},
    {id:'space',cat:'공간(드레스룸) 특화',label:'가변형벽체(침실2/침실3 통합형)+가구도어+시스템선반',base:'',price:1300000,group:'g59C',notes:['※ 공간특화 옵션 선택 시 부위별 가구 설치 및 레이아웃이 변경될 수 있습니다.','※ 공간특화 옵션 선택시 침실2 붙박이장 옵션 선택 불가하오니 참고 바랍니다.']}
  ],ac:6400000,vent:1200000,dual:true},
  {key:'59D',name:'59㎡D',opts:[
    {id:'wall',cat:'벽 마감재 특화',label:'벽(현관, 복도, 거실, 주방) 시트 판넬',base:'실크 벽지',price:2800000},
    {id:'living',cat:'거실마감재 특화',label:'거실 아트월(포세린타일, 600X1200) + 포세린타일(600X600) 바닥(복도,거실,주방) + 거실 천정 조명(상간접등, 하직부등)',base:'거실 아트월(포세린타일, 600X600) + 강마루 바닥(복도,거실,주방) + 거실 천정 직부등',price:4100000,notes:['※ 타일은 자재특성상 색상 및 무늬가 동일하지 않고 고유한 물성에 의하여 휠 발생이 생길수 있으며, 타일 나누기는 추가 또는 변경될수있습니다.','※ 아트월 설치 시 타일 이음새 구분이 발생되며 이음새 구분 위치 및 무늬결 및 재료분리대가 견본주택과 상이하게 설치될 수 있습니다.']},
    {id:'bath',cat:'욕실마감재 특화',label:'벽체 : 포세린 타일(600X600)',base:'벽체 : 도기질 타일(300X600, 세로방향)',price:700000,notes:['※ 타일은 자재특성상 색상 및 무늬가 동일하지 않고 고유한 물성에 의하여 휠 발생이 생길수 있으며, 타일 나누기는 추가 또는 변경될수있습니다.','※ 욕실 벽, 바닥 타일의 줄눈 위치가 일치하지 않을 수 있으며, 줄눈 및 타일 사이즈가 일정하지 않을 수 있습니다.']},
    {id:'kitchen',cat:'주방 마감 및 가구 특화',label:'주방 벽체 및 상판 엔지니어드 스톤 + 주방가구(아일랜드장)',base:'주방 벽체 도기질타일(600X300,가로방향)및 상판 인조대리석',price:2400000,notes:['※ 인조대리석 및 석재 / 타일 자재의 경우 제조과정에 따라 무늬 및 색상이 다소 차이가 발생 할 수 있으며, 이는 하자 사항이 아닙니다.','※ 엔지니어드스톤, 인조대리석 등의 색상, 디자인, 재질, 단차, 코너, 마감재접합부, 패턴 등은 본 공사 시 견본주택과 다소 상이할 수 있습니다.','※ 설치되는 가구의 비노출면(후면, 하부, 천장)에는 마루, 타일, 도배, 천연가공석, 엔지니어드스톤 등 마감재가 시공되지 않습니다.']},
    {id:'closet_침실1',cat:'붙박이장',label:'침실1 붙박이장(슬라이딩)+화장대',base:'',price:6800000},
    {id:'closet_침실2',cat:'붙박이장',label:'침실2 붙박이장(여닫이)',base:'',price:1700000,group:'g59D',notes:['▶ 기본 품목(미선택형): 실크벽지 / 유상 품목(선택형): 침실1 붙박이장 + 화장대, 침실2 붙박이장','※ 붙박이장과 접해있는 벽, 바닥, 천장에는 마감재가 설치되지 않습니다.','※ 침실2 붙박이장 옵션 선택시 공간특화(드레스룸) 선택 불가하니 참고 바랍니다']},
    {id:'space',cat:'공간(드레스룸) 특화',label:'가변형벽체(침실2/침실3 통합형)+가구도어+시스템선반',base:'',price:1300000,group:'g59D',notes:['※ 공간특화 옵션 선택 시 부위별 가구 설치 및 레이아웃이 변경될 수 있습니다.','※ 공간특화 옵션 선택시 침실2 붙박이장 옵션 선택 불가하오니 참고 바랍니다.']}
  ],ac:6400000,vent:1200000,dual:true},
  {key:'59E',name:'59㎡E',opts:[
    {id:'wall',cat:'벽 마감재 특화',label:'벽(현관, 복도, 거실, 주방) 시트 판넬',base:'실크 벽지',price:2500000},
    {id:'living',cat:'거실마감재 특화',label:'거실 아트월(포세린타일, 600X1200) + 포세린타일(600X600) 바닥(복도,거실,주방) + 거실 천정 조명(상간접등, 하직부등)',base:'거실 아트월(포세린타일, 600X600) + 강마루 바닥(복도,거실,주방) + 거실 천정 직부등',price:4600000,notes:['※ 타일은 자재특성상 색상 및 무늬가 동일하지 않고 고유한 물성에 의하여 휠 발생이 생길수 있으며, 타일 나누기는 추가 또는 변경될수있습니다.','※ 아트월 설치 시 타일 이음새 구분이 발생되며 이음새 구분 위치 및 무늬결 및 재료분리대가 견본주택과 상이하게 설치될 수 있습니다.']},
    {id:'bath',cat:'욕실마감재 특화',label:'벽체 : 포세린 타일(600X600)',base:'벽체 : 도기질 타일(300X600, 세로방향)',price:700000,notes:['※ 타일은 자재특성상 색상 및 무늬가 동일하지 않고 고유한 물성에 의하여 휠 발생이 생길수 있으며, 타일 나누기는 추가 또는 변경될수있습니다.','※ 욕실 벽, 바닥 타일의 줄눈 위치가 일치하지 않을 수 있으며, 줄눈 및 타일 사이즈가 일정하지 않을 수 있습니다.']},
    {id:'kitchen',cat:'주방 마감 특화',label:'주방 벽체 및 상판 엔지니어드 스톤',base:'주방 벽체 도기질타일(600X300,가로방향)및 상판 인조대리석',price:4600000,notes:['※ 인조대리석 및 석재 / 타일 자재의 경우 제조과정에 따라 무늬 및 색상이 다소 차이가 발생 할 수 있으며, 이는 하자 사항이 아닙니다.','※ 엔지니어드스톤, 인조대리석 등의 색상, 디자인, 재질, 단차, 코너, 마감재접합부, 패턴 등은 본 공사 시 견본주택과 다소 상이할 수 있습니다.','※ 설치되는 가구의 비노출면(후면, 하부, 천장)에는 마루, 타일, 도배, 천연가공석, 엔지니어드스톤 등 마감재가 시공되지 않습니다.']},
    {id:'closet_침실1',cat:'붙박이장',label:'침실1 붙박이장(슬라이딩)',base:'',price:5000000},
    {id:'closet_침실3',cat:'붙박이장',label:'침실3 붙박이장(여닫이)',base:'',price:1700000,notes:['▶ 기본 품목(미선택형): 실크벽지 / 유상 품목(선택형): 침실1 붙박이장, 침실3 붙박이장','※ 붙박이장과 접해있는 벽, 바닥, 천장에는 마감재가 설치되지 않습니다.']}
  ],ac:6400000,vent:1200000,dual:true},
  {key:'59F',name:'59㎡F',opts:[
    {id:'wall',cat:'벽 마감재 특화',label:'벽(현관, 복도, 거실, 주방) 시트 판넬',base:'실크 벽지',price:3000000},
    {id:'living',cat:'거실마감재 특화',label:'거실 아트월(포세린타일, 600X1200) + 포세린타일(600X600) 바닥(복도,거실,주방) + 거실 천정 조명(상간접등, 하직부등)',base:'거실 아트월(포세린타일, 600X600) + 강마루 바닥(복도,거실,주방) + 거실 천정 직부등',price:4500000,notes:['※ 타일은 자재특성상 색상 및 무늬가 동일하지 않고 고유한 물성에 의하여 휠 발생이 생길수 있으며, 타일 나누기는 추가 또는 변경될수있습니다.','※ 아트월 설치 시 타일 이음새 구분이 발생되며 이음새 구분 위치 및 무늬결 및 재료분리대가 견본주택과 상이하게 설치될 수 있습니다.']},
    {id:'bath',cat:'욕실마감재 특화',label:'벽체 : 포세린 타일(600X600)',base:'벽체 : 도기질 타일(300X600, 세로방향)',price:700000,notes:['※ 타일은 자재특성상 색상 및 무늬가 동일하지 않고 고유한 물성에 의하여 휠 발생이 생길수 있으며, 타일 나누기는 추가 또는 변경될수있습니다.','※ 욕실 벽, 바닥 타일의 줄눈 위치가 일치하지 않을 수 있으며, 줄눈 및 타일 사이즈가 일정하지 않을 수 있습니다.']},
    {id:'kitchen',cat:'주방 마감 특화',label:'주방 벽체 및 상판 엔지니어드 스톤',base:'주방 벽체 도기질타일(600X300,가로방향)및 상판 인조대리석',price:2200000,notes:['※ 인조대리석 및 석재 / 타일 자재의 경우 제조과정에 따라 무늬 및 색상이 다소 차이가 발생 할 수 있으며, 이는 하자 사항이 아닙니다.','※ 엔지니어드스톤, 인조대리석 등의 색상, 디자인, 재질, 단차, 코너, 마감재접합부, 패턴 등은 본 공사 시 견본주택과 다소 상이할 수 있습니다.','※ 설치되는 가구의 비노출면(후면, 하부, 천장)에는 마루, 타일, 도배, 천연가공석, 엔지니어드스톤 등 마감재가 시공되지 않습니다.']},
    {id:'closet_침실1',cat:'붙박이장',label:'침실1 붙박이장(슬라이딩)',base:'',price:3900000},
    {id:'closet_침실2',cat:'붙박이장',label:'침실2 붙박이장(여닫이)',base:'',price:1700000,notes:['▶ 기본 품목(미선택형): 실크벽지 / 유상 품목(선택형): 침실1 붙박이장, 침실2 붙박이장','※ 붙박이장과 접해있는 벽, 바닥, 천장에는 마감재가 설치되지 않습니다.']}
  ],ac:6400000,vent:1200000,dual:true},
  {key:'65A',name:'65㎡A',opts:[
    {id:'living',cat:'거실마감재 특화',label:'거실 아트월(포세린타일, 600X1200) + 포세린타일(600X600) 바닥(복도,거실,주방) + 거실 천정 조명(상간접등, 하직부등)',base:'거실 아트월(포세린타일, 600X600) + 강마루 바닥(복도,거실,주방) + 거실 천정 직부등',price:4000000,notes:['※ 타일은 자재특성상 색상 및 무늬가 동일하지 않고 고유한 물성에 의하여 휠 발생이 생길수 있으며, 타일 나누기는 추가 또는 변경될수있습니다.','※ 아트월 설치 시 타일 이음새 구분이 발생되며 이음새 구분 위치 및 무늬결 및 재료분리대가 견본주택과 상이하게 설치될 수 있습니다.']},
    {id:'kitchen',cat:'주방 마감 특화',label:'주방 벽체 및 상판 엔지니어드 스톤',base:'주방 벽체 도기질타일(600X300,가로방향)및 상판 인조대리석',price:2100000,notes:['※ 인조대리석 및 석재 / 타일 자재의 경우 제조과정에 따라 무늬 및 색상이 다소 차이가 발생 할 수 있으며, 이는 하자 사항이 아닙니다.','※ 엔지니어드스톤, 인조대리석 등의 색상, 디자인, 재질, 단차, 코너, 마감재접합부, 패턴 등은 본 공사 시 견본주택과 다소 상이할 수 있습니다.','※ 설치되는 가구의 비노출면(후면, 하부, 천장)에는 마루, 타일, 도배, 천연가공석, 엔지니어드스톤 등 마감재가 시공되지 않습니다.']},
    {id:'closet_실2',cat:'붙박이장',label:'실2 붙박이장(여닫이)',base:'',price:1800000,notes:['▶ 기본 품목(미선택형): 실크벽지 / 유상 품목(선택형): 실2 붙박이장','※ 붙박이장과 접해있는 벽, 바닥, 천장에는 마감재가 설치되지 않습니다.']},
    {id:'bath',cat:'욕실마감재 특화',label:'벽체 : 포세린 타일(600X600)',base:'벽체 : 도기질 타일(300X600, 세로방향)',price:500000,notes:['※ 타일은 자재특성상 색상 및 무늬가 동일하지 않고 고유한 물성에 의하여 휠 발생이 생길수 있으며, 타일 나누기는 추가 또는 변경될수있습니다.','※ 욕실 벽, 바닥 타일의 줄눈 위치가 일치하지 않을 수 있으며, 줄눈 및 타일 사이즈가 일정하지 않을 수 있습니다.']},
    {id:'space',cat:'공간(드레스룸) 특화',label:'실1 가구도어+시스템선반',base:'',price:1100000,notes:['※ 공간특화 옵션 선택 시 부위별 가구 설치 및 레이아웃이 변경될 수 있습니다.','※ 공간특화 옵션 선택 시 타입별 위치에 따라 가구의 방향이 상이할 수 있으니 계약 시 필히 확인하시기 바랍니다.']}
  ],ac:5800000,vent:600000,dual:false},
  {key:'65B',name:'65㎡B',opts:[
    {id:'living',cat:'거실마감재 특화',label:'거실 아트월(포세린타일, 600X1200) + 포세린타일(600X600) 바닥(복도,거실,주방) + 거실 천정 조명(상간접등, 하직부등)',base:'거실 아트월(포세린타일, 600X600) + 강마루 바닥(복도,거실,주방) + 거실 천정 직부등',price:4100000,notes:['※ 타일은 자재특성상 색상 및 무늬가 동일하지 않고 고유한 물성에 의하여 휠 발생이 생길수 있으며, 타일 나누기는 추가 또는 변경될수있습니다.','※ 아트월 설치 시 타일 이음새 구분이 발생되며 이음새 구분 위치 및 무늬결 및 재료분리대가 견본주택과 상이하게 설치될 수 있습니다.']},
    {id:'kitchen',cat:'주방 마감 특화',label:'주방 벽체 및 상판 엔지니어드 스톤',base:'주방 벽체 도기질타일(600X300,가로방향)및 상판 인조대리석',price:1500000,notes:['※ 인조대리석 및 석재 / 타일 자재의 경우 제조과정에 따라 무늬 및 색상이 다소 차이가 발생 할 수 있으며, 이는 하자 사항이 아닙니다.','※ 엔지니어드스톤, 인조대리석 등의 색상, 디자인, 재질, 단차, 코너, 마감재접합부, 패턴 등은 본 공사 시 견본주택과 다소 상이할 수 있습니다.','※ 설치되는 가구의 비노출면(후면, 하부, 천장)에는 마루, 타일, 도배, 천연가공석, 엔지니어드스톤 등 마감재가 시공되지 않습니다.']},
    {id:'closet_실2',cat:'붙박이장',label:'실2 붙박이장(여닫이)',base:'',price:2200000,notes:['▶ 기본 품목(미선택형): 실크벽지 / 유상 품목(선택형): 실2 붙박이장','※ 붙박이장과 접해있는 벽, 바닥, 천장에는 마감재가 설치되지 않습니다.']},
    {id:'bath',cat:'욕실마감재 특화',label:'벽체 : 포세린 타일(600X600)',base:'벽체 : 도기질 타일(300X600, 세로방향)',price:500000,notes:['※ 타일은 자재특성상 색상 및 무늬가 동일하지 않고 고유한 물성에 의하여 휠 발생이 생길수 있으며, 타일 나누기는 추가 또는 변경될수있습니다.','※ 욕실 벽, 바닥 타일의 줄눈 위치가 일치하지 않을 수 있으며, 줄눈 및 타일 사이즈가 일정하지 않을 수 있습니다.']},
    {id:'space',cat:'공간(드레스룸) 특화',label:'실1 가구도어+시스템선반',base:'',price:2100000,notes:['※ 공간특화 옵션 선택 시 부위별 가구 설치 및 레이아웃이 변경될 수 있습니다.','※ 공간특화 옵션 선택 시 타입별 위치에 따라 가구의 방향이 상이할 수 있으니 계약 시 필히 확인하시기 바랍니다.']}
  ],ac:4700000,vent:600000,dual:false},
  {key:'68',name:'68㎡',opts:[
    {id:'living',cat:'거실마감재 특화',label:'거실 아트월(포세린타일, 600X1200) + 포세린타일(600X600) 바닥(복도,거실,주방) + 거실 천정 조명(상간접등, 하직부등)',base:'거실 아트월(포세린타일, 600X600) + 강마루 바닥(복도,거실,주방) + 거실 천정 직부등',price:4000000,notes:['※ 타일은 자재특성상 색상 및 무늬가 동일하지 않고 고유한 물성에 의하여 휠 발생이 생길수 있으며, 타일 나누기는 추가 또는 변경될수있습니다.','※ 아트월 설치 시 타일 이음새 구분이 발생되며 이음새 구분 위치 및 무늬결 및 재료분리대가 견본주택과 상이하게 설치될 수 있습니다.']},
    {id:'bath',cat:'욕실마감재 특화',label:'벽체 : 포세린 타일(600X600)',base:'벽체 : 도기질 타일(300X600, 세로방향)',price:500000,notes:['※ 타일은 자재특성상 색상 및 무늬가 동일하지 않고 고유한 물성에 의하여 휠 발생이 생길수 있으며, 타일 나누기는 추가 또는 변경될수있습니다.','※ 욕실 벽, 바닥 타일의 줄눈 위치가 일치하지 않을 수 있으며, 줄눈 및 타일 사이즈가 일정하지 않을 수 있습니다.']},
    {id:'kitchen',cat:'주방 마감 및 가구 특화',label:'주방 벽체 및 상판 엔지니어드 스톤 + 주방가구(아일랜드장)',base:'주방 벽체 도기질타일(600X300,가로방향)및 상판 인조대리석',price:4400000,notes:['※ 인조대리석 및 석재 / 타일 자재의 경우 제조과정에 따라 무늬 및 색상이 다소 차이가 발생 할 수 있으며, 이는 하자 사항이 아닙니다.','※ 엔지니어드스톤, 인조대리석 등의 색상, 디자인, 재질, 단차, 코너, 마감재접합부, 패턴 등은 본 공사 시 견본주택과 다소 상이할 수 있습니다.','※ 설치되는 가구의 비노출면(후면, 하부, 천장)에는 마루, 타일, 도배, 천연가공석, 엔지니어드스톤 등 마감재가 시공되지 않습니다.']},
    {id:'closet_실1',cat:'붙박이장',label:'실1 붙박이장(여닫이)',base:'',price:1600000,notes:['▶ 기본 품목(미선택형): 실크벽지 / 유상 품목(선택형): 실1 붙박이장','※ 붙박이장과 접해있는 벽, 바닥, 천장에는 마감재가 설치되지 않습니다.']},
    {id:'space',cat:'공간(드레스룸) 특화',label:'실3 가구도어+시스템선반+화장대+주방 수납장',base:'',price:4100000,notes:['※ 공간특화 옵션 선택 시 부위별 가구 설치 및 레이아웃이 변경될 수 있습니다.','※ 공간특화 옵션 선택 시 타입별 위치에 따라 가구의 방향이 상이할 수 있으니 계약 시 필히 확인하시기 바랍니다.']}
  ],ac:5800000,vent:600000,dual:false},
  {key:'79',name:'79㎡',opts:[
    {id:'wall',cat:'벽 마감재 특화',label:'벽(현관, 복도, 거실, 주방) 시트 판넬',base:'실크 벽지',price:3300000},
    {id:'living',cat:'거실마감재 특화',label:'거실 아트월(포세린타일, 600X1200) + 포세린타일(600X600) 바닥(복도,거실,주방) + 거실 천정 조명(상간접등, 하직부등)',base:'거실 아트월(포세린타일, 600X600) + 강마루 바닥(복도,거실,주방) + 거실 천정 직부등',price:4100000,notes:['※ 타일은 자재특성상 색상 및 무늬가 동일하지 않고 고유한 물성에 의하여 휠 발생이 생길수 있으며, 타일 나누기는 추가 또는 변경될수있습니다.','※ 아트월 설치 시 타일 이음새 구분이 발생되며 이음새 구분 위치 및 무늬결 및 재료분리대가 견본주택과 상이하게 설치될 수 있습니다.']},
    {id:'bath',cat:'욕실마감재 특화',label:'벽체 : 포세린 타일(600X600)',base:'벽체 : 도기질 타일(300X600, 세로방향)',price:800000,notes:['※ 타일은 자재특성상 색상 및 무늬가 동일하지 않고 고유한 물성에 의하여 휠 발생이 생길수 있으며, 타일 나누기는 추가 또는 변경될수있습니다.','※ 욕실 벽, 바닥 타일의 줄눈 위치가 일치하지 않을 수 있으며, 줄눈 및 타일 사이즈가 일정하지 않을 수 있습니다.']},
    {id:'kitchen',cat:'주방 마감 및 가구 특화',label:'주방 벽체 및 상판 엔지니어드 스톤 + 주방가구(아일랜드장)',base:'주방 벽체 도기질타일(600X300,가로방향)및 상판 인조대리석',price:3800000,notes:['※ 인조대리석 및 석재 / 타일 자재의 경우 제조과정에 따라 무늬 및 색상이 다소 차이가 발생 할 수 있으며, 이는 하자 사항이 아닙니다.','※ 엔지니어드스톤, 인조대리석 등의 색상, 디자인, 재질, 단차, 코너, 마감재접합부, 패턴 등은 본 공사 시 견본주택과 다소 상이할 수 있습니다.','※ 설치되는 가구의 비노출면(후면, 하부, 천장)에는 마루, 타일, 도배, 천연가공석, 엔지니어드스톤 등 마감재가 시공되지 않습니다.']},
    {id:'closet_실1',cat:'붙박이장',label:'실1 붙박이장(슬라이딩)',base:'',price:3900000},
    {id:'closet_실2',cat:'붙박이장',label:'실2 붙박이장(여닫이)',base:'',price:1700000,group:'g79',notes:['▶ 기본 품목(미선택형): 실크벽지 / 유상 품목(선택형): 실1 붙박이장, 실2 붙박이장','※ 붙박이장과 접해있는 벽, 바닥, 천장에는 마감재가 설치되지 않습니다.','※ 공간특화(드레스룸) 옵션 선택시 침실2 붙박이장 옵션 선택 불가하니 참고 바랍니다']},
    {id:'space',cat:'공간(드레스룸) 특화',label:'가변형벽체(실2/실3 통합형)+가구도어+시스템선반',base:'',price:1200000,group:'g79',notes:['※ 공간특화 옵션 선택 시 부위별 가구 설치 및 레이아웃이 변경될 수 있습니다.','※ 공간특화 옵션 선택시 침실2 붙박이장 옵션 선택 불가하오니 참고 바랍니다.']}
  ],ac:6400000,vent:1200000,dual:true},
  {key:'84',name:'84㎡',opts:[
    {id:'wall',cat:'벽 마감재 특화',label:'벽(현관, 복도, 거실, 주방) 시트 판넬',base:'실크 벽지',price:2500000},
    {id:'living',cat:'거실마감재 특화',label:'거실 아트월(포세린타일, 600X1200) + 포세린타일(600X600) 바닥(복도,거실,주방) + 거실 천정 조명(상간접등, 하직부등)',base:'거실 아트월(포세린타일, 600X600) + 강마루 바닥(복도,거실,주방) + 거실 천정 직부등',price:4600000,notes:['※ 타일은 자재특성상 색상 및 무늬가 동일하지 않고 고유한 물성에 의하여 휠 발생이 생길수 있으며, 타일 나누기는 추가 또는 변경될수있습니다.','※ 아트월 설치 시 타일 이음새 구분이 발생되며 이음새 구분 위치 및 무늬결 및 재료분리대가 견본주택과 상이하게 설치될 수 있습니다.']},
    {id:'bath',cat:'욕실마감재 특화',label:'벽체 : 포세린 타일(600X600)',base:'벽체 : 도기질 타일(300X600, 세로방향)',price:700000,notes:['※ 타일은 자재특성상 색상 및 무늬가 동일하지 않고 고유한 물성에 의하여 휠 발생이 생길수 있으며, 타일 나누기는 추가 또는 변경될수있습니다.','※ 욕실 벽, 바닥 타일의 줄눈 위치가 일치하지 않을 수 있으며, 줄눈 및 타일 사이즈가 일정하지 않을 수 있습니다.']},
    {id:'kitchen',cat:'주방 마감 특화',label:'주방 벽체 및 상판 엔지니어드 스톤',base:'주방 벽체 도기질타일(600X300,가로방향)및 상판 인조대리석',price:4600000,notes:['※ 인조대리석 및 석재 / 타일 자재의 경우 제조과정에 따라 무늬 및 색상이 다소 차이가 발생 할 수 있으며, 이는 하자 사항이 아닙니다.','※ 엔지니어드스톤, 인조대리석 등의 색상, 디자인, 재질, 단차, 코너, 마감재접합부, 패턴 등은 본 공사 시 견본주택과 다소 상이할 수 있습니다.','※ 설치되는 가구의 비노출면(후면, 하부, 천장)에는 마루, 타일, 도배, 천연가공석, 엔지니어드스톤 등 마감재가 시공되지 않습니다.']},
    {id:'closet_실1',cat:'붙박이장',label:'실1 붙박이장(슬라이딩)',base:'',price:5000000},
    {id:'closet_실3',cat:'붙박이장',label:'실3 붙박이장(여닫이)',base:'',price:1700000,notes:['▶ 기본 품목(미선택형): 실크벽지 / 유상 품목(선택형): 실1 붙박이장, 실3 붙박이장','※ 붙박이장과 접해있는 벽, 바닥, 천장에는 마감재가 설치되지 않습니다.']}
  ],ac:6400000,vent:1200000,dual:true},
];

function getAppliances(t) {
  const list = [
    {id:'a_ind',name:'3구 인덕션',model:'하츠 SSIH-3605TTLB',base:'가스쿡탑',price:400000},
    {id:'a_oven',name:'빌트인오븐',model:'삼성 NQ36A6555CK',base:'가구(여닫이장)',price:500000},
    {id:'a_dish',name:'식기세척기',model:'삼성 DW80F71Y1SEW',base:'가구(여닫이장)',price:1200000},
    {id:'a_ac',name:'시스템에어컨',model:'LG',base:'-',price:t.ac,note:'*거실 및 침실'},
    {id:'a_vent',name:'스마트복합환풍기',model:'힘펠 FHD3-C150P',base:'-',price:t.vent,note:t.vent>600000?'욕실 2개소':''},
    {id:'a_fr',name:'냉장고패키지',model:'냉장고: 삼성 RR40C7995AP / 냉동고: 삼성 RZ34C7965AP / 김치냉장고: 삼성 RQ34C7945AP',base:'-',price:7300000,baseImg:t.fridgeBaseImg||'https://i.imgur.com/N4lwIZD.png',img:t.fridgeImg||'https://i.imgur.com/wFVmKCn.png',
      appNotes:[
        '※ 가전옵션 제품은 2025년 10월 기준으로 설치시점에 해당 모델의 단종(성능 개선, 디자인 변경, 기술적 사항 변경 등의 사유) 혹은 품절, 품귀 등의 사유 발생 시 동종사의 동종, 등급 이상의 제품으로 변경 제공될 수 있습니다.',
        '※ 천정형 시스템 에어컨 설치 위치는 현장 여건에 따라 견본주택에 설치된 위치와 상이할 수 있습니다.',
        '※ 식기세척기는 가구도어로 마감될 예정입니다.',
        '※ 냉장고패키지 선택시 냉장, 냉동, 김치순으로 배열되며 순서는 고정이며, 냉장고 도어방향은 설치 위치에 따라 다를 수 있습니다.',
        '※ 냉장고 상부장 및 열면(좌측 또는 우측) 수납장의 도어방향은 설치 위치에 따라 다를 수 있습니다.',
        '※ 견본주택에 설치된 비스포크 냉장고 패널색상은 예시 색상이며, 전면패널의 색상은 1년 단위로 변경되므로 입주 6개월 전 별도의 안내를 드릴 예정입니다.',
        '※ 관련 법규 개정 또는 검사기준에 따라 가전제품의 에너지소비효율등급은 매년 변경될 수 있습니다.',
        '※ 주방환경(주방가구 연장 및 아일랜드장) 옵션 미선택 시 빌트인 가전선택의 제한이 있을 수 있으니 유의하시기 바랍니다.'
      ]},
  ];
  if (t.dual) {
    list.push({id:'a_bt1',name:'욕실1 비데일체형 양변기',model:'대림바스 DST-690',base:'-',price:700000});
    list.push({id:'a_bd1',name:'욕실1 비데',model:'대림통상 DB-4210',base:'-',price:200000});
    list.push({id:'a_bt2',name:'욕실2 비데일체형 양변기',model:'대림바스 DST-690',base:'-',price:700000});
    list.push({id:'a_bd2',name:'욕실2 비데',model:'대림통상 DB-4210',base:'-',price:200000});
  } else {
    list.push({id:'a_bt',name:'비데일체형 양변기',model:'대림바스 DST-690',base:'-',price:700000});
    list.push({id:'a_bd',name:'비데',model:'대림통상 DB-4210',base:'-',price:200000});
  }
  return list;
}

const fmt = (n) => String.fromCharCode(8361) + n.toLocaleString('ko-KR');

function ApplicationForm59A({ typeData, sel, signData, contractor, dong, ho }) {
  if(!typeData) return null;
  const f=(n)=>String.fromCharCode(8361)+n.toLocaleString('ko-KR');
  const on=(id)=>sel[id]!==undefined;
  const Seal=({active})=>(
    <span className="af-seal">
      <span className="af-seal-chop">(인)</span>
      {active && signData && <img className="af-seal-img" src={signData} alt="서명" />}
    </span>
  );
  const TextOpt=({opt})=>{
    const s=on(opt.id);
    return(
      <div className="afs">
        <div className="afs-t">{opt.cat} 옵션 선택</div>
        <table className="aft"><thead><tr>
          <th className="aft-h"><span className="af-lb">기본</span> 미선택형</th>
          <th className="aft-h"><span className="af-ls">유상</span> 선택형</th>
        </tr></thead><tbody>
          <tr><td>{opt.base||'—'}</td><td>{opt.label}</td></tr>
          <tr><td className="af-pr">—</td><td className="af-pr">공급금액 : {f(opt.price)}</td></tr>
          <tr><td className="af-st"><span className="af-contractor-seal-row"><span className="af-contractor-label">계약자:</span> <Seal active={!s}/></span></td><td className="af-st"><span className="af-contractor-seal-row"><span className="af-contractor-label">계약자:</span> <Seal active={s}/></span></td></tr>
        </tbody></table>
        {opt.notes&&<div className="af-notes">{opt.notes.map((n,i)=><div key={i}>{n}</div>)}</div>}
      </div>
    );
  };
  const ImgOpt=({opt})=>{
    const s=on(opt.id);
    return(
      <div className="afs">
        <div className="afs-t">{opt.cat} 옵션 선택</div>
        <table className="aft"><thead><tr>
          <th className="aft-h"><span className="af-lb">기본</span> 미선택형</th>
          <th className="aft-h"><span className="af-ls">유상</span> 선택형</th>
        </tr></thead><tbody>
          {(opt.baseImg||opt.img)&&<tr>
            <td className="af-tc">{opt.baseImg?<img src={opt.baseImg} className="af-fw"/>:'—'}</td>
            <td className="af-tc">{opt.img?<img src={opt.img} className="af-fw"/>:'—'}</td>
          </tr>}
          <tr><td>{opt.base||'—'}</td><td>{opt.label}</td></tr>
          <tr><td className="af-pr">—</td><td className="af-pr">공급금액 : {f(opt.price)}</td></tr>
          <tr><td className="af-st"><span className="af-contractor-seal-row"><span className="af-contractor-label">계약자:</span> <Seal active={!s}/></span></td><td className="af-st"><span className="af-contractor-seal-row"><span className="af-contractor-label">계약자:</span> <Seal active={s}/></span></td></tr>
        </tbody></table>
        {opt.notes&&<div className="af-notes">{opt.notes.map((n,i)=><div key={i}>{n}</div>)}</div>}
      </div>
    );
  };
  const AppRow=({it})=>{
    const s=on(it.id);
    return(
      <React.Fragment key={it.id}>
        <tr><td rowSpan={2}><div style={ {fontWeight:600} }>{it.name}</div><div style={ {fontSize:'6.5pt',color:'#666'} }>({it.model})</div></td>
          <td><span className="af-lb">미선택형</span> {it.base||'—'}</td>
          <td className="af-st"><span className="af-contractor-seal-row"><span className="af-contractor-label">계약자:</span> <Seal active={!s}/></span></td></tr>
        <tr><td><span className="af-ls">선택형</span> 공급금액: {f(it.price)}{it.note&&<span style={ {fontSize:'6pt',color:'#c00',marginLeft:'1mm'} }>{it.note}</span>}</td>
          <td className="af-st"><span className="af-contractor-seal-row"><span className="af-contractor-label">계약자:</span> <Seal active={s}/></span></td></tr>
      </React.Fragment>
    );
  };
  const w=typeData.opts.find(o=>o.id==='wall');
  const l=typeData.opts.find(o=>o.id==='living');
  const b=typeData.opts.find(o=>o.id==='bath');
  const k=typeData.opts.find(o=>o.id==='kitchen');
  const c1=typeData.opts.find(o=>o.id==='closet_침실1');
  const c2=typeData.opts.find(o=>o.id==='closet_침실2');
  const sp=typeData.opts.find(o=>o.id==='space');
  const bathApps=typeData.dual?[
    {id:'a_bt1',name:'욕실1 비데일체형 양변기',model:'대림바스 DST-690',base:'—',price:700000},
    {id:'a_bd1',name:'욕실1 비데',model:'대림통상 DB-4210',base:'—',price:200000},
    {id:'a_bt2',name:'욕실2 비데일체형 양변기',model:'대림바스 DST-690',base:'—',price:700000},
    {id:'a_bd2',name:'욕실2 비데',model:'대림통상 DB-4210',base:'—',price:200000}
  ]:[
    {id:'a_bt',name:'비데일체형 양변기',model:'대림바스 DST-690',base:'—',price:700000},
    {id:'a_bd',name:'비데',model:'대림통상 DB-4210',base:'—',price:200000}
  ];
  const kitApps=[
    {id:'a_ind',name:'3구 인덕션',model:'하츠 SSIH-3605TTLB',base:'가스쿡탑',price:400000},
    {id:'a_oven',name:'빌트인오븐',model:'삼성 NQ36A6555CK',base:'가구(여닫이장)',price:500000},
    {id:'a_dish',name:'식기세척기',model:'삼성 DW80F71Y1SEW',base:'가구(여닫이장)',price:1200000},
    {id:'a_ac',name:'시스템에어컨',model:'LG',base:'—',price:typeData.ac,note:'*거실 및 침실'},
    {id:'a_vent',name:'스마트복합환풍기',model:'힘펠 FHD3-C150P',base:'—',price:typeData.vent,note:typeData.vent>600000?'욕실 2개소':''}
  ];
  const now=new Date();
  const dateStr=now.getFullYear()+'. '+(now.getMonth()+1)+'. '+now.getDate()+'.';
  return(
    <div className="app-form-print">
      <div className="afp afp-1">
        <div className="afc">
          <div className="afs-t">가전 옵션 선택 품목</div>
          <table className="af-at"><thead><tr><th style={ {width:'28%'} }>품목</th><th>미선택형 / 선택형</th><th style={ {width:'18%'} }>계약자 확인</th></tr></thead><tbody>
            <tr><td rowSpan={2}><div style={ {fontWeight:600} }>냉장고패키지</div><div className="af-sg2">냉장고: 삼성 RR40C7995AP<br/>냉동고: 삼성 RZ34C7965AP<br/>김치냉장고: 삼성 RQ34C7945AP</div></td>
              <td><span className="af-lb">미선택형</span><br/><img className="af-at-img" src="https://i.imgur.com/N4lwIZD.png"/><div className="af-pr">—</div></td>
              <td className="af-st"><span className="af-contractor-seal-row"><span className="af-contractor-label">계약자:</span> <Seal active={!on('a_fr')}/></span></td></tr>
            <tr><td><span className="af-ls">선택형</span><br/><img className="af-at-img" src="https://i.imgur.com/wFVmKCn.png"/><div className="af-pr">공급금액: {f(7300000)}</div></td>
              <td className="af-st"><span className="af-contractor-seal-row"><span className="af-contractor-label">계약자:</span> <Seal active={on('a_fr')}/></span></td></tr>
            {bathApps.map(it=><AppRow key={it.id} it={it}/>)}
          </tbody></table>
          <div className="af-notes">※ 가전옵션 제품은 설치시점에 단종 등 사유로 동등 이상 제품 변경 가능<br/>※ 냉장고패키지 선택시 냉장/냉동/김치 순 배열 고정, 도어방향은 설치 위치에 따라 다를 수 있음</div>
        </div>
        <div className="afc">
          <div className="af-hdr">
            <div className="af-hdr-nm">{typeData.name}</div>
            <div className="af-hdr-sub">청량리역 요진 와이시티<br/>멀티플러스 옵션 신청서</div>
            <div className="af-hdr-info"><div className="af-hdr-cell">{dong||'___'}동</div><div className="af-hdr-cell">{ho||'___'}호</div></div>
          </div>
          {typeData.floorPlan&&<div className="af-fp"><img src={typeData.floorPlan} alt="평면도"/></div>}
          {w&&<TextOpt opt={w}/>}
          {l&&<TextOpt opt={l}/>}
          {b&&<TextOpt opt={b}/>}
        </div>
      </div>
      <div className="afp afp-2">
        <div className="afc">
          {k&&<ImgOpt opt={k}/>}
          <div className="afs">
            <div className="afs-t">붙박이장 옵션 선택</div>
            <table className="aft"><thead><tr>
              <th className="aft-h"><span className="af-lb">기본</span> 미선택형</th>
              <th className="aft-h"><span className="af-ls">유상</span> 선택형</th>
            </tr></thead><tbody>
              {c1&&<React.Fragment><tr>
                <td className="af-tc">{c1.baseImg?<img src={c1.baseImg} className="af-fw"/>:'—'}</td>
                <td className="af-tc">{c1.img?<img src={c1.img} className="af-fw"/>:'—'}</td>
              </tr><tr><td>—</td><td>{c1.label}</td></tr>
              <tr><td className="af-pr">—</td><td className="af-pr">공급금액 : {f(c1.price)}</td></tr>
              <tr><td className="af-st"><span className="af-contractor-seal-row"><span className="af-contractor-label">계약자:</span> <Seal active={!on(c1.id)}/></span></td><td className="af-st"><span className="af-contractor-seal-row"><span className="af-contractor-label">계약자:</span> <Seal active={on(c1.id)}/></span></td></tr>
              </React.Fragment>}
              {c2&&<React.Fragment><tr style={ {borderTop:'1pt solid #666'} }><td>—</td><td>{c2.label}</td></tr>
              <tr><td className="af-pr">—</td><td className="af-pr">공급금액 : {f(c2.price)}</td></tr>
              <tr><td className="af-st"><span className="af-contractor-seal-row"><span className="af-contractor-label">계약자:</span> <Seal active={!on(c2.id)}/></span></td><td className="af-st"><span className="af-contractor-seal-row"><span className="af-contractor-label">계약자:</span> <Seal active={on(c2.id)}/></span></td></tr>
              </React.Fragment>}
            </tbody></table>
            {c2&&c2.notes&&<div className="af-notes">{c2.notes.map((n,i)=><div key={i}>{n}</div>)}</div>}
          </div>
        </div>
        <div className="afc">
          {sp&&<ImgOpt opt={sp}/>}
          <div className="afs-t">가전 옵션 선택 품목</div>
          <table className="af-at"><thead><tr><th style={ {width:'28%'} }>품목</th><th>미선택형 / 선택형</th><th style={ {width:'18%'} }>계약자 확인</th></tr></thead><tbody>
            {kitApps.map(it=><AppRow key={it.id} it={it}/>)}
          </tbody></table>
          <div className="af-tc" style={ {marginTop:'4mm',fontSize:'8pt',color:'#475569'} }>
            <div style={ {marginBottom:'1mm'} }>상기 옵션을 신청합니다.</div>
            <div className="af-b af-contractor-footer-line" style={ {fontSize:'9pt'} }>
              <span className="af-contractor-footer-text"><span className="af-contractor-label">계약자:</span> {contractor}</span>
              <span className="af-seal">
                <span className="af-seal-chop">(인)</span>
                {signData && <img className="af-seal-img" src={signData} alt="서명" />}
              </span>
            </div>
            <div style={ {color:'#64748b',fontSize:'8pt',marginTop:'1mm'} }>{dateStr}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function App() {
  const [step, setStep] = useState(0);
  const [dong, setDong] = useState('');
  const [ho, setHo] = useState('');
  const [contractor, setContractor] = useState('');
  const [phoneLast4, setPhoneLast4] = useState('');
  const [typeKey, setTypeKey] = useState('');
  const [sel, setSel] = useState({});
  const [signData, setSignData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [contractPreviewOpen, setContractPreviewOpen] = useState(false);
  const [noticeModal, setNoticeModal] = useState(null);
  const [gateVerifying, setGateVerifying] = useState(false);
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const hasDraw = useRef(false);

  /** 인쇄 미리보기(WebKit): html에 표식을 두고 @media print에서 visibility 방식으로만 숨김 */
  useEffect(() => {
    const root = document.documentElement;
    if (step !== 2) {
      root.classList.remove("yyc-print-source-page");
      return;
    }
    root.classList.add("yyc-print-source-page");
    const reflow = () => {
      void document.body.offsetHeight;
    };
    window.addEventListener("beforeprint", reflow);
    return () => {
      window.removeEventListener("beforeprint", reflow);
      root.classList.remove("yyc-print-source-page");
    };
  }, [step]);

  useEffect(() => {
    if (!contractPreviewOpen) return;
    document.body.classList.add("yyc-contract-modal-open");
    const onKey = (e) => {
      if (e.key === "Escape") setContractPreviewOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.classList.remove("yyc-contract-modal-open");
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [contractPreviewOpen]);

  useEffect(() => {
    if (!noticeModal) return;
    const onKey = (e) => {
      if (e.key === "Escape") setNoticeModal(null);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [noticeModal]);

  /** 계약자 4항목이 등록부와 일치하면 평형(typeKey) 자동 선택 */
  useEffect(() => {
    if (step !== 0) return;
    const d = String(dong ?? "").replace(/\D/g, "");
    const h = String(ho ?? "").replace(/\D/g, "");
    const name = String(contractor ?? "")
      .trim()
      .replace(/\s+/g, " ");
    const p = String(phoneLast4 ?? "").replace(/\D/g, "");
    if (!d || !h || !name || p.length !== 4) return;

    let cancelled = false;
    const timer = setTimeout(() => {
      lookupResidentTypeQuiet(dong, ho, contractor, phoneLast4).then((row) => {
        if (cancelled) return;
        if (row?.typeKey) {
          setTypeKey((prev) => {
            if (prev === row.typeKey) return prev;
            setSel({});
            return row.typeKey;
          });
        } else {
          setTypeKey((prev) => {
            if (!prev) return prev;
            setSel({});
            return "";
          });
        }
      });
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [step, dong, ho, contractor, phoneLast4]);

  const startDraw = useCallback((e) => {
    const canvas = canvasRef.current; if(!canvas) return;
    isDrawing.current = true; hasDraw.current = true;
    const rect = canvas.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    const ctx = canvas.getContext('2d');
    ctx.beginPath(); ctx.moveTo(t.clientX-rect.left, t.clientY-rect.top);
    canvas.parentElement.classList.add('signed');
  },[]);
  const moveDraw = useCallback((e) => {
    if(!isDrawing.current) return;
    const canvas = canvasRef.current; if(!canvas) return;
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.strokeStyle = '#1e293b';
    ctx.lineTo(t.clientX-rect.left, t.clientY-rect.top); ctx.stroke();
  },[]);
  const endDraw = useCallback(() => {
    isDrawing.current = false;
  },[]);
  const confirmSign = useCallback(() => {
    const canvas = canvasRef.current;
    if(!canvas || !hasDraw.current) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    const data = ctx.getImageData(0,0,w,h).data;
    let minX=w, minY=h, maxX=-1, maxY=-1;
    for(let y=0; y<h; y++){
      for(let x=0; x<w; x++){
        if(data[(y*w+x)*4+3] > 0){
          if(x<minX) minX=x;
          if(x>maxX) maxX=x;
          if(y<minY) minY=y;
          if(y>maxY) maxY=y;
        }
      }
    }
    if(maxX < 0){ setSignData(null); return; }
    const pad = 8;
    minX = Math.max(0, minX-pad);
    minY = Math.max(0, minY-pad);
    maxX = Math.min(w-1, maxX+pad);
    maxY = Math.min(h-1, maxY+pad);
    const cw = maxX-minX+1, ch = maxY-minY+1;
    const crop = document.createElement('canvas');
    crop.width = cw; crop.height = ch;
    crop.getContext('2d').drawImage(canvas, minX, minY, cw, ch, 0, 0, cw, ch);
    setSignData(crop.toDataURL('image/png'));
  },[]);
  const clearSign = useCallback(() => {
    const canvas = canvasRef.current;
    if(canvas){
      const w = canvas.width, h = canvas.height;
      canvas.width = w; canvas.height = h;
      if(canvas.parentElement) canvas.parentElement.classList.remove('signed');
    }
    isDrawing.current = false;
    hasDraw.current = false;
    setSignData(null);
  },[]);

  const typeData = useMemo(() => TYPES.find(t => t.key === typeKey), [typeKey]);
  const allOpts = useMemo(() => {
    if (!typeData) return [];
    return [...typeData.opts, ...getAppliances(typeData).map(a => ({...a, cat:'가전 옵션', label: a.name}))];
  }, [typeData]);
  const total = useMemo(() => Object.values(sel).reduce((s, v) => s + v, 0), [sel]);

  const onSubmitComplete = useCallback(async () => {
    if (!signData || submitting || !typeData) return;
    setSubmitResult(null);
    setSubmitting(true);
    const list = allOpts.filter((o) => sel[o.id] !== undefined);
    const sum = Object.values(sel).reduce((s, v) => s + v, 0);
    try {
      const receiptNo = await fetchNextReceiptNoFromSupabase();
      const payload = buildApplicationPayloadFromState({
        dong,
        ho,
        contractor,
        phoneLast4,
        unitType: typeData.name,
        selectedList: list,
        total: sum,
        signData,
        receiptNo
      });
      await submitApplicationToAdmin(payload);
      const okMsg =
        "신청이 접수되었습니다. 담당자가 관리자 화면에서 확인합니다. 아래에서 계약서를 확인한 뒤, 필요하면 「인쇄하기」를 눌러 주세요.";
      setSubmitResult({ ok: true, message: okMsg });
      setContractPreviewOpen(true);
    } catch (err) {
      console.error(err);
      const msg = err?.message || "저장에 실패했습니다.";
      setSubmitResult({ ok: false, message: msg });
      setNoticeModal({
        title: "신청 저장 실패",
        body: `저장 중 오류가 발생했습니다.\n\n${msg}`
      });
    } finally {
      setSubmitting(false);
    }
  }, [signData, submitting, typeData, allOpts, sel, dong, ho, contractor, phoneLast4]);

  const toggle = (id) => {
    setSel(prev => {
      const next = {...prev};
      const opt = allOpts.find(o => o.id === id);
      if (!opt) return prev;
      if (next[id] !== undefined) { delete next[id]; }
      else {
        if (opt.group) allOpts.filter(o => o.group === opt.group && o.id !== id).forEach(o => delete next[o.id]);
        next[id] = opt.price;
      }
      return next;
    });
  };

  const resetType = (key) => { setTypeKey(key); setSel({}); };
  const selectedList = allOpts.filter(o => sel[o.id] !== undefined);

  const tryEnterOptionsFromGate = useCallback(async () => {
    if (!typeKey) {
      setNoticeModal({
        title: "평형 선택",
        body: "옵션 신청을 계속하려면 아래에서 평형(㎡)을 한 가지 선택해 주세요."
      });
      return;
    }
    setGateVerifying(true);
    try {
      let row;
      try {
        row = await verifyResidentForGate(dong, ho, contractor, phoneLast4);
      } catch (err) {
        console.error(err);
        setNoticeModal({
          title: "세대 검증 오류",
          body: err?.message || "세대 정보를 확인하는 중 오류가 발생했습니다."
        });
        return;
      }
      if (!row) {
        setNoticeModal({
          title: "등록 정보 불일치",
          body: "입력하신 동·호·계약자명·휴대폰 뒷 4자리가 단지 등록 세대와 일치하지 않습니다.\n\n분양 계약서·등록부와 동일하게 입력했는지 다시 확인해 주세요."
        });
        return;
      }
      if (row.typeKey !== typeKey) {
        const expect = TYPES.find((t) => t.key === row.typeKey)?.name || row.typeKey;
        setNoticeModal({
          title: "평형 확인",
          body: `선택하신 평형이 등록된 세대 정보와 다릅니다.\n\n해당 세대의 평형은 「${expect}」입니다. 평형 버튼을 맞게 선택한 뒤 다시 시도해 주세요.`
        });
        return;
      }
      setStep(1);
    } finally {
      setGateVerifying(false);
    }
  }, [dong, ho, contractor, phoneLast4, typeKey]);

  const noticePortal =
    noticeModal &&
    createPortal(
      <div
        className="yyc-notice-backdrop"
        role="presentation"
        onClick={() => setNoticeModal(null)}
      >
        <div
          className="yyc-notice-panel"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="yyc-notice-title"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="yyc-notice-head">
            <h3 id="yyc-notice-title" className="yyc-notice-title">
              {noticeModal.title}
            </h3>
          </div>
          <p className="yyc-notice-body">{noticeModal.body}</p>
          <div className="yyc-notice-foot">
            <button type="button" className="yyc-notice-btn" onClick={() => setNoticeModal(null)}>
              확인
            </button>
          </div>
        </div>
      </div>,
      document.body
    );

  if (step === 0) {
    return (
      <>
      <div className="container">
        <header className="hero">
          <h1 className="hero-title">청량리역 요진 와이시티</h1>
          <p className="hero-sub">멀티플러스 옵션 전자 신청 시스템</p>
        </header>
        <div className="form-card">
          <div className="contractor-form-center">
            <h2 className="section-title">계약자 정보</h2>
            <div className="form-row"><label>동</label><input type="text" value={dong} onChange={e=>setDong(e.target.value)} placeholder="예: 101" /></div>
            <div className="form-row"><label>호</label><input type="text" value={ho} onChange={e=>setHo(e.target.value)} placeholder="예: 1201" /></div>
            <div className="form-row"><label>계약자명</label><input type="text" value={contractor} onChange={e=>setContractor(e.target.value)} placeholder="이름 입력" /></div>
            <div className="form-row">
              <label>휴대폰 뒷자리</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={phoneLast4}
                onChange={(e) => setPhoneLast4(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="숫자 4자리"
                autoComplete="off"
              />
            </div>
          </div>
          <h2 className="section-title">평형 선택</h2>
          <div className="resident-gate-hint-wrap">
            <p className="resident-gate-hint">
              <strong>동·호·성함·휴대폰 뒷4자리</strong>가 모두 등록 정보와 일치해야 다음 단계로 진행 가능합니다
            </p>
          </div>
          <div className="type-grid">
            {TYPES.map(t => <button key={t.key} className={'type-btn'+(typeKey===t.key?' active':'')} onClick={()=>resetType(t.key)}>{t.name}</button>)}
          </div>
          <div className="entry-actions">
            <button className="primary-btn" disabled={gateVerifying||!typeKey||!dong||!ho||!contractor||phoneLast4.length!==4} onClick={tryEnterOptionsFromGate}>{gateVerifying ? "확인 중…" : "옵션 계약 신청 →"}</button>
            <button className="secondary-btn" disabled={gateVerifying||!typeKey||!dong||!ho||!contractor||phoneLast4.length!==4} onClick={tryEnterOptionsFromGate}>{gateVerifying ? "확인 중…" : "옵션 계약 변경 신청 →"}</button>
          </div>
        </div>
      </div>
      {noticePortal}
      </>
    );
  }

  if (step === 1) {
    const cats = []; const catMap = {};
    allOpts.forEach(o => { if(!catMap[o.cat]){catMap[o.cat]=[];cats.push(o.cat);} catMap[o.cat].push(o); });
    return (
      <>
      <div className="container">
        <header className="header-bar">
          <span className="header-info">{typeData.name} | {dong}동 {ho}호 | {contractor}</span>
          <span className="header-total">합계: {fmt(total)}</span>
        </header>
        <div className="plan-box">{typeData.floorPlan?<img src={typeData.floorPlan} alt={typeData.name}/>:<div className="plan-ph"><span>🏠</span>{typeData.name} 평면도</div>}</div>
        <div className="option-layout">
          <div className="option-main">
            {cats.map(cat => {
              if (cat === '가전 옵션') {
                const allApps = catMap[cat];
                return (
                  <div key={cat} className="cat-section">
                    <h2 className="cat-title">{cat}</h2>
                    <div className="app-table">
                      <div className="app-head"><span>품목</span><span>미선택형 / 선택형</span><span>선택</span></div>
                      {allApps.map(opt => {
                        const isOn = sel[opt.id] !== undefined;
                        if (opt.baseImg||opt.img) {
                          return (
                            <div key={opt.id} className={'app-item'+(isOn?' on':'')}>
                              <div className="cmp-labels"><div className="cmp-lbl base">기본 미선택형</div><div className="cmp-lbl sel">유상 선택형</div></div>
                              <div className="cmp-imgs"><div className="cmp-img">{opt.baseImg?<img src={opt.baseImg} alt="미선택형"/>:<div className="img-ph">📷</div>}</div><div className="cmp-img">{opt.img?<img src={opt.img} alt="선택형"/>:<div className="img-ph">📷</div>}</div></div>
                              <div className="cmp-cols">
                                <div className="cmp-col"><div className="cmp-desc">미선택형</div><div className="cmp-dash">–</div></div>
                                <div className="cmp-col"><div style={ {fontWeight:700,marginBottom:'.25rem'} }>{opt.name}</div>{opt.model&&<div style={ {fontSize:'.75rem',color:'#64748b',marginBottom:'.5rem'} }>{opt.model}</div>}<div className="cmp-desc">선택형</div><div className="cmp-price">공급금액 : {fmt(opt.price)}</div><div style={ {marginTop:'.5rem',textAlign:'right'} }><button className={'toggle-btn sm'+(isOn?' on':'')} onClick={()=>toggle(opt.id)}>{isOn?'선택됨':'선택'}</button></div></div>
                              </div>
                                                          </div>
                          );
                        }
                        return (
                          <div key={opt.id} className={'app-item'+(isOn?' on':'')}>
                            <div className="app-sub">
                              <div className="app-name"><div className="app-main">{opt.name}</div>{opt.model && <div className="app-model">{opt.model}</div>}</div>
                              <div><div className="app-type">미선택형</div><div className={'app-val'+(opt.base==='-'?' dash':'')}>{opt.base === '-' ? '–' : opt.base}</div></div>
                              <div></div>
                            </div>
                            <div className="app-sub sel">
                              <div></div>
                              <div><div className="app-type sel-type">선택형{opt.note ? ' '+opt.note : ''}</div><div className="app-price">공급금액 : {fmt(opt.price)}</div></div>
                              <button className={'toggle-btn sm'+(isOn?' on':'')} onClick={()=>toggle(opt.id)}>{isOn?'선택됨':'선택'}</button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {allApps.some(o=>o.appNotes) && <div className="cmp-notes">{allApps.filter(o=>o.appNotes).flatMap(o=>o.appNotes).map((n,i)=><div key={i} className="cmp-note">{n}</div>)}</div>}
                  </div>
                );
              }
              const hasImg = ['주방 마감 및 가구 특화','붙박이장','공간(드레스룸) 특화'].includes(cat);
              const catOpts = catMap[cat];
              const imgOpt = catOpts.find(o => o.baseImg || o.img) || catOpts[0];
              return (
                <div key={cat} className="cat-section">
                  <div className="cmp-card">
                    <div className="cmp-head">▣ {cat} 옵션 선택</div>
                    <div className="cmp-labels"><div className="cmp-lbl base">기본 미선택형</div><div className="cmp-lbl sel">유상 선택형</div></div>
                    {hasImg && (<div className="cmp-imgs"><div className="cmp-img">{imgOpt.baseImg?<img src={imgOpt.baseImg} alt="미선택형"/>:<div className="img-ph">📷 미선택형</div>}</div><div className="cmp-img">{imgOpt.img?<img src={imgOpt.img} alt="선택형"/>:<div className="img-ph">📷 선택형</div>}</div></div>)}
                    {catOpts.map(opt => {
                      const isOn = sel[opt.id] !== undefined;
                      const isExcl = opt.group && allOpts.some(o => o.group===opt.group && o.id!==opt.id && sel[o.id]!==undefined);
                      const bItems = (opt.base||'').split(' + ');
                      const sItems = (opt.label||opt.name||'').split(' + ');
                      return (
                        <div key={opt.id} className={'cmp-row'+(isOn?' on':'')+(isExcl?' excluded':'')}>
                          <div className="cmp-cols">
                            <div className="cmp-col"><div className="cmp-desc">{opt.base?bItems.map((x,i) => <div key={i}>· {x}</div>):null}</div><div className="cmp-dash">–</div></div>
                            <div className="cmp-col"><div className="cmp-desc">{sItems.map((x,i) => <div key={i}>· {x}</div>)}</div><div className="cmp-price">공급금액 : {fmt(opt.price)}</div></div>
                          </div>
                          <div className="cmp-foot">{isExcl && <span className="cmp-excl">⚠ 상호 배타 옵션</span>}<button className={'toggle-btn'+(isOn?' on':'')} onClick={()=>toggle(opt.id)}>{isOn?'선택됨':'선택'}</button></div>
                          {opt.notes&&<div className="cmp-notes">{opt.notes.map((n,i)=><div key={i} className="cmp-note">{n}</div>)}</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="sidebar">
            <div className="sidebar-sticky">
              <h3>선택 내역</h3>
              {selectedList.length===0 && <p className="empty">선택된 옵션이 없습니다</p>}
              {selectedList.map(o => <div key={o.id} className="sidebar-item"><span>{o.label||o.name}</span><span>{fmt(o.price)}</span></div>)}
              <div className="sidebar-total"><span>합계</span><span>{fmt(total)}</span></div>
              <button className="primary-btn" onClick={()=>setStep(2)}>신청서 확인 &rarr;</button>
              <button className="secondary-btn" onClick={()=>setStep(0)}>&larr; 처음으로</button>
            </div>
          </div>
        </div>
      </div>
      {noticePortal}
      </>
    );
  }

  const contractForm = (
    <ApplicationForm59A typeData={typeData} sel={sel} signData={signData} contractor={contractor} dong={dong} ho={ho} />
  );

  const contractPreviewModal =
    contractPreviewOpen &&
    createPortal(
      <div
        className="contract-preview-backdrop"
        role="presentation"
        onClick={(e) => {
          if (e.target === e.currentTarget) setContractPreviewOpen(false);
        }}
      >
        <div className="contract-preview-panel" role="dialog" aria-modal="true" aria-labelledby="contract-preview-title">
          <div className="contract-preview-head">
            <h2 id="contract-preview-title">접수 계약서 미리보기</h2>
            <button type="button" className="contract-preview-close" onClick={() => setContractPreviewOpen(false)} aria-label="닫기">
              ×
            </button>
          </div>
          <div className="contract-preview-body">{contractForm}</div>
          <div className="contract-preview-foot">
            <button type="button" className="secondary-btn" onClick={() => setContractPreviewOpen(false)}>
              닫기
            </button>
            <button type="button" className="primary-btn" onClick={() => window.print()}>
              인쇄하기
            </button>
          </div>
        </div>
      </div>,
      document.body
    );

  return (
    <>
    <div className="container">
      {!contractPreviewOpen ? contractForm : null}
      {contractPreviewModal}
      <div className="summary-card">
        <div className="summary-header">
          <h1>청량리역 요진 와이시티</h1>
          <h2>{typeData.name} 멀티플러스 옵션 신청서</h2>
        </div>
        <div className="summary-info">
          <div className="info-row"><span>평형</span><span>{typeData.name}</span></div>
          <div className="info-row"><span>동 / 호</span><span>{dong}동 {ho}호</span></div>
          <div className="info-row"><span>계약자</span><span>{contractor}</span></div>
        </div>
        <table className="summary-table">
          <thead><tr><th>구분</th><th>옵션 내용</th><th>금액</th></tr></thead>
          <tbody>
            {selectedList.map(o => <tr key={o.id}><td>{o.cat}</td><td>{o.label||o.name}{o.model?' ('+o.model+')':''}</td><td className="price-cell">{fmt(o.price)}</td></tr>)}
            {selectedList.length===0 && <tr><td colSpan="3" className="empty-cell">선택된 옵션이 없습니다 (전체 미선택형)</td></tr>}
          </tbody>
          <tfoot>
            <tr><td colSpan="2">총 옵션 금액</td><td className="price-cell total-cell">{fmt(total)}</td></tr>
          </tfoot>
        </table>
        <div className="summary-sign">
          <p>상기 옵션을 신청합니다.</p>
          <div className="sign-pad-wrap">
            <div className="sign-pad-label">✒️ 하단에 정자 서명을 부탁드립니다.</div>
            {signData ? (
              <img src={signData} alt="서명" className="sign-img" />
            ) : (
              <div className="sign-canvas-box">
                <canvas ref={canvasRef} width={360} height={120}
                  onMouseDown={startDraw} onMouseMove={moveDraw} onMouseUp={endDraw} onMouseLeave={endDraw}
                  onTouchStart={startDraw} onTouchMove={moveDraw} onTouchEnd={endDraw}
                />
                <div className="sign-placeholder">터치 또는 마우스로 서명</div>
              </div>
            )}
            <div className="sign-actions">
              {signData ? (
              <button className="sign-clear-btn" onClick={clearSign}>다시 쓰기</button>
            ) : (
              <React.Fragment>
                <button className="sign-clear-btn" onClick={clearSign}>지우기</button>
                <button className="sign-confirm-btn" onClick={confirmSign}>서명 완료</button>
              </React.Fragment>
            )}
            </div>
          </div>
          <div className="sign-row">
            <span><span className="af-contractor-label">계약자:</span> {contractor}</span>
            <span className="sign-seal-wrap">
              <span className="sign-seal-chop">(인)</span>
              {signData && <img className="sign-inline-img" src={signData} alt="서명" />}
            </span>{signData && <button type="button" className="sign-redo-inline" onClick={clearSign} title="다시쓰기" aria-label="다시쓰기">↻</button>}
          </div>
          <div className="sign-date">{new Date().toLocaleDateString('ko-KR')}</div>
        </div>
        {submitResult && (
          <div
            role="status"
            className={`submit-banner ${submitResult.ok ? "submit-banner--ok" : "submit-banner--err"}`}
          >
            {submitResult.message}
          </div>
        )}
        <div className="summary-actions">
          <button type="button" className="primary-btn" disabled={!signData || submitting} onClick={onSubmitComplete}>
            {submitting ? '제출 중...' : '신청완료'}
          </button>
          <button type="button" className="secondary-btn" onClick={() => window.print()}>인쇄하기</button>
          {submitResult?.ok && (
            <button type="button" className="secondary-btn" onClick={() => setContractPreviewOpen(true)}>
              계약서 미리보기
            </button>
          )}
          <button type="button" className="secondary-btn" onClick={() => { setSubmitResult(null); setContractPreviewOpen(false); setStep(1); }}>&larr; 옵션 수정</button>
          <button type="button" className="secondary-btn" onClick={() => { setStep(0); setSel({}); setSignData(null); setSubmitResult(null); setContractPreviewOpen(false); setPhoneLast4(""); }}>새로 작성</button>
        </div>

      </div>
    </div>
    {noticePortal}
    </>
  );
}

