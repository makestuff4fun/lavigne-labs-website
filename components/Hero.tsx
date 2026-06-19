import Image from "next/image";
import { Button, Container, ArrowIcon } from "./ui";
import { credibility, site } from "@/content/site";

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
              For funded hardware teams · US &amp; Canada
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Manufacture in China without the{" "}
              <span className="text-accent-300">costly mistakes.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
              You&apos;ve got a working prototype or the funding to build one.
              I&apos;m {site.founder} — an engineer who&apos;s spent 13+ years in
              China turning designs into shipped products. Work with me and the
              person who lays out your board is the same person standing on your
              factory floor. No agency, no account managers, no telephone game.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button href="/contact">
                Tell me about your product <ArrowIcon />
              </Button>
              <Button href="/work" variant="ghost">
                See the work
              </Button>
            </div>
            <p className="mt-7 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-white/55">
              <span className="font-medium text-white/80">Open-book pricing</span>
              <span className="text-white/30">·</span>
              <span className="font-medium text-white/80">aligned incentives</span>
              <span className="text-white/30">·</span>
              <span className="font-medium text-white/80">your IP &amp; tooling stay yours</span>
            </p>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-white/15 shadow-card">
              <Image
                src="/brand/office.jpg"
                alt="The Lavigne Labs workshop in China"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -left-5 hidden rounded-xl bg-white px-5 py-4 text-ink shadow-card sm:block">
              <p className="font-mono text-2xl font-bold">13+ yrs</p>
              <p className="text-xs text-slate">on the factory floor</p>
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
