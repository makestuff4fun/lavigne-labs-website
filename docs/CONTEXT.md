# Project context & handoff

_Living status doc — read this first to pick up where we left off. Update it as
things change._

## What this is

The Lavigne Labs website (Next.js 16 / Tailwind v4) **plus** two faithful browser
ports of Brian's hardware side-projects (Shiverwing, Freezing Fortress). The
**business**: Brian Barrett helps **US & Canadian hardware teams manufacture in
China without the costly mistakes** — taking prototypes/funded ideas to
production, vetting factories, QC on the ground (13+ yrs in China; ran a
Black & Decker LED factory; two EV startups).

- **Repo:** `git@github.com:makestuff4fun/lavigne-labs-website.git`
- **Production:** `lavignelabs.com` (currently **WordPress** on cPanel/FTP,
  Let's Encrypt SSL). Contact: `hello@lavignelabs.com`, WeChat `briantb`.

## Status by workstream

| Area | State |
|---|---|
| **Next.js site** (home, work, articles, tools, faq, contact, lab, play) | Built, in repo. Home is the new positioning overhaul. **Not deployed yet.** |
| **Games** (Shiverwing, Freezing Fortress) | Done, in repo. Faithful ports; synth SFX + mute toggle wired. |
| **Game sounds** | **Synth placeholders.** Real WAVs pending — Brian's cousin has the original files (away on vacation). Swap-in is one call (`sfx.useSamples`, see docs/SOUNDS.md). The WT588F `.bin` decode was abandoned (the chip tool obfuscates the audio; a known-plaintext probe confirmed it). |
| **Static WordPress freeze** | Done **locally**, **not in the repo** (it's a 168 MB deploy artifact). Made with **Simply Static**, trimmed 825 MB→168 MB (unreferenced media removed), and the "Our Projects" grid rebuilt as a plain static grid (the theme's AJAX infinite-scroll can't work statically). Regenerate via docs/DEPLOYMENT.md. |
| **Deployment** | **Not live yet.** Plan below. |

## Deployment plan (current decision)

Freeze the existing WordPress design to static + bolt on the games, served from
`lavignelabs.com` (no subdomain needed — existing SSL covers paths).

1. **Games** → extract `lavigne-games-folder.zip` into **`public_html`** root →
   games at `lavignelabs.com/play`. (Must be at root: bundle uses `/_next`,
   `/games` absolute paths.)
2. **Frozen site** → back up WordPress first, then extract the freeze ZIP into
   `public_html`.
3. **Contact form** → static has no PHP; point it at Formspree/Web3Forms or a
   `mailto:`. **(Still open.)**

Run `npm run export` to regenerate the game bundles. See **docs/DEPLOYMENT.md**.

## Key positioning decisions (reflected in the site copy)

- **Target:** funded startups & SMEs, **post-prototype** (have a working
  prototype/funding, need to ship).
- **Wedge:** a named senior engineer, **no handoffs** ("the person who lays out
  your board is on your factory floor"), authentically lives in China 13+ yrs.
- **Fee model (get this right):** commission isn't a dirty word — hidden markups
  and split loyalties are. Two open models: **Open-BOM + flat 10% management
  fee** (default) or **finished product at an honest margin**. When hired to
  design/represent a client he declines supplier finder's fees. Do **not** frame
  as naive "no commissions."
- **Proof:** real stories, **no fabricated numbers**.
- **Visuals:** clean/technical; showcase products as proof of *his* contribution.

## Open / next steps (rough priority)

1. **Contact form** → wire to a form service before go-live.
2. **Go-live swap** — WordPress → static at `public_html` (+ games at root), with
   a backup so it's reversible.
3. **Swap real game SFX** when the cousin's WAVs arrive (docs/SOUNDS.md).
4. **Review portfolio descriptions** — 8 items in the static grid have *inferred*
   blurbs flagged for Brian to verify (Smart Fire Alarm, Teleprompter, Special
   Action Camera, Custom Motorcycle Parts, Dog Backpack, Oculus Earphones,
   Passport Case, Under Cabinet Lighting).
5. **Optional later:** launch the *new* Next.js overhaul (better than the frozen
   old design) instead of/after the freeze.

## Things that live OUTSIDE the repo (and how to regenerate)

- **Deploy artifacts** (`out/`, `dist-games/`, `lavigne-games*.zip`,
  `lavigne-labs-static*.zip`) are git-ignored → `npm run export` (games) /
  Simply Static (freeze).
- **The frozen WP static site** isn't committed (too large). Regenerate per
  docs/DEPLOYMENT.md.
- **Original hardware assets** (firmware sprites, LED colour tables, levels,
  bezel art) were extracted from Brian's project files on the original PC's
  `D:` drive. The **outputs** are committed (`public/games/`,
  `components/games/ffData.ts`), so you don't need the firmware to build/run.

## How to resume (any machine)

```bash
git clone git@github.com:makestuff4fun/lavigne-labs-website.git
cd lavigne-labs-website
npm install
npm run dev      # http://localhost:3000
npm run export   # rebuild deployable game bundles when needed
```

Then see **docs/DEPLOYMENT.md** to continue the rollout.
