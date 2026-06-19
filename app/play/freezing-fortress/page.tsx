import type { Metadata } from "next";
import Link from "next/link";
import { Container, ArrowIcon } from "@/components/ui";
import FreezingFortress from "@/components/games/FreezingFortress";
import { SoundToggle } from "@/components/SoundToggle";

export const metadata: Metadata = {
  title: "Freezing Fortress",
  description:
    "Play Freezing Fortress featuring Shiverwing — Brian's 14×10 addressable-LED Sokoban. Push every ice cube into a fire pit. Real colours, fire-flicker, and cube-melt from the firmware.",
};

export default function FreezingFortressPage() {
  return (
    <section className="py-8 sm:py-12">
      <Container>
        <Link
          href="/play"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate transition hover:text-ink"
        >
          <ArrowIcon className="rotate-180" /> All games
        </Link>

        <div className="mt-5 text-center">
          <p className="eyebrow">Puzzle · LED matrix</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Freezing Fortress
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-slate">
            A hardware puzzle game I built on a 14×10 grid of addressable LEDs —
            Shiverwing shoves ice cubes into fire pits to freeze the fortress.
            This browser version is a generic Sokoban engine fed the real levels,
            rendered with the exact LED colours, fire-flicker, and cube-melt
            pulled straight from the firmware.
          </p>
        </div>

        <div className="mt-8">
          <FreezingFortress />
        </div>

        <div className="mt-5 flex justify-center">
          <SoundToggle />
        </div>

        <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-line bg-mist p-6 text-center text-sm text-slate">
          The hardware — a custom LED matrix, controller, and D-pad PCBs, plus
          500 hand-tuned levels — is the same end-to-end product work I do for
          clients.{" "}
          <Link href="/contact" className="font-semibold text-accent hover:underline">
            Start a project
          </Link>
          .
        </div>
      </Container>
    </section>
  );
}
