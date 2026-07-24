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
- **Repo layout:** `web/` = the Next.js site (run npm there; all `app/…`,
  `content/…`, `public/…` paths in these docs are relative to `web/`) ·
  `docs/` = these docs · `fasteners/` + `pcb/` = standalone HTML calculators
  built for the site but **not yet wired into `/tools`** (see their READMEs).
- **Production:** `lavignelabs.com` — **LIVE with this Next.js site** (static
  export on cPanel/FTP, Let's Encrypt SSL), games at `/play`. The old WordPress
  site has been replaced. Contact: `hello@lavignelabs.com`, WeChat `briantb`.

## Status by workstream

| Area | State |
|---|---|
| **Next.js site** (home, work, articles, tools, faq, contact, lab, play) | Built, in `web/`, and **LIVE at lavignelabs.com** as a static export. Home is the new positioning overhaul. |
| **Games** (Shiverwing, Freezing Fortress) | Done, in repo. Faithful ports; synth SFX + mute toggle wired. |
| **Game sounds** | **Real device SFX wired** (recovered WT588F recordings → `public/games/sfx/*.mp3`, registered via `sfx.useSamples` in each game). Synth voices remain as fallback. `score` (pipe-pass) uses `bell` as a chosen cue — badge was silent there. See docs/SOUNDS.md. |
| **Static WordPress freeze** | **Superseded** — the Next.js site went live instead of the freeze. The freeze work (Simply Static, trimmed 825 MB→168 MB, static "Our Projects" grid) still exists locally / regenerable per docs/DEPLOYMENT.md, but is no longer the deploy path. |
| **Deployment** | **LIVE.** `lavignelabs.com` serves the Next.js static export from `public_html`, games at `/play` (no subdomain, existing SSL). Redeploy = `cd web && npm run export`, upload `out/` (or `lavigne-site-full.zip`) via cPanel/FTP. |

## Deployment (as shipped)

The **Next.js static export** serves `lavignelabs.com` from `public_html`, with
the games at `lavignelabs.com/play` (**no subdomain** — existing SSL covers the
path). This replaced both WordPress and the planned WP-freeze intermediate step.

To ship an update:

```bash
cd web
npm run export        # -> web/out/ + web/lavigne-*.zip (git-ignored)
```

…then upload `out/` (or extract `lavigne-site-full.zip`) into `public_html` via
cPanel/FTP. Full runbook: **docs/DEPLOYMENT.md**.

**Contact form is still open** — the static host has no PHP/API, so the Resend
route (`web/app/api/contact/route.ts`) isn't running in production. Needs
Formspree/Web3Forms/`mailto:` wiring.

_Historical:_ the WP-freeze path (`lavigne-site-flat.zip` +
`scripts/freeze-add-play-menu.py`) is documented in DEPLOYMENT.md as Option D
and is no longer the plan.

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

1. **Contact form** → wire the live Contact page to a form service (Formspree /
   Web3Forms / `mailto:`); static hosting can't run the Resend API route.
2. **Review portfolio descriptions** — 8 items have *inferred* blurbs flagged for
   Brian to verify (Smart Fire Alarm, Teleprompter, Special Action Camera, Custom
   Motorcycle Parts, Dog Backpack, Oculus Earphones, Passport Case, Under Cabinet
   Lighting).
3. **Wire the standalone calculators into `/tools`** — seven pages waiting:
   `fasteners/` (reference sheet / holding force / tightening torque, each metric
   + inch) and `pcb/` (Copper & Patina). Open: linked as-is from `public/` or
   ported to React? And how do they reconcile with the existing `bolt-sizes`
   calculator? See `fasteners/README.md` and `pcb/README.md`.
4. ~~Go-live~~ **done** — Next.js static export is live at lavignelabs.com.
5. ~~Swap real game SFX~~ **done** — real WT588F recordings wired (docs/SOUNDS.md).

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
cd lavigne-labs-website/web    # the site lives in web/
npm install
npm run dev      # http://localhost:3000
npm run export   # rebuild the static export + deployable bundles when needed
```

Then see **docs/DEPLOYMENT.md** to continue the rollout.
