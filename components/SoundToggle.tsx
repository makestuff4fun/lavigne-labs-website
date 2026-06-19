"use client";

import { useEffect, useState } from "react";
import { sfx } from "@/lib/sfx";

export function SoundToggle({ className = "" }: { className?: string }) {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setMuted(sfx.isMuted());
    return sfx.subscribe(setMuted);
  }, []);

  return (
    <button
      type="button"
      aria-label={muted ? "Unmute sound" : "Mute sound"}
      aria-pressed={!muted}
      onClick={() => {
        sfx.unlock();
        sfx.toggle();
      }}
      className={`inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-2 text-xs font-semibold text-ink transition hover:border-accent hover:text-accent ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 9v6h3l5 4V5L7 9H4Z" strokeLinejoin="round" />
        {muted ? (
          <path d="M16 9l4 6M20 9l-4 6" strokeLinecap="round" />
        ) : (
          <path d="M16 8.5a4 4 0 0 1 0 7M18.5 6a7 7 0 0 1 0 12" strokeLinecap="round" />
        )}
      </svg>
      {muted ? "Sound off" : "Sound on"}
    </button>
  );
}
