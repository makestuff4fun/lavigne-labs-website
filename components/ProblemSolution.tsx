import { Container, Eyebrow } from "./ui";
import { problems } from "@/content/site";

export function ProblemSolution() {
  return (
    <section className="bg-mist py-20 sm:py-28">
      <Container>
        <div className="max-w-2xl">
          <Eyebrow>The stakes</Eyebrow>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Manufacturing in China can save you — or sink you.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate">
            A wrong move on the other side of the world is expensive and slow to
            fix. The four mistakes that cost hardware teams the most — and how I
            take them off the table.
          </p>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-line shadow-card sm:grid-cols-2">
          {problems.map((item) => (
            <div key={item.risk} className="bg-white p-7">
              <div className="flex items-center gap-2.5 text-ink">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-red-50 text-red-500">
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 6v5m0 3h.01M10 2.5 1.8 16.5h16.4L10 2.5Z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <h3 className="font-semibold">{item.risk}</h3>
              </div>
              <div className="mt-4 flex gap-2.5 text-slate">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent/10 text-accent">
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m4 10.5 4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <p className="leading-relaxed">{item.fix}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
