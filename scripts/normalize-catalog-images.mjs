/**
 * 카탈로그 이미지(평면도·옵션 비교) 여백 정리 — 냉장고 URL 제외
 * - 외곽 여백 trim (밝은 배경 기준)
 * - #fff 배경으로 flatten
 * - public/images/catalog/ 저장 후 optionsCatalog.js URL 치환
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const execFileAsync = promisify(execFile);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const catalogPath = path.join(root, 'src', 'optionsCatalog.js');
const outDir = path.join(root, 'public', 'images', 'catalog');

const FRIDGE_IDS = new Set(['Wwqgatz', 'CUL8p92', 'N4lwIZD', 'wFVmKCn']);

function isFridgeUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const m = url.match(/imgur\.com\/([A-Za-z0-9]+)/);
  return m && FRIDGE_IDS.has(m[1]);
}

function slugFromUrl(url) {
  const m = url.match(/imgur\.com\/([A-Za-z0-9]+)/);
  return m ? m[1] : Buffer.from(url).toString('base64url').slice(0, 16);
}

function collectUrls() {
  const src = fs.readFileSync(catalogPath, 'utf8');
  const urls = new Map();
  const re = /https:\/\/i\.imgur\.com\/[A-Za-z0-9]+\.png/g;
  for (const url of src.match(re) || []) {
    if (!isFridgeUrl(url)) urls.set(url, slugFromUrl(url));
  }
  return { src, urls };
}

async function download(url) {
  const { stdout } = await execFileAsync(
    'curl',
    ['-sL', '--fail', url],
    { maxBuffer: 40 * 1024 * 1024 }
  );
  return stdout;
}

async function normalizeOne(url, slug) {
  const buf = await download(url);
  if (!buf?.length) throw new Error(`empty response ${url}`);

  let img = sharp(buf).flatten({ background: '#ffffff' });
  const meta = await img.metadata();
  const { data, info } = await img
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const bg = sampleBackground(data, info.width, info.height);
  const bounds = findContentBounds(data, info.width, info.height, bg);
  if (bounds) {
    img = sharp(buf).extract({
      left: bounds.left,
      top: bounds.top,
      width: bounds.width,
      height: bounds.height,
    });
  }

  const pad = 12;
  const outPath = path.join(outDir, `${slug}.png`);
  await img
    .flatten({ background: '#ffffff' })
    .trim({ background: { r: 255, g: 255, b: 255 }, threshold: 22 })
    .extend({
      top: pad,
      bottom: pad,
      left: pad,
      right: pad,
      background: '#ffffff',
    })
    .png({ compressionLevel: 9 })
    .toFile(outPath);

  return `/images/catalog/${slug}.png`;
}

function sampleBackground(data, w, h) {
  const pts = [
    [0, 0],
    [w - 1, 0],
    [0, h - 1],
    [w - 1, h - 1],
    [Math.floor(w / 2), 0],
    [Math.floor(w / 2), h - 1],
  ];
  let r = 0,
    g = 0,
    b = 0;
  for (const [x, y] of pts) {
    const i = (y * w + x) * 4;
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
  }
  const n = pts.length;
  return { r: Math.round(r / n), g: Math.round(g / n), b: Math.round(b / n) };
}

function isBgPixel(r, g, b, bg) {
  const dr = Math.abs(r - bg.r);
  const dg = Math.abs(g - bg.g);
  const db = Math.abs(b - bg.b);
  if (dr <= 24 && dg <= 24 && db <= 24) return true;
  if (r >= 238 && g >= 238 && b >= 238) return true;
  return false;
}

function findContentBounds(data, w, h, bg) {
  let minX = w,
    minY = h,
    maxX = 0,
    maxY = 0;
  let found = false;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const a = data[i + 3];
      if (a < 8) continue;
      const r = data[i],
        g = data[i + 1],
        b = data[i + 2];
      if (isBgPixel(r, g, b, bg)) continue;
      found = true;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }
  if (!found) return null;
  const margin = 2;
  minX = Math.max(0, minX - margin);
  minY = Math.max(0, minY - margin);
  maxX = Math.min(w - 1, maxX + margin);
  maxY = Math.min(h - 1, maxY + margin);
  return {
    left: minX,
    top: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const { src, urls } = collectUrls();
  const urlToLocal = new Map();
  const errors = [];

  console.log(`Processing ${urls.size} images (fridge excluded)...`);

  for (const [url, slug] of urls) {
    try {
      const local = await normalizeOne(url, slug);
      urlToLocal.set(url, local);
      console.log(`OK ${slug}`);
    } catch (e) {
      errors.push({ url, slug, error: e.message });
      console.error(`FAIL ${slug}: ${e.message}`);
    }
  }

  let next = src;
  for (const [url, local] of urlToLocal) {
    next = next.split(url).join(local);
  }
  fs.writeFileSync(catalogPath, next);

  const report = {
    total: urls.size,
    ok: urlToLocal.size,
    failed: errors,
    at: new Date().toISOString(),
  };
  fs.writeFileSync(
    path.join(outDir, '_normalize-report.json'),
    JSON.stringify(report, null, 2)
  );
  console.log(`Done: ${urlToLocal.size}/${urls.size} → ${catalogPath}`);
  if (errors.length) process.exitCode = 1;
}

main();
