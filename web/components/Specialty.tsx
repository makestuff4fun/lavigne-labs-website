import { Container, Eyebrow } from "./ui";
import { specialty } from "@/content/site";

export function Specialty() {
  return (
    <section id="cameras" className="scroll-mt-20 bg-mist py-20 sm:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <Eyebrow>Specialty</Eyebrow>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{specialty.heading}</h2>
            <div className="mt-5 space-y-4 text-lg leading-relaxed text-slate">
              {specialty.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
          <ul className="space-y-3 self-end border-l-2 border-ink pl-6 text-ink">
            {specialty.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
