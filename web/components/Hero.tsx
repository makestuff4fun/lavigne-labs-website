import Image from "next/image";
import { Button, Container, ArrowIcon } from "./ui";
import { credibility, site, mailtoHref } from "@/content/site";

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
              Hardware product development · Shenzhen
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              We design hardware, and{" "}
              <span className="text-accent-300">get it built.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
              {site.name} is a Shenzhen hardware product-development team, ready to
              help you. We move fast: prototype sprints, development to
              production, and production support, led by {site.founder}, who
              puts his reputation on the results.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button href={mailtoHref}>
                Get in touch <ArrowIcon />
              </Button>
              <Button href="/work" variant="ghost">
                See the work
              </Button>
            </div>
            <p className="mt-7 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-white/55">
              <span className="font-medium text-white/80">PCB &amp; product design</span>
              <span className="text-white/30">·</span>
              <span className="font-medium text-white/80">rapid prototyping</span>
              <span className="text-white/30">·</span>
              <span className="font-medium text-white/80">production in Shenzhen</span>
            </p>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-white/15 shadow-card">
              <Image
                src="/brand/office.jpg"
                alt="The Lavigne Labs hardware workshop in Shenzhen"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -left-5 hidden rounded-xl bg-white px-5 py-4 text-ink shadow-card sm:block">
              <p className="font-mono text-2xl font-bold">13+ yrs</p>
              <p className="text-xs text-slate">founder on the factory floor</p>
            </div>
          </div>
        </div>

        <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-white/10 pt-10 lg:grid-cols-4">
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
