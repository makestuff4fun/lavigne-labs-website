import { Container, Eyebrow } from "./ui";
import { services } from "@/content/site";

export function Services() {
  return (
    <section id="services" className="scroll-mt-20 py-20 sm:py-28">
      <Container>
        <div className="max-w-2xl">
          <Eyebrow>What I do</Eyebrow>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            One partner from schematic to shipping container.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate">
            Engineering and manufacturing under one roof — so your design,
            prototype, and production all speak to each other.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {services.map((service, i) => (
            <div
              key={service.id}
              className="flex flex-col rounded-2xl border border-line bg-white p-7 shadow-card transition hover:border-accent/40"
            >
              <span className="font-mono text-sm text-accent">
                0{i + 1}
              </span>
              <h3 className="mt-3 text-xl font-semibold tracking-tight">
                {service.title}
              </h3>
              <p className="mt-3 leading-relaxed text-slate">
                {service.summary}
              </p>
              <ul className="mt-6 space-y-2.5 border-t border-line pt-6 text-sm">
                {service.points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-ink">
                    <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0 text-accent" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m4 10.5 4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
