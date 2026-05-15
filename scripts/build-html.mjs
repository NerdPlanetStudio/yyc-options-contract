import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";
import { FRONT_PAGES_SPLIT } from "./front-pages-block.mjs";

const INPUT = path.resolve("docs/manual/MANUAL-FULL.md");
const OUTPUT = path.resolve("docs/manual/MANUAL-FULL.html");
const CSS_PATH = path.resolve("scripts/manual-style.css");

marked.setOptions({ gfm: true, breaks: false });

const md = fs.readFileSync(INPUT, "utf8");
const css = fs.readFileSync(CSS_PATH, "utf8");

let frontHtml = "";
let bodyMd = md;
if (md.startsWith("<!-- 앞장 (front-pages.html)")) {
  const splitIdx = md.indexOf(FRONT_PAGES_SPLIT);
  if (splitIdx !== -1) {
    frontHtml = md.slice(0, splitIdx);
    bodyMd = md.slice(splitIdx + FRONT_PAGES_SPLIT.length);
  }
}

const renderer = new marked.Renderer();
renderer.heading = (text, level, raw) => {
  const slug = String(raw)
    .toLowerCase()
    .replace(/[^\w가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `<h${level} id="${slug}">${text}</h${level}>\n`;
};

const bodyHtml = marked.parse(bodyMd, { renderer });

const doc = `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>○○아파트 옵션 신청 시스템 매뉴얼</title>
<style>
${css}

/* 앞장 (front-pages) */
.manual-front-pages {
  margin: 0 auto 24px;
}
@media screen {
  .manual-front-pages .page {
    margin-left: auto;
    margin-right: auto;
    box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  }
}
@media print {
  .manual-front-pages .page {
    margin: 0;
    box-shadow: none;
    page-break-after: always !important;
    break-after: page !important;
  }
  .manual-front-pages .page:last-child {
    page-break-after: auto !important;
    break-after: auto !important;
  }
}

/* 화면 미리보기용 추가 스타일 */
@media screen {
  body {
    max-width: 100%;
    margin: 0;
    padding: 0 0 80px;
    background: #f0f0f0;
  }
  .doc {
    max-width: 820px;
    margin: 24px auto;
    background: white;
    padding: 40px 48px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  }
  .print-hint {
    position: sticky;
    top: 12px;
    z-index: 10;
    background: #2563eb;
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 14px;
    margin: 12px auto 16px;
    max-width: 820px;
    text-align: center;
    font-weight: 500;
    box-shadow: 0 2px 8px rgba(37,99,235,0.3);
  }
  .print-hint kbd {
    background: rgba(255,255,255,0.2);
    padding: 2px 6px;
    border-radius: 3px;
    font-family: inherit;
    margin: 0 2px;
  }
}

@media print {
  .print-hint { display: none !important; }
  body { background: white; max-width: none; margin: 0; padding: 0; }
  .doc { box-shadow: none; padding: 0; border-radius: 0; max-width: none; margin: 0; }
}
</style>
</head>
<body>
<div class="print-hint">
  📄 PDF로 저장하려면 <kbd>⌘</kbd> + <kbd>P</kbd> 누른 후 "대상" → <strong>PDF로 저장</strong> 선택
</div>
${frontHtml}
<div class="doc">
${bodyHtml}
</div>
</body>
</html>`;

fs.writeFileSync(OUTPUT, doc, "utf8");
console.log("wrote", OUTPUT, doc.length, "chars");
console.log("front-pages block:", frontHtml ? "yes" : "no");
