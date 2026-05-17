/** 평면도·옵션 비교 이미지 — 외곽 여백 trim + #fff 패딩 (냉장고 URL 제외) */

const FRIDGE_IMGUR_IDS = new Set(['Wwqgatz', 'CUL8p92', 'N4lwIZD', 'wFVmKCn']);
const PAD = 12;
const cache = new Map();

export function isFridgeCatalogImage(src) {
  if (!src || typeof src !== 'string') return false;
  const m = src.match(/imgur\.com\/([A-Za-z0-9]+)/);
  return !!(m && FRIDGE_IMGUR_IDS.has(m[1]));
}

export function getProcessedCatalogImage(src) {
  if (!src || isFridgeCatalogImage(src)) return Promise.resolve(src);
  if (cache.has(src)) return Promise.resolve(cache.get(src));

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.onload = () => {
      try {
        const out = trimToWhiteCanvas(img);
        cache.set(src, out);
        resolve(out);
      } catch {
        cache.set(src, src);
        resolve(src);
      }
    };
    img.onerror = () => {
      cache.set(src, src);
      resolve(src);
    };
    img.src = src;
  });
}

function sampleBackground(data, w, h) {
  const pts = [
    [0, 0],
    [w - 1, 0],
    [0, h - 1],
    [w - 1, h - 1],
    [Math.floor(w / 2), 0],
    [Math.floor(w / 2), h - 1],
    [0, Math.floor(h / 2)],
    [w - 1, Math.floor(h / 2)],
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
  if (Math.abs(r - bg.r) <= 24 && Math.abs(g - bg.g) <= 24 && Math.abs(b - bg.b) <= 24) return true;
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
      if (data[i + 3] < 8) continue;
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
  const m = 2;
  return {
    left: Math.max(0, minX - m),
    top: Math.max(0, minY - m),
    width: Math.min(w, maxX + m + 1) - Math.max(0, minX - m),
    height: Math.min(h, maxY + m + 1) - Math.max(0, minY - m),
  };
}

function trimToWhiteCanvas(img) {
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  if (!w || !h) return img.src;

  const srcCanvas = document.createElement('canvas');
  srcCanvas.width = w;
  srcCanvas.height = h;
  const sctx = srcCanvas.getContext('2d', { willReadFrequently: true });
  sctx.drawImage(img, 0, 0);
  const full = sctx.getImageData(0, 0, w, h);
  const bg = sampleBackground(full.data, w, h);
  const bounds = findContentBounds(full.data, w, h, bg);
  if (!bounds || (bounds.width >= w - 4 && bounds.height >= h - 4)) {
    return flattenWhiteBorder(img, w, h);
  }

  const outW = bounds.width + PAD * 2;
  const outH = bounds.height + PAD * 2;
  const out = document.createElement('canvas');
  out.width = outW;
  out.height = outH;
  const octx = out.getContext('2d');
  octx.fillStyle = '#ffffff';
  octx.fillRect(0, 0, outW, outH);
  octx.drawImage(img, bounds.left, bounds.top, bounds.width, bounds.height, PAD, PAD, bounds.width, bounds.height);
  return out.toDataURL('image/png');
}

/** trim 여지가 없을 때도 배경만 흰 카드에 맞춤 */
function flattenWhiteBorder(img, w, h) {
  const out = document.createElement('canvas');
  out.width = w;
  out.height = h;
  const ctx = out.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0);
  return out.toDataURL('image/png');
}
