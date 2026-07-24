import { Container, Eyebrow } from "./ui";
import { process } from "@/content/site";

export function Process() {
  return (
    <section id="process" className="scroll-mt-20 bg-ink py-20 text-white sm:py-28">
      <Container>
        <div className="max-w-2xl">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            A clear path from idea to production.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/65">
            Every engagement de-risks the next step before you commit to it —
            no leaps of faith, no surprises.
          </p>
        </div>

        <ol className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {process.map((item, i) => (
            <li key={item.step} className="relative">
              <div className="flex items-center gap-3">
                <span className="font-mono text-3xl font-bold text-accent-300">
                  {item.step}
                </span>
                {i < process.length - 1 && (
                  <span className="hidden h-px flex-1 bg-white/15 lg:block" aria-hidden="true" />
                )}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                {item.body}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
