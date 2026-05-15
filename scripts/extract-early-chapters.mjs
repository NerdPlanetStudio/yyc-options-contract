import fs from "node:fs";
import path from "node:path";

const TRANSCRIPT =
  "/Users/dongwoolim/.cursor/projects/empty-window/agent-transcripts/ab720a3e-aa78-4773-8d2f-5c731c8fe657/ab720a3e-aa78-4773-8d2f-5c731c8fe657.jsonl";
const OUT_DIR = "/Users/dongwoolim/yyc-options/docs/manual";

const lines = fs.readFileSync(TRANSCRIPT, "utf8").split("\n").filter(Boolean);

const targets = [
  { idxStart: "# 0장", file: "00-prep.md" },
  { idxStart: "# 1장", file: "01-hello.md" },
  { idxStart: "# 2장", file: "02-github.md" },
  { idxStart: "# 3장", file: "03-pages.md" },
];

const found = {};

for (const line of lines) {
  let obj;
  try {
    obj = JSON.parse(line);
  } catch {
    continue;
  }
  if (obj.role !== "assistant") continue;
  const content = obj.message?.content;
  if (!Array.isArray(content)) continue;
  for (const c of content) {
    if (c.type !== "text") continue;
    const text = c.text || "";
    for (const t of targets) {
      if (found[t.file]) continue;
      if (text.startsWith(t.idxStart) || text.includes("\n" + t.idxStart)) {
        // Trim from the chapter heading to end of this assistant text
        const startIdx = text.indexOf(t.idxStart);
        const body = text.slice(startIdx).trim();
        found[t.file] = body;
      }
    }
  }
}

for (const t of targets) {
  if (!found[t.file]) {
    console.error("MISSING:", t.idxStart);
    continue;
  }
  fs.writeFileSync(path.join(OUT_DIR, t.file), found[t.file] + "\n", "utf8");
  console.log("wrote", t.file, found[t.file].length, "chars");
}
