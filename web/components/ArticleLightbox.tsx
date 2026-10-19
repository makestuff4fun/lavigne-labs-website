"use client";

import { useEffect, useState } from "react";
import { Lightbox, type LightboxImage } from "./Lightbox";

const SELECTOR = "[data-figure] img, [data-diagram] svg";

function toImage(el: Element): LightboxImage {
  if (el instanceof SVGSVGElement) {
    const vb = el.viewBox.baseVal;
    const xml = new XMLSerializer().serializeToString(el);
    return {
      src: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`,
      alt: el.getAttribute("aria-label") ?? "",
      width: vb.width,
      height: vb.height,
    };
  }
  const img = el as HTMLImageElement;
  return { src: img.currentSrc || img.src, alt: img.alt, width: img.naturalWidth || img.width, height: img.naturalHeight || img.height };
}

function collect(): LightboxImage[] {
  return Array.from(document.querySelectorAll(SELECTOR)).map(toImage);
}

/** Opens the shared Lightbox when any article figure image is clicked (event delegation; the figures are static Markdown HTML). */
export function ArticleLightbox() {
  const [images, setImages] = useState<LightboxImage[]>([]);
  const [index, setIndex] = useState<number | null>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const img = (e.target as Element | null)?.closest?.(SELECTOR) as Element | null;
      if (!img) return;
      const all = Array.from(document.querySelectorAll(SELECTOR));
      setImages(collect());
      setIndex(all.indexOf(img));
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  if (index === null || !images[index]) return null;
  return <Lightbox images={images} index={index} onIndexChange={setIndex} onClose={() => setIndex(null)} />;
}
