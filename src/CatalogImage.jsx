import React, { useEffect, useState } from 'react';
import { getProcessedCatalogImage, isFridgeCatalogImage } from './catalogImage.js';

export function CatalogImage({ src, alt = '', className, style }) {
  const [displaySrc, setDisplaySrc] = useState(src);

  useEffect(() => {
    if (!src) {
      setDisplaySrc(src);
      return;
    }
    if (isFridgeCatalogImage(src)) {
      setDisplaySrc(src);
      return;
    }
    let cancelled = false;
    setDisplaySrc(src);
    getProcessedCatalogImage(src).then((next) => {
      if (!cancelled && next) setDisplaySrc(next);
    });
    return () => {
      cancelled = true;
    };
  }, [src]);

  if (!src) return null;
  return <img src={displaySrc} alt={alt} className={className} style={style} decoding="async" />;
}
