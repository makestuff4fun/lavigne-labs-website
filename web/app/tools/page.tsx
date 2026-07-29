import type { Metadata } from "next";
import Link from "next/link";
import { Container, Eyebrow, ArrowIcon } from "@/components/ui";
import { tools } from "@/content/tools";

export const metadata: Metadata = {
  title: "Engineering Tools",
  description:
    "Free fastener calculators and reference sheets — dimensions, hole prep, holding force, and tightening torque for metric and inch screws.",
};

export default function ToolsPage() {
  return (
    <>
      <section className="border-b border-line bg-mist py-16 sm:py-20">
        <Container>
          <Eyebrow>Tools</Eyebrow>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            The bench references I use constantly.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate">
            Quick, no-nonsense calculators and lookup tables for everyday
            hardware work. Free to use — bookmark whatever saves you a search.
          </p>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2">
            {tools.map((tool) => {
              const cardClass =
                "group flex items-start justify-between gap-4 rounded-2xl border border-line bg-white p-7 shadow-card transition hover:border-accent/40";
              const body = (
                <>
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-wide text-accent">
                      {tool.kind}
                    </span>
                    <h2 className="mt-2 text-xl font-semibold tracking-tight group-hover:text-accent">
                      {tool.title}
                    </h2>
                    <p className="mt-2 leading-relaxed text-slate">
                      {tool.blurb}
                    </p>
                  </div>
                  <ArrowIcon className="mt-1 shrink-0 text-slate transition group-hover:translate-x-0.5 group-hover:text-accent" />
                </>
              );

              // Static tools (fastener sheets) are plain pages under public/;
              // they carry their own back-to-site bar, so open them in the same tab.
              return tool.href ? (
                <a key={tool.slug} href={tool.href} className={cardClass}>
                  {body}
                </a>
              ) : (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className={cardClass}
                >
                  {body}
                </Link>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
