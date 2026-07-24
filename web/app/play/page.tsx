import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container, Eyebrow, ArrowIcon } from "@/components/ui";

export const metadata: Metadata = {
  title: "Play",
  description:
    "Browser versions of my side projects — Shiverwing, the Flappy-Bird game from my ESP32 badge, and a Sokoban puzzle. Because people are people.",
};

const games = [
  {
    slug: "shiverwing",
    title: "Shiverwing",
    tag: "Arcade",
    image: "/games/shiverwing/preview.png",
    blurb:
      "The Flappy-Bird game I built into an ESP32 hardware badge — driving an 8080-interface LCD at 60fps. The real thing, ported pixel-for-pixel to your browser.",
  },
  {
    slug: "freezing-fortress",
    title: "Freezing Fortress",
    tag: "Puzzle · LED",
    image: "/games/ff-preview.png",
    blurb:
      "My 14×10 addressable-LED Sokoban, featuring Shiverwing. Push every ice cube into a fire pit. The real LED colours and animations, with 100 of the original levels.",
  },
];

export default function PlayPage() {
  return (
    <>
      <section className="border-b border-line bg-mist py-16 sm:py-20">
        <Container>
          <Eyebrow>Play</Eyebrow>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            My side projects, in your browser.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate">
            I build little games for fun — the same curiosity I bring to clients&apos;
            hardware. Here are two you can play right now. No downloads, no sign-up.
          </p>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-8 sm:grid-cols-2">
            {games.map((game) => (
              <Link
                key={game.slug}
                href={`/play/${game.slug}`}
                className="group overflow-hidden rounded-2xl border border-line bg-white shadow-card transition hover:border-accent/40"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-ink">
                  <Image
                    src={game.image}
                    alt={game.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-contain p-4 transition group-hover:scale-[1.03]"
                    style={{ imageRendering: "pixelated" }}
                  />
                </div>
                <div className="p-7">
                  <span className="font-mono text-[11px] uppercase tracking-wide text-accent">
                    {game.tag}
                  </span>
                  <h2 className="mt-2 text-xl font-semibold tracking-tight group-hover:text-accent">
                    {game.title}
                  </h2>
                  <p className="mt-2 leading-relaxed text-slate">{game.blurb}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                    Play <ArrowIcon className="transition group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
