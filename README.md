# Lavigne Labs

Marketing + portfolio site for **Lavigne Labs** — helping US & Canadian hardware
teams manufacture in China without the costly mistakes.

Built with **Next.js (App Router) + TypeScript + Tailwind CSS v4**. It also hosts
two faithful browser ports of Brian's hardware side-projects:

- **Shiverwing** — the Flappy-Bird game from his ESP32 badge.
- **Freezing Fortress** — his 14×10 addressable-LED Sokoban.

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build (server-rendered) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run export` | Static export → `out/` + the deployable game bundles (see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)) |

## Project structure

```
app/                Routes (App Router)
  page.tsx          Home (hero, services, how-I-work, work, FAQ, CTA)
  work/  articles/  tools/  faq/  contact/  lab/   Section pages
  play/             Games hub + /play/shiverwing + /play/freezing-fortress
  api/contact/      Contact form handler (Resend; not used in static export)
  sitemap.ts  robots.ts  opengraph-image.tsx
components/
  Hero, Services, HowIWork, FeaturedWork, Faq, …    Home/section components
  games/Shiverwing.tsx        Flappy-Bird port (canvas)
  games/FreezingFortress.tsx  LED Sokoban port (canvas)
  games/ffData.ts             Freezing Fortress colours/animation/digit tables
  SoundToggle.tsx
content/            Editable site content (no code):
  site.ts           Name, contact, nav, services, process, engagement copy
  projects.ts       Portfolio projects
  tools.ts  faq.ts  labNotes.ts
lib/
  sfx.ts            Web Audio sound engine (see docs/SOUNDS.md)
  articles.ts       Markdown article loader
content/articles/   Blog posts (Markdown)
public/
  games/shiverwing/        Real badge sprites (extracted from firmware)
  games/freezing-fortress/ levels.txt + bezel.png
  work/  brand/            Site imagery
scripts/export-static.sh   Static export + game-bundle builder
docs/                      Deployment, games, sounds
```

## Editing content

Most copy lives in `content/` — no code changes needed:

- **Site text / services / contact** → `content/site.ts`
- **Portfolio projects** → `content/projects.ts`
- **Articles** → drop a Markdown file in `content/articles/` (frontmatter: `title`, `date`, `tag`, `excerpt`)
- **Engineering tools** → `content/tools.ts`
- **Freezing Fortress levels** → append to `public/games/freezing-fortress/levels.txt` (standard `.xsb`)

## Docs

- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — static export, the WordPress-freeze + games rollout, cPanel/FTP
- [docs/GAMES.md](docs/GAMES.md) — how the games were ported, assets, adding levels
- [docs/SOUNDS.md](docs/SOUNDS.md) — the SFX engine and swapping in the real WAVs

## Contact form

`app/api/contact/route.ts` emails via [Resend](https://resend.com) when
`RESEND_API_KEY` is set (copy `.env.example` → `.env.local`). The static export
strips the API route — on a static host, wire the form to a service like
Formspree/Web3Forms or a `mailto:` (see docs/DEPLOYMENT.md).
