"use client";

import { useEffect, useRef, useState } from "react";
import { Lightbox, type LightboxImage } from "./Lightbox";

const arrow =
  "absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-card ring-1 ring-line transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-0";

/**
 * Carousel: fixed-aspect stage (object-contain, no layout shift), thumbnail
 * strip, arrows, swipe, arrow-key navigation and a lightbox on click/tap.
 */
export function ImageViewer({ images, label }: { images: LightboxImage[]; label: string }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const strip = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; id: number } | null>(null);
  const swiped = useRef(false);
  const last = images.length - 1;
  const go = (i: number) => setIndex(Math.min(last, Math.max(0, i)));

  const [fade, setFade] = useState({ l: false, r: false });
  const measure = () => {
    const b = strip.current;
    if (b) setFade({ l: b.scrollLeft > 4, r: b.scrollLeft + b.clientWidth < b.scrollWidth - 4 });
  };
  useEffect(measure, [images.length]);

  // keep the active thumbnail visible without scrolling the page
  useEffect(() => {
    const el = strip.current?.children[index] as HTMLElement | undefined;
    const box = strip.current;
    if (el && box) box.scrollTo({ left: el.offsetLeft - (box.clientWidth - el.clientWidth) / 2, behavior: "smooth" });
  }, [index]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft") { e.preventDefault(); go(index - 1); }
    else if (e.key === "ArrowRight") { e.preventDefault(); go(index + 1); }
  }

  return (
    <div
      data-viewer
      role="region"
      aria-roledescription="carousel"
      aria-label={`${label} images`}
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
    >
      <div
        className="relative aspect-[4/3] w-full touch-pan-y select-none overflow-hidden rounded-xl border border-line bg-mist"
        onPointerDown={(e) => { drag.current = { x: e.clientX, id: e.pointerId }; swiped.current = false; }}
        onPointerUp={(e) => {
          const d = drag.current;
          drag.current = null;
          if (!d || images.length < 2) return;
          const dx = e.clientX - d.x;
          if (Math.abs(dx) > 40) { swiped.current = true; go(index + (dx < 0 ? 1 : -1)); }
        }}
        onPointerCancel={() => (drag.current = null)}
      >
        {images.map((g, i) => (
          <div
            key={g.src}
            data-slide
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${images.length}`}
            aria-hidden={i !== index}
            className={`absolute inset-0 p-3 transition-opacity sm:p-4 duration-300 ${i === index ? "opacity-100" : "pointer-events-none opacity-0"}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={g.src}
              alt={g.alt}
              width={g.width}
              height={g.height}
              loading={i === 0 ? undefined : "lazy"}
              decoding="async"
              draggable={false}
              onClick={() => { if (!swiped.current) setOpen(true); }}
              className="h-full w-full cursor-zoom-in object-contain"
            />
          </div>
        ))}
        {images.length > 1 && (
          <>
            <button type="button" aria-label="Previous image" disabled={index === 0} onClick={() => go(index - 1)} className={`${arrow} left-3`}>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
            </button>
            <button type="button" aria-label="Next image" disabled={index === last} onClick={() => go(index + 1)} className={`${arrow} right-3`}>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7" /></svg>
            </button>
          </>
        )}
        <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-ink/70 px-2.5 py-1 font-mono text-xs tabular-nums text-white" aria-live="polite">
          {index + 1} / {images.length}
        </span>
      </div>

      {images.length > 1 && (
        <div className="relative mt-3">
        <div ref={strip} onScroll={measure} className="thumb-strip flex gap-2 overflow-x-auto" role="group" aria-label="Thumbnails">
          {images.map((g, i) => (
            <button
              key={g.src}
              type="button"
              aria-label={`Show image ${i + 1} of ${images.length}`}
              aria-current={i === index}
              onClick={() => go(i)}
              className={`relative aspect-[4/3] w-[4.5rem] flex-none snap-start overflow-hidden rounded-lg border bg-mist transition sm:w-[calc((100%-2.5rem)/6)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${i === index ? "border-accent ring-2 ring-accent" : "border-line opacity-70 hover:opacity-100"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g.src} alt="" width={g.width} height={g.height} loading="lazy" decoding="async" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
        {fade.l && <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent" />}
        {fade.r && <span aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent" />}
        </div>
      )}

      {open && <Lightbox images={images} index={index} onIndexChange={go} onClose={() => setOpen(false)} />}
    </div>
  );
}
