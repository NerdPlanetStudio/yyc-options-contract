#!/usr/bin/env node
/**
 * 로컬 src/data/allowedResidents.json → yyc_resident_registry UPSERT SQL 출력
 * 사용: npm run db:residents-sql > seed.sql  후 Supabase SQL Editor 에 붙여넣기
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(__dirname, "../src/data/allowedResidents.json");

if (!fs.existsSync(src)) {
  console.error("파일이 없습니다:", src);
  console.error("프로젝트 루트에 src/data/allowedResidents.json 을 두고 다시 실행하세요.");
  process.exit(1);
}

const rows = JSON.parse(fs.readFileSync(src, "utf8"));
if (!Array.isArray(rows)) {
  console.error("JSON 배열이 아닙니다.");
  process.exit(1);
}

function norm(r) {
  return {
    dong: String(r.dong ?? "").replace(/\D/g, ""),
    ho: String(r.ho ?? "").replace(/\D/g, ""),
    contractor_name: String(r.name ?? "")
      .trim()
      .replace(/\s+/g, " "),
    phone_tail: String(r.phoneTail ?? "")
      .replace(/\D/g, "")
      .slice(0, 4),
    type_key: String(r.typeKey ?? "").trim(),
  };
}

function esc(s) {
  return `'${String(s).replace(/'/g, "''")}'`;
}

const vals = rows
  .map(norm)
  .filter(
    (r) =>
      r.dong &&
      r.ho &&
      r.contractor_name &&
      r.phone_tail.length === 4 &&
      r.type_key
  );

if (vals.length === 0) {
  console.error("유효한 행이 없습니다.");
  process.exit(1);
}

console.log(
  `-- ${vals.length} rows from allowedResidents.json\n` +
    "INSERT INTO public.yyc_resident_registry (dong, ho, contractor_name, phone_tail, type_key) VALUES\n" +
    vals
      .map(
        (v) =>
          `  (${esc(v.dong)}, ${esc(v.ho)}, ${esc(v.contractor_name)}, ${esc(v.phone_tail)}, ${esc(v.type_key)})`
      )
      .join(",\n") +
    "\nON CONFLICT (dong, ho, contractor_name, phone_tail) DO UPDATE SET type_key = EXCLUDED.type_key;\n"
);
