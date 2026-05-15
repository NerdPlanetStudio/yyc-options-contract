import fs from "node:fs";
import path from "node:path";
import { prependFrontPagesBlock } from "./front-pages-block.mjs";

const MANUAL = path.resolve("docs/manual/MANUAL-FULL.md");
const SOURCE =
  process.argv[2] ||
  process.env.FRONT_PAGES_HTML ||
  path.resolve("docs/manual/front-pages.html");

const md = fs.readFileSync(MANUAL, "utf8");
const out = prependFrontPagesBlock(md, SOURCE);
fs.writeFileSync(MANUAL, out, "utf8");
console.log("updated", MANUAL);
console.log("source:", SOURCE);
