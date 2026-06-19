import Link from "next/link";
import type { Faq as FaqItem } from "@/content/faq";
import { Container, Eyebrow, ArrowIcon } from "./ui";

export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white shadow-card">
      {items.map((f) => (
        <details key={f.q} className="group p-6 sm:p-7 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
            <h3 className="font-semibold tracking-tight">{f.q}</h3>
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-mist text-slate transition group-open:rotate-45 group-open:bg-accent group-open:text-white">
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 4v12M4 10h12" strokeLinecap="round" />
              </svg>
            </span>
          </summary>
          <p className="mt-4 leading-relaxed text-slate">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function FaqSection({ items }: { items: FaqItem[] }) {
  return (
    <section className="bg-mist py-20 sm:py-28">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Eyebrow>Questions</Eyebrow>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              The things you&apos;re right to ask.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate">
              The honest answers to what every first-time hardware team worries
              about before they wire money overseas.
            </p>
            <Link
              href="/faq"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
            >
              See all questions <ArrowIcon />
            </Link>
          </div>
          <FaqList items={items} />
        </div>
      </Container>
    </section>
  );
}
