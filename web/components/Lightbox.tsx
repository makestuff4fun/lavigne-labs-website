"use client";

import { useCallback, useEffect, useRef } from "react";

export type LightboxImage = { src: string; alt: string; width: number; height: number };

const FOCUSABLE = "button:not([disabled]), [href], [tabindex]:not([tabindex='-1'])";

const btn =
  "flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-30";

/**
 * Fullscreen image overlay. Controlled: the parent owns `index` and renders
 * this only while open. Esc closes, arrow keys navigate, Tab is trapped inside,
 * body scroll is locked and focus returns to the previously focused element.
 */
export function Lightbox({
  images,
  index,
  onIndexChange,
  onClose,
}: {
  images: LightboxImage[];
  index: number;
  onIndexChange: (i: number) => void;
  onClose: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);
  const last = images.length - 1;
  const go = useCallback(
    (d: number) => onIndexChange(Math.min(last, Math.max(0, index + d))),
    [index, last, onIndexChange],
  );

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    root.current?.querySelector<HTMLElement>("[data-lightbox-close]")?.focus();
    return () => {
      document.body.style.overflow = prev;
      opener?.focus?.();
    };
  }, []);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    } else if (e.key === "Tab") {
      const els = root.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!els || !els.length) return;
      const first = els[0];
      const lastEl = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  const img = images[index];
  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      data-lightbox
      onKeyDown={onKeyDown}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      }}
      className="fixed inset-0 z-[100] flex flex-col bg-black/95"
    >
      <div className="flex items-center justify-between px-4 py-3 text-white">
        <span className="font-mono text-sm tabular-nums" aria-live="polite">
          {index + 1} / {images.length}
        </span>
        <button type="button" data-lightbox-close aria-label="Close image viewer" onClick={onClose} className={btn}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-3 sm:px-16"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        {images.length > 1 && (
          <button type="button" aria-label="Previous image" disabled={index === 0} onClick={() => go(-1)} className={`${btn} absolute left-2 z-10 sm:left-4`}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
          </button>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={img.src}
          src={img.src}
          alt={img.alt}
          width={img.width}
          height={img.height}
          className="max-h-full max-w-full object-contain"
        />
        {images.length > 1 && (
          <button type="button" aria-label="Next image" disabled={index === last} onClick={() => go(1)} className={`${btn} absolute right-2 z-10 sm:right-4`}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7" /></svg>
          </button>
        )}
      </div>
      <p className="mx-auto max-w-3xl px-4 py-3 text-center text-xs leading-relaxed text-white/60 line-clamp-2">{img.alt}</p>
    </div>
  );
}
