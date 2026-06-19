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

## Option C — deploy the Next.js app as-is

Host on **Vercel / Netlify / Cloudflare Pages** (connect this repo). These run the
contact API route natively and handle image optimization — no static-export
caveats. Point a domain/subdomain at it.
