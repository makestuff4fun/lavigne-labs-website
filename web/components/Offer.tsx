import { Container, Eyebrow } from "./ui";
import { offer } from "@/content/site";

export function Offer() {
  return (
    <section id="services" className="scroll-mt-20 py-20 sm:py-28">
      <Container>
        <div className="max-w-2xl">
          <Eyebrow>What you get</Eyebrow>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{offer.heading}</h2>
          <p className="mt-4 text-lg leading-relaxed text-slate">{offer.intro}</p>
        </div>

        <dl className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2">
          {offer.points.map((point) => (
            <div key={point.title} className="border-t-2 border-ink pt-5">
              <dt className="text-xl font-semibold tracking-tight">{point.title}</dt>
              <dd className="mt-2 leading-relaxed text-slate">{point.body}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-14 grid gap-8 rounded-2xl bg-mist p-7 sm:p-9 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h3 className="text-xl font-semibold tracking-tight">{offer.setup.title}</h3>
            <p className="mt-3 leading-relaxed text-slate">{offer.setup.body}</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold tracking-tight">What we cover</h3>
            <ul className="mt-3 grid gap-x-6 gap-y-1.5 text-slate sm:grid-cols-2 lg:grid-cols-1">
              {offer.coverage.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
