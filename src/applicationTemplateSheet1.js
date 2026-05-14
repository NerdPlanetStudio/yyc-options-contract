/**
 * 복사본.xlsx 피벗 시트 — `옵션 신청 현황`(신규) 또는 `Sheet1 (2)`(구) 열 구성(27열)
 */

import { parseSelectedOptions } from "./applicationCsvShared.js";

/** 신규 템플릿 시트명 우선, 구 복사본 호환 */
export const TEMPLATE_PIVOT_SHEET_NAMES = ["옵션 신청 현황", "Sheet1 (2)"];

export function resolveTemplatePivotSheetName(wb) {
  if (!wb?.SheetNames || !wb.Sheets) return null;
  for (const name of TEMPLATE_PIVOT_SHEET_NAMES) {
    if (wb.SheetNames.includes(name) && wb.Sheets[name]) return name;
  }
  return null;
}

/** 템플릿 1행 — 순서·문구가 다르면 병합하지 않음 */
export const TEMPLATE_SHEET1_HEADERS = [
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

export const TEMPLATE_USE_TYPE = "도시형생활주택";

export function phoneTailDigits4(value) {
  if (value == null || value === "") return "";
  const d = String(value).replace(/\D/g, "");
  if (!d) return "";
  return d.length <= 4 ? d : d.slice(-4);
}

function normCat(cat) {
  return String(cat || "")
    .replace(/\s+/g, "")
    .trim();
}

/**
 * @returns {number} 0..17 (옵션 18칸), -1 은 해당 열 없음(총액은 별도)
 */
export function templateSheet1PivotColumnIndex(o) {
  const id = o.option_id || o.id;

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
  const lab = String(o.label || o.name || "").trim();

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

export function accumulateTemplateSheet1Amounts(selected_options) {
  const amounts = new Array(18).fill(0);
  for (const o of parseSelectedOptions(selected_options)) {
    const p = Number(o.price) || 0;
    const idx = templateSheet1PivotColumnIndex(o);
    if (idx >= 0 && idx < amounts.length) amounts[idx] += p;
  }
  return { amounts };
}

export function templateSheet1HeadersMatch(row0) {
  if (!row0 || row0.length < TEMPLATE_SHEET1_HEADERS.length) return false;
  return TEMPLATE_SHEET1_HEADERS.every((h, i) => String(row0[i] ?? "").trim() === h);
}

/** 기존 데이터가 끝난 다음 행 인덱스 (0-based, 헤더=0) */
export function findTemplateSheet1AppendRowIndex(aoa) {
  if (!aoa || aoa.length < 2) return 1;
  let last = 0;
  for (let i = 1; i < aoa.length; i++) {
    const row = aoa[i];
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

export function nextTemplateSheet1Sequence(aoa, appendRowIndex) {
  let maxSeq = 0;
  for (let i = 1; i < appendRowIndex; i++) {
    const row = aoa[i];
    if (!row) continue;
    const n = Number(row[0]);
    if (Number.isFinite(n)) maxSeq = Math.max(maxSeq, Math.floor(n));
  }
  return maxSeq + 1;
}

/**
 * @param {object} r — applications 행
 * @param {number} seq — 순번
 */
export function buildTemplateSheet1DataRow(r, seq) {
  const { amounts } = accumulateTemplateSheet1Amounts(r.selected_options);
  const optCells = amounts.map((x) => (x === 0 ? "" : x));
  const totalNum = Number(r.total_price) || 0;
  return [
    seq,
    r.receipt_no ?? "",
    TEMPLATE_USE_TYPE,
    r.unit_type ?? "",
    r.dong ?? "",
    r.ho ?? "",
    r.customer_name ?? "",
    phoneTailDigits4(r.phone),
    ...optCells,
    totalNum
  ];
}
