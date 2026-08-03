import type { Metadata } from "next";
import { Container, Eyebrow, ArrowIcon } from "@/components/ui";
import { toolCategories, toolsInCategory, type Tool } from "@/content/tools";

export const metadata: Metadata = {
  title: "Engineering Tools",
  description:
    "Free bench calculators and reference sheets — fastener dimensions, holding force, and tightening torque plus PCB and circuit math.",
};

function ToolCard({ tool }: { tool: Tool }) {
  const cardClass =
    "group flex items-start justify-between gap-4 rounded-2xl border border-line bg-white p-7 shadow-card transition hover:border-accent/40";
  const body = (
    <>
      <div>
        <span className="font-mono text-[11px] uppercase tracking-wide text-accent">
          {tool.kind}
        </span>
        <h3 className="mt-2 text-xl font-semibold tracking-tight group-hover:text-accent">
          {tool.title}
        </h3>
        <p className="mt-2 leading-relaxed text-slate">{tool.blurb}</p>
      </div>
      <ArrowIcon className="mt-1 shrink-0 text-slate transition group-hover:translate-x-0.5 group-hover:text-accent" />
    </>
  );

  // Every current tool is a standalone page under public/ (it carries its own
  // back-to-site bar), so link with a plain <a> in the same tab.
  return (
    <a href={tool.href} className={cardClass}>
      {body}
    </a>
  );
}

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
            hardware work, grouped by job. Free to use — bookmark whatever saves
            you a search.
          </p>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="space-y-16">
            {toolCategories.map((category) => {
              const categoryTools = toolsInCategory(category.name);
              if (categoryTools.length === 0) return null;
              return (
                <div key={category.name}>
                  <div className="max-w-2xl">
                    <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                      {category.name}
                    </h2>
                    <p className="mt-2 leading-relaxed text-slate">
                      {category.blurb}
                    </p>
                  </div>
                  <div className="mt-7 grid gap-6 sm:grid-cols-2">
                    {categoryTools.map((tool) => (
                      <ToolCard key={tool.slug} tool={tool} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
