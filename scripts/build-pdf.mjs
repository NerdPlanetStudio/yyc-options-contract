import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const HTML = path.resolve("docs/manual/MANUAL-FULL.html");
const PDF = path.resolve("docs/manual/yyc-options-manual.pdf");

if (!fs.existsSync(HTML)) {
  console.error("HTML not found. Run: npm run manual:build");
  process.exit(1);
}

const candidates = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
];
const chrome = candidates.find((p) => fs.existsSync(p));
if (!chrome) {
  console.error(
    "Chrome / Edge / Brave / Chromium 중 어느 것도 찾지 못했어요. 그 중 하나 설치 후 다시 실행해 주세요."
  );
  process.exit(1);
}

console.log("[1/2] using:", chrome);
console.log("[2/2] generating PDF...");

execFileSync(
  chrome,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    `--print-to-pdf=${PDF}`,
    `file://${HTML}`,
  ],
  { stdio: "inherit" }
);

const sizeKB = (fs.statSync(PDF).size / 1024).toFixed(1);
console.log(`\n✅ PDF created: ${PDF}  (${sizeKB} KB)`);
console.log("그대로 더블클릭하시거나 다른 곳에 복사해 두세요.");
