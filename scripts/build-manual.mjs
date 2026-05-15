import fs from "node:fs";
import path from "node:path";
import { prependFrontPagesBlock } from "./front-pages-block.mjs";

const DIR = path.resolve("docs/manual");
const OUT = path.join(DIR, "MANUAL-FULL.md");

const order = [
  "00-cover.md",
  "00-prep.md",
  "01-hello.md",
  "02-github.md",
  "03-pages.md",
  "04-supabase-init.md",
  "05-registry.md",
  "06-input-form.md",
  "07-verify.md",
  "08-options.md",
  "09-personal-form.md",
  "10-signature.md",
  "11-db-save.md",
  "12-auto-excel.md",
  "13-admin-list.md",
  "14-detail-download.md",
  "15-reset.md",
  "16-actions.md",
  "17-security.md",
  "18-ops-backup.md",
  "19-errors-30.md",
  "20-season-handover.md",
  "A-sql.md",
  "B-edge-functions.md",
  "C-env-secrets.md",
  "D-extensions.md",
];

const parts = [];
for (const f of order) {
  const p = path.join(DIR, f);
  if (!fs.existsSync(p)) {
    console.error("MISSING:", f);
    continue;
  }
  const body = fs.readFileSync(p, "utf8").trimEnd();
  parts.push(body);
}

const merged =
  parts.join("\n\n---\n\n<div class='page-break'></div>\n\n") + "\n";
const withFront = prependFrontPagesBlock(merged);
fs.writeFileSync(OUT, withFront, "utf8");
console.log("wrote", OUT, withFront.length, "chars (with front-pages)");
