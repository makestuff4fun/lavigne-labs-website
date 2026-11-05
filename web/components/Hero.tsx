import Image from "next/image";
import { Button, Container, ArrowIcon } from "./ui";
import { credibility, site, yearsInChina } from "@/content/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <div className="absolute inset-0 grid-texture opacity-70" aria-hidden="true" />
      <div
        className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-accent/20 blur-3xl"
        aria-hidden="true"
      />
      <Container className="relative py-20 sm:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="eyebrow text-accent-300">
              Hardware development and manufacturing · Shenzhen
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Get your hardware made, without the costly mistakes.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
              You bring the product. We handle the rest: engineering partners,
              prototypes, factories, quality and shipping. You work
              directly with {site.founder}, {yearsInChina} years making products in
              China, and you can talk to every team and factory building your
              product.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button href="/contact/">
                Start a project <ArrowIcon />
              </Button>
              <Button href="/#how-we-work" variant="ghost">
                How we work
              </Button>
            </div>
            <p className="mt-7 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-white/55">
              <span className="font-medium text-white/80">
                Camera and sensor devices are our specialty.
              </span>
            </p>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-white/15 shadow-card">
              <Image
                src="/brand/office.jpg"
                alt="The Lavigne Labs hardware workshop in Shenzhen"
                width={1200}
                height={900}
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -left-5 hidden rounded-xl bg-white px-5 py-4 text-ink shadow-card sm:block">
              <p className="font-mono text-2xl font-bold">Shenzhen</p>
              <p className="text-xs text-slate">on the ground, next to the factories</p>
            </div>
          </div>
        </div>

        <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-white/10 pt-10 lg:grid-cols-3">
          {credibility.map((item) => (
            <div key={item.label}>
              <dt className="font-mono text-2xl font-bold text-white sm:text-3xl">
                {item.value}
              </dt>
              <dd className="mt-1 text-sm text-white/60">{item.label}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
