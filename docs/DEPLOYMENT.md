# Deployment

Two independent pieces can go live:

1. **The games** (Shiverwing + Freezing Fortress) — pure static, tiny.
2. **The full marketing site** — either the Next.js app, or (current plan) the
   existing WordPress site **frozen to static** with the games bolted on.

## Build the static bundles

```bash
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

## Option D — current go-live: flat apex site + games on a subdomain

The chosen rollout: the **WP static freeze** serves `lavignelabs.com` (replacing
WordPress), and the **games** get their own subdomain **`play.lavignelabs.com`**.
The frozen site's nav gets a **Play** item linking to that subdomain.

Artifacts (regenerate as below; both are git-ignored and land in the repo root):

| Artifact | What | Goes where |
|---|---|---|
| `lavigne-site-flat.zip` | the freeze **with "Play" added to the menu** | `public_html` (apex) |
| `lavigne-games.zip` | games + root redirect to `/play` | the subdomain's doc root |

### 1. Build the artifacts

```bash
npm run export                                  # rebuilds lavigne-games.zip (subdomain bundle)
python3 scripts/freeze-add-play-menu.py         # lavigne-labs-static-slim.zip -> lavigne-site-flat.zip
```

`freeze-add-play-menu.py` injects `<li>…<a href="https://play.lavignelabs.com/">Play</a></li>`
before **Contact** in both the desktop and mobile menus of every page (idempotent).
Re-run it whenever you regenerate the freeze.

### 2. Create the subdomain (cPanel) — do this BEFORE wiping WordPress

1. **cPanel → Domains → Create A New Domain** → `play.lavignelabs.com`. Set the
   document root to a folder **OUTSIDE `public_html`** (cPanel's default, e.g.
   `/home/USER/play.lavignelabs.com`). Keeping it outside `public_html` means
   replacing the apex site later can't clobber the games.
2. **DNS** — if DNS is on cPanel, the `A` record is auto-created. If it's managed
   elsewhere (registrar/Cloudflare), add `play` → the server's IP (or a `CNAME`
   to `lavignelabs.com`).
3. **SSL** — let **AutoSSL** issue a Let's Encrypt cert for the subdomain (run it
   manually if it doesn't appear within a few minutes).

### 3. Deploy the games to the subdomain

- FTP **`lavigne-games.zip`** into the subdomain's doc root → **Extract**.
- Visit **`https://play.lavignelabs.com`** → it redirects to the games hub at
  `/play`, with Shiverwing and Freezing Fortress under `/play/…`.

### 4. Swap WordPress → flat site at the apex (reversible)

1. **Back up WordPress first**: cPanel full backup, or zip `public_html` + export
   the WP database (phpMyAdmin). Keep it safe.
2. Clear `public_html` (move the WP files to a backup folder, or delete after the
   backup). Leave the subdomain's doc root alone (it's outside `public_html`).
3. FTP **`lavigne-site-flat.zip`** into `public_html` → **Extract** (extraction
   isn't subject to the File-Manager upload cap).
4. Visit **`https://lavignelabs.com`** → the frozen design with
   **Home · Portfolio · Play · Contact**; **Play** → `play.lavignelabs.com`.

### 5. Loose end — contact form

Still open: the frozen Contact page has no PHP backend. Wire it to **Formspree /
Web3Forms** or a `mailto:` (see Option B §4).

## Option C — deploy the Next.js app as-is

Host on **Vercel / Netlify / Cloudflare Pages** (connect this repo). These run the
contact API route natively and handle image optimization — no static-export
caveats. Point a domain/subdomain at it.
