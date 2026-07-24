# Deployment

> **Paths & commands in this doc are relative to `web/`** — the Next.js site
> lives there. `cd web` before any `npm` command.

> **Status:** `lavignelabs.com` is **live with the Next.js static export**
> (games at `/play`). The WordPress-freeze route below (Option D) is kept for
> history — it is no longer the deploy path.

## The one command

```bash
cd web
./scripts/deploy.sh              # build, then mirror out/ -> public_html over FTPS
./scripts/deploy.sh --dry-run    # show what would change, upload nothing
./scripts/deploy.sh --skip-build # reuse the existing out/
```

Runs unattended — no prompts, no interactive auth. It builds, refuses to upload a
broken build, mirrors over FTPS, then verifies the live site actually serves the
homepage and `/play/`.

**First-time setup:** credentials live outside the repo at
`~/.config/lavigne-labs/deploy.env`, mode 0600. Copy the template from
`web/scripts/deploy.env.example` and fill in `DEPLOY_HOST` / `DEPLOY_USER` /
`DEPLOY_PASS` (cPanel → FTP Accounts). The script refuses to run if that file is
missing or world-readable.

**What it does to the server:** mirrors with `--delete`, so the server ends up
exactly matching `out/` — stale files are removed. Two paths are protected from
deletion by default (`DEPLOY_PROTECT=".well-known cgi-bin"`); `.well-known` is
where Let's Encrypt writes renewal challenges, so deleting it breaks HTTPS at the
next renewal. Set `DEPLOY_PROTECT=` empty for a literal pure mirror.

There is **no automatic backup** — recovery is "re-run the deploy from a known
good commit", which works because the site is fully reproducible from this repo.
Anything on the server that the build doesn't contain is not recoverable this
way.

---

The rest of this doc covers the manual/historical routes.

Two independent pieces can go live:

1. **The games** (Shiverwing + Freezing Fortress) — pure static, tiny.
2. **The full marketing site** — the Next.js app (what's live), or historically
   the existing WordPress site **frozen to static** with the games bolted on.

## Build the static bundles

```bash
cd web
npm run export
```

This runs `next build` with `STATIC_EXPORT=1` (see `next.config.ts`) and assembles:

| Output | Use |
|---|---|
| `out/` | Full static export of every page |
| `lavigne-games-folder.zip` | `_next/ games/ play/` — extract into the site's **document root**; games appear at `/play` |
| `lavigne-games.zip` | Same + a root redirect — deploy at a **subdomain root** (e.g. `games.example.com`) |

> The game pages reference assets with **root-absolute** paths (`/_next/…`,
> `/games/…`), so the bundle must live at a **root** (a domain or subdomain root,
> or extracted into the main `public_html`) — **not** nested in a `/something/`
> folder. The `*-folder` zip is built for exactly that: extract it into
> `public_html` and `_next/`, `games/`, `play/` sit beside the rest of the site,
> giving `https://yourdomain/play`.

## Option A — games beside an existing site (no subdomain)

cPanel File Manager:

1. Extract **`lavigne-games-folder.zip`** into **`public_html`** (the root — *not*
   a `play` subfolder). It creates `public_html/_next`, `public_html/games`,
   `public_html/play`.
2. Visit `https://yourdomain/play`. Your existing SSL cert already covers it
   (same hostname). WordPress/other content is untouched — those folder names
   don't collide.

## Option B — freeze WordPress to static, then add the games

The current production plan. Replaces the dynamic WP site with a static copy.

### 1. Freeze the WP site

In `wp-admin`, install **Simply Static** → Settings → Delivery Method **ZIP
Archive**, Destination URLs **relative** → **Generate** → download the ZIP. It
renders every page (incl. lazy-loaded images) into a static site.

### 2. Slim + fix the freeze (optional but recommended)

The raw export includes the entire media library and a JS-driven portfolio grid.
Helpers used during the initial rollout (kept here for reference):

- **Trim unreferenced media** — only images referenced by the HTML/CSS are
  needed; dropping the rest cut ~825 MB → ~170 MB.
- **Rebuild the "Our Projects" grid** — the theme's portfolio grid used AJAX
  infinite-scroll that can't work statically (page-2 items never load). Replace
  the grid markup with a plain CSS grid of all items linking to the (working)
  detail pages.

### 3. Upload

- The freeze ZIP can exceed cPanel File Manager's upload limit — **FTP the ZIP**,
  then **Extract** it via File Manager (extraction isn't subject to the upload cap).
- Extract the freeze into `public_html`, then extract `lavigne-games-folder.zip`
  into `public_html` too (for `/play`).
- **Back up WordPress first** (rename its files or use cPanel Backup) so the swap
  is reversible.

### 4. Contact form

A static site has no PHP, so the WordPress (Contact Form 7) form won't submit.
Point it at a free service — **Formspree** or **Web3Forms** — or a `mailto:`.
For the Next.js app's own contact page, swap the `fetch('/api/contact')` call for
the form-service endpoint before exporting.

## Option D — current go-live: flat site + games at `lavignelabs.com/play`

The chosen rollout: the **WP static freeze** serves `lavignelabs.com` (replacing
WordPress), and the **games** sit beside it in the same `public_html`, served at
`lavignelabs.com/play`. No subdomain — the existing SSL already covers the path.
The frozen site's nav gets a **Play** item linking to `/play/`.

Artifacts (regenerate as below; both are git-ignored and land in the repo root,
also copied to Downloads):

| Artifact | What | Goes where |
|---|---|---|
| `lavigne-site-flat.zip` | the freeze **with "Play" added to the menu** | `public_html` |
| `lavigne-games-folder.zip` | `_next/ games/ play/` (no root `index.html`) | `public_html` |

The `-folder` bundle omits the root `index.html`, so it won't overwrite the
freeze's homepage; the two coexist (freeze = `wp-content/`, `portfolio/`, …; games
= `_next/`, `games/`, `play/`).

### 1. Build the artifacts

```bash
npm run export                            # rebuilds lavigne-games-folder.zip
python3 scripts/freeze-add-play-menu.py   # lavigne-labs-static-slim.zip -> lavigne-site-flat.zip
```

`freeze-add-play-menu.py` injects `<li>…<a href="/play/">Play</a></li>` before
**Contact** in both the desktop and mobile menus of every page (idempotent —
re-run it whenever you regenerate the freeze).

### 2. Swap WordPress → flat site (reversible)

1. **Back up WordPress first**: cPanel full backup, or zip `public_html` + export
   the WP database (phpMyAdmin). Keep it safe.
2. Clear `public_html` (move the WP files to a backup folder, or delete after the
   backup).
3. FTP **`lavigne-site-flat.zip`** into `public_html` → **Extract** (extraction
   isn't subject to the File-Manager upload cap).
4. FTP **`lavigne-games-folder.zip`** into `public_html` → **Extract** (creates
   `public_html/_next`, `/games`, `/play`).

### 3. Verify

- **`https://lavignelabs.com`** → the frozen design, nav reads
  **Home · Portfolio · Play · Contact**.
- **`https://lavignelabs.com/play`** → the games hub (Shiverwing + Freezing
  Fortress). Existing SSL covers it (same hostname).

### 4. Loose end — contact form

Still open: the frozen Contact page has no PHP backend. Wire it to **Formspree /
Web3Forms** or a `mailto:` (see Option B §4).

## Option C — deploy the Next.js app as-is

Host on **Vercel / Netlify / Cloudflare Pages** (connect this repo). These run the
contact API route natively and handle image optimization — no static-export
caveats. Point a domain/subdomain at it.
