import fs from "node:fs";
import path from "node:path";

const MANUAL_DIR = path.resolve("docs/manual");
const LINE_RE = /^\s*\[스크린샷:.*\]\s*$/;

function stripFile(filePath) {
  const before = fs.readFileSync(filePath, "utf8");
  const lines = before.split("\n");
  let removed = 0;
  const kept = [];
  for (const line of lines) {
    if (LINE_RE.test(line)) {
      removed++;
      continue;
    }
    kept.push(line);
  }
  if (removed === 0) return { removed: 0, changed: false };
  const after = kept.join("\n");
  fs.writeFileSync(filePath, after, "utf8");
  return { removed, changed: true };
}

const names = fs
  .readdirSync(MANUAL_DIR)
  .filter((n) => n.endsWith(".md"))
  .sort();

let totalRemoved = 0;
let filesChanged = 0;

for (const name of names) {
  const filePath = path.join(MANUAL_DIR, name);
  const { removed, changed } = stripFile(filePath);
  totalRemoved += removed;
  if (changed) {
    filesChanged++;
    console.log(`${name}: removed ${removed} line(s)`);
  }
}

console.log(`\nDone. Files changed: ${filesChanged} / ${names.length}`);
console.log(`Total lines removed: ${totalRemoved}`);
