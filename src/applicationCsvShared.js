/**
 * 관리자 CSV — 옵션 신청 화면(TYPES + getAppliances)과 동일한 품목 열·매칭
 * App.jsx 와 로컬 동기화 스크립트에서 공통 사용
 */

export function parseSelectedOptions(raw) {
  if (Array.isArray(raw)) return raw;
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

export function sumSelectedOptionsPrices(selected_options) {
  return parseSelectedOptions(selected_options).reduce((s, o) => s + (Number(o.price) || 0), 0);
}

/**
 * @param {Array<{ key: string, opts: object[] }>} types — TYPES
 * @param {(t: object) => object[]} getAppliancesFn — getAppliances
 * @returns {{ id: string, category: string, label: string, header: string, matchKey: string }[]}
 */
export function buildCsvOptionColumnDefs(types, getAppliancesFn) {
  const list = [];
  const seen = new Set();
  for (const t of types) {
    const appliances = getAppliancesFn(t).map((a) => ({
      id: a.id,
      cat: "가전 옵션",
      label: (a.name || "").trim(),
      name: a.name
    }));
    for (const o of [...t.opts, ...appliances]) {
      if (!o?.id) continue;
      const lab = (o.label || o.name || "").trim();
      const cat = (o.cat || "").trim();
      const matchKey = `${o.id}|${cat}|${lab}`;
      if (seen.has(matchKey)) continue;
      seen.add(matchKey);
      list.push({
        id: o.id,
        category: cat,
        label: lab,
        matchKey,
        /** 신청 화면 옵션표 1·2열과 동일: 카테고리 — 품목(한 줄) */
        header: `${cat} — ${lab}`
      });
    }
  }
  return list;
}

/**
 * @param {object[]} selected_options
 * @param {ReturnType<typeof buildCsvOptionColumnDefs>} defs
 */
export function accumulateCsvOptionAmounts(selected_options, defs) {
  const amounts = new Array(defs.length).fill(0);
  let extra = 0;
  for (const o of parseSelectedOptions(selected_options)) {
    const p = Number(o.price) || 0;
    let idx = -1;
    const cat = (o.category || "").trim();
    const lab = (o.label || o.name || "").trim();
    if (o.option_key) idx = defs.findIndex((d) => d.matchKey === o.option_key);
    if (idx < 0 && o.option_id) {
      idx = defs.findIndex((d) => d.id === o.option_id && d.category === cat && d.label === lab);
    }
    if (idx < 0 && o.option_id) idx = defs.findIndex((d) => d.id === o.option_id);
    if (idx < 0) idx = defs.findIndex((d) => d.category === cat && d.label === lab);
    if (idx >= 0) amounts[idx] += p;
    else extra += p;
  }
  return { amounts, extra };
}
