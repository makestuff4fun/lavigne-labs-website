import type { Metadata } from "next";
import Link from "next/link";
import { Container, ArrowIcon } from "@/components/ui";
import Shiverwing from "@/components/games/Shiverwing";
import { SoundToggle } from "@/components/SoundToggle";

export const metadata: Metadata = {
  title: "Shiverwing",
  description:
    "Play Shiverwing — the Flappy-Bird game from Brian's ESP32 hardware badge, ported pixel-for-pixel to the browser. Real sprites, physics, fonts, and screens.",
};

export default function ShiverwingPage() {
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
          <p className="eyebrow">Arcade · ESP32 badge</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Shiverwing</h1>
          <p className="mx-auto mt-3 max-w-xl text-slate">
            The Flappy-Bird game I built into a hardware badge — driving an
            8080-interface LCD at 60fps. This is a pixel-for-pixel browser port:
            the real sprites, fonts, physics, and screens, pulled straight from
            the firmware.
          </p>
        </div>

        <div className="mt-8">
          <Shiverwing />
        </div>

        <div className="mt-5 flex justify-center">
          <SoundToggle />
        </div>

        <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-line bg-mist p-6 text-center text-sm text-slate">
          Curious how it&apos;s built? The badge bring-up — driving that LCD at
          60fps — is the kind of hands-on work I bring to client hardware.{" "}
          <a
            href="https://lavignelabs.com/2024/11/08/digital-badge-pcb-layout/"
            className="font-semibold text-accent hover:underline"
          >
            Read the article
          </a>{" "}
          or{" "}
          <Link href="/contact" className="font-semibold text-accent hover:underline">
            start a project
          </Link>
          .
        </div>
      </Container>
    </section>
  );
}
