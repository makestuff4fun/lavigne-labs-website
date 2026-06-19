import { Container, Eyebrow } from "./ui";
import { engagement } from "@/content/site";

export function HowIWork() {
  return (
    <section id="how-i-work" className="scroll-mt-20 py-20 sm:py-28">
      <Container>
        <div className="max-w-2xl">
          <Eyebrow>How I work</Eyebrow>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Open books. One loyalty.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate">{engagement.intro}</p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {engagement.models.map((model) => (
            <div
              key={model.name}
              className="rounded-2xl border border-line bg-white p-7 shadow-card"
            >
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold tracking-tight">{model.name}</h3>
                <span className="rounded-full bg-accent/10 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide text-accent">
                  {model.tag}
                </span>
              </div>
              <p className="mt-3 leading-relaxed text-slate">{model.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-start gap-4 rounded-2xl bg-ink p-7 text-white">
          <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent/20 text-accent-300">
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M10 2.5l6 2.5v4c0 4-2.7 6.5-6 7.5-3.3-1-6-3.5-6-7.5V5l6-2.5Z" strokeLinejoin="round" />
              <path d="m7.5 10 1.7 1.7L13 8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div>
            <h3 className="text-lg font-semibold">{engagement.loyalty.title}</h3>
            <p className="mt-2 leading-relaxed text-white/70">{engagement.loyalty.body}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
