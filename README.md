# Lavigne Labs

Marketing + portfolio site for **Lavigne Labs** — helping US & Canadian hardware
teams manufacture in China without the costly mistakes.

Built with **Next.js 16 (App Router) + TypeScript + Tailwind CSS v4**. It also
hosts two faithful browser ports of Brian's hardware side-projects:

- **Shiverwing** — the Flappy-Bird game from his ESP32 badge.
- **Freezing Fortress** — his 14×10 addressable-LED Sokoban.

---

## Requirements

- **Node.js 20+** (developed on Node 22; the LTS works fine)
- **npm** (lockfile is `package-lock.json`)
- A POSIX shell for `npm run export` (macOS/Linux/WSL; the script is bash)

No database, no services required for local development.

## Getting started (fresh clone)

```bash
git clone git@github.com:makestuff4fun/lavigne-labs-website.git
cd lavigne-labs-website/web    # ← the site lives in web/

npm install            # installs dependencies (~1–2 min the first time)
npm run dev            # starts the dev server
```

> **Repo layout:** the Next.js site is in **`web/`**, project docs in **`docs/`**,
> and **`fasteners/`** + **`pcb/`** hold standalone HTML calculators built for
> the site but not yet wired into `/tools`. Every `npm` command below is run from
> `web/`; paths like `app/…` or `content/…` in the docs are relative to `web/`.

Open **http://localhost:3000**. Pages to check:

| Page | URL |
|---|---|
| Home | `/` |
| Work / portfolio | `/work` |
| Articles | `/articles` |
| Engineering tools | `/tools` |
| FAQ | `/faq` |
| Contact | `/contact` |
| Games hub | `/play` |
| Shiverwing | `/play/shiverwing` |
| Freezing Fortress | `/play/freezing-fortress` |

That's the whole setup — there's nothing else to configure to run it locally.
Edit anything under `app/`, `components/`, or `content/` and the page hot-reloads.

### Optional: enable the contact form locally

The contact form posts to `app/api/contact/route.ts`, which emails via
[Resend](https://resend.com). Without a key it still works in dev — submissions
are logged to the terminal. To send real email:

```bash
cp .env.example .env.local
# then set RESEND_API_KEY=... in .env.local
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server (hot reload) at http://localhost:3000 |
| `npm run build` | Production build (server-rendered) |
| `npm run start` | Serve the production build (after `build`) |
| `npm run lint` | ESLint |
| `npm run export` | **Static** export → `out/` + the deployable game bundles. See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md). |

> `npm run export` regenerates the deployment artifacts (`out/`, `dist-games/`,
> `lavigne-games*.zip`). These are **git-ignored** — they're build outputs, not
> source. Run the script whenever you need fresh bundles to upload.

## Project structure

```
web/                  THE SITE — all npm commands run in here
  app/                Routes (App Router)
    page.tsx          Home (hero, services, how-I-work, work, FAQ, CTA)
    work/  articles/  tools/  faq/  contact/  lab/   Section pages
    play/             Games hub + /play/shiverwing + /play/freezing-fortress
    api/contact/      Contact form handler (Resend; stripped from static export)
    sitemap.ts  robots.ts  opengraph-image.tsx
  components/
    Hero, Services, HowIWork, FeaturedWork, Faq, …    Home/section components
    games/Shiverwing.tsx        Flappy-Bird port (canvas)
    games/FreezingFortress.tsx  LED Sokoban port (canvas)
    games/ffData.ts             Freezing Fortress colour/animation/digit tables
    SoundToggle.tsx
  content/            Editable site content — NO code needed (see docs/CONTENT.md):
    site.ts           Name, contact, nav, services, process, engagement copy
    projects.ts       Portfolio projects
    tools.ts  faq.ts  labNotes.ts
    articles/*.md     Blog posts (Markdown + frontmatter)
  lib/
    sfx.ts            Web Audio sound engine (docs/SOUNDS.md)
    articles.ts       Markdown article loader
  public/
    games/shiverwing/        Real badge sprites (extracted from firmware)
    games/freezing-fortress/ levels.txt + bezel.png
    work/  brand/            Site imagery
  scripts/export-static.sh   Static export + game-bundle builder
  next.config.ts  package.json  tsconfig.json  eslint.config.mjs  postcss.config.mjs

docs/                 Project docs — context, content, deployment, games, sounds

Standalone HTML calculators — built for the site, not yet wired into /tools.
Nothing in the Next build imports them (see each folder's README):
fasteners/            6 pages: fastener sheets, holding force, tightening torque
                      (metric + inch of each)
pcb/                  "Copper & Patina" — PCB calculators for hobbyists
```

## Editing the site's content

Almost all copy and data lives in `content/` and `content/articles/` — you can
update text, projects, articles, tools, and FAQ **without touching code**.

👉 **See [docs/CONTENT.md](docs/CONTENT.md) for the full, example-driven guide.**

## Deploying

**`lavignelabs.com` is live** and serving this Next.js site as a static export
(games included, at `/play`). The old WordPress site has been replaced.

Two things can ship independently: the **games** (tiny, static) and the **full
site**.

👉 **See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).** Quick version, from `web/`:

```bash
npm run export   # builds out/ and lavigne-*.zip
```

…then upload per the doc (cPanel/FTP, or host the Next app on Vercel/Netlify/CF Pages).

## Docs

- [docs/CONTEXT.md](docs/CONTEXT.md) — **project status & handoff** (read this first to pick up where we left off; auto-loaded by Claude Code via `CLAUDE.md`)
- [docs/CONTENT.md](docs/CONTENT.md) — editing copy, projects, articles, tools, FAQ, levels
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — static export + WordPress-freeze + games rollout
- [docs/GAMES.md](docs/GAMES.md) — how the games were ported, asset provenance, adding levels
- [docs/SOUNDS.md](docs/SOUNDS.md) — the SFX engine and the real device recordings

## Troubleshooting

- **`npm run export` fails on the API route** — the script moves `app/api` aside
  during the static build and restores it (even on failure). If it ever leaves an
  `_api_tmp/` folder behind, just `mv _api_tmp app/api`.
- **Games show blank assets after deploy** — the game bundle uses root-absolute
  paths (`/_next`, `/games`); it must be extracted at a **domain/subdomain root**,
  not inside a nested folder. See docs/DEPLOYMENT.md.
- **Contact form does nothing on a static host** — expected; static sites have no
  PHP/API. Wire it to a form service or `mailto:` (docs/DEPLOYMENT.md).
