"use client";

import { useEffect, useState } from "react";

type Rec = { id: string; type: string; title: string; url: string; text: string };

function extract(json: unknown): Rec[] {
  const j = json as { records?: Rec[]; data?: { records?: Rec[] } };
  if (Array.isArray(json)) return json as Rec[];
  return j.records ?? j.data?.records ?? [];
}

function snippet(text: string, words: string[]): string {
  const flat = text.replace(/\s+/g, " ").trim();
  const lower = flat.toLowerCase();
  const idx = words.map((w) => lower.indexOf(w)).filter((i) => i >= 0).sort((a, b) => a - b)[0] ?? 0;
  const start = Math.max(0, idx - 60);
  const end = Math.min(flat.length, idx + 140);
  return (start > 0 ? "…" : "") + flat.slice(start, end) + (end < flat.length ? "…" : "");
}

function search(records: Rec[], q: string) {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return { words, hits: [] as Rec[] };
  const scored: { r: Rec; score: number }[] = [];
  for (const r of records) {
    const title = (r.title ?? "").toLowerCase();
    const text = (r.text ?? "").toLowerCase();
    if (!words.every((w) => title.includes(w) || text.includes(w))) continue;
    scored.push({ r, score: words.filter((w) => title.includes(w)).length });
  }
  scored.sort((a, b) => b.score - a.score);
  return { words, hits: scored.map((s) => s.r) };
}

export function SearchBox() {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [records, setRecords] = useState<Rec[] | null>(null);
  const [error, setError] = useState(false);

  // Read ?q= after mount so the form itself is prerendered in the static export.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q") ?? "";
    setInput(q);
    setQuery(q.trim());
  }, []);

  useEffect(() => {
    fetch("/api/v1/search-index.json")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((j) => setRecords(extract(j)))
      .catch(() => setError(true));
  }, []);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = input.trim();
    setQuery(q);
    const url = q ? `?q=${encodeURIComponent(q)}` : window.location.pathname;
    window.history.replaceState(null, "", url);
  }

  const { words, hits } = records ? search(records, query) : { words: [], hits: [] };

  return (
    <div>
      <form onSubmit={onSubmit} role="search" className="flex gap-3">
        <input
          type="search"
          name="q"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search articles, FAQ, services, work…"
          aria-label="Search the site"
          className="w-full rounded-lg border border-line bg-white px-4 py-3 text-base"
        />
        <button type="submit" className="rounded-lg bg-ink px-5 py-3 font-semibold text-white">
          Search
        </button>
      </form>
      <div className="mt-8" aria-live="polite">
        {error && <p className="text-slate">Couldn&apos;t load the search index. Please try again later.</p>}
        {!error && !records && <p className="text-slate">Loading…</p>}
        {records && query && (
          <p className="text-sm text-slate">
            {hits.length} result{hits.length === 1 ? "" : "s"} for &ldquo;{query}&rdquo;
          </p>
        )}
        <ul className="mt-4 space-y-6">
          {hits.map((r) => (
            <li key={r.id}>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate">{r.type}</p>
              <a href={r.url} className="text-lg font-semibold underline-offset-2 hover:underline">
                {r.title}
              </a>
              <p className="mt-1 text-slate">{snippet(r.text ?? "", words)}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
