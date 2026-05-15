import fs from "node:fs";
import path from "node:path";

const DEFAULT_SOURCE = path.resolve("docs/manual/front-pages.html");

/**
 * front-pages.html → MANUAL-FULL.md 맨 앞에 넣을 raw HTML 블록
 */
export function buildFrontPagesBlock(sourcePath = DEFAULT_SOURCE) {
  const html = fs.readFileSync(sourcePath, "utf8");

  const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/i);
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!styleMatch || !bodyMatch) {
    throw new Error("front-pages.html 에서 <style> 또는 <body> 를 찾지 못했습니다.");
  }

  let css = styleMatch[1].trim();

  // standalone HTML 용 body/전역 규칙 제거·스코프 조정
  css = css
    .replace(/\*[\s\S]*?box-sizing:border-box\}/, "")
    .replace(/body\{[^}]+\}/g, "")
    .trim();

  // .page → .manual-front-pages .page
  css = css.replace(/(^|\n)\s*\.page\s*\{/g, "$1.manual-front-pages .page {");

  // @media print 내부
  css = css.replace(
    /@media print\{([\s\S]*?)\}/,
    (_, inner) => {
      const scoped = inner
        .replace(/body\{background:#fff\}/g, ".manual-front-pages{background:#fff}")
        .replace(/\.page\{/g, ".manual-front-pages .page{");
      return `@media print{${scoped}}`;
    }
  );

  const pageBreakCss = `
/* PDF: 각 앞장 페이지 분리 */
.manual-front-pages .page {
  page-break-after: always !important;
  break-after: page !important;
}
.manual-front-pages .page:last-child {
  page-break-after: auto !important;
  break-after: auto !important;
}
@media print {
  .manual-front-pages .page {
    page-break-after: always !important;
    break-after: page !important;
  }
  .manual-front-pages .page:last-child {
    page-break-after: auto !important;
    break-after: auto !important;
  }
}`;

  const bodyHtml = bodyMatch[1].trim();

  return `<!-- 앞장 (front-pages.html) — MANUAL-FULL 맨 앞 HTML 블록 -->
<div class="manual-front-pages">
<style>
.manual-front-pages *{margin:0;padding:0;box-sizing:border-box}
${css}
${pageBreakCss}
</style>

${bodyHtml}
</div>

---

<div class='page-break'></div>

`;
}

export const FRONT_PAGES_SPLIT = "\n\n---\n\n<div class='page-break'></div>\n\n";

export function stripFrontPagesBlock(md) {
  if (!md.startsWith("<!-- 앞장 (front-pages.html)")) return md;
  const idx = md.indexOf(FRONT_PAGES_SPLIT);
  if (idx === -1) return md;
  return md.slice(idx + FRONT_PAGES_SPLIT.length);
}

export function prependFrontPagesBlock(md, sourcePath = DEFAULT_SOURCE) {
  const body = stripFrontPagesBlock(md);
  return buildFrontPagesBlock(sourcePath) + body;
}
