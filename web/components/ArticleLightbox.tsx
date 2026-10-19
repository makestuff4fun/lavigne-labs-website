"use client";

import { useEffect, useState } from "react";
import { Lightbox, type LightboxImage } from "./Lightbox";

const SELECTOR = "[data-figure] img";

function collect(): LightboxImage[] {
  return Array.from(document.querySelectorAll<HTMLImageElement>(SELECTOR)).map((el) => ({
    src: el.currentSrc || el.src,
    alt: el.alt,
    width: el.naturalWidth || el.width,
    height: el.naturalHeight || el.height,
  }));
}

/** Opens the shared Lightbox when any article figure image is clicked (event delegation; the figures are static Markdown HTML). */
export function ArticleLightbox() {
  const [images, setImages] = useState<LightboxImage[]>([]);
  const [index, setIndex] = useState<number | null>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const img = (e.target as Element | null)?.closest?.(SELECTOR) as HTMLImageElement | null;
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
