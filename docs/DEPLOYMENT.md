# Deployment

> **Paths & commands in this doc are relative to `web/`** — the Next.js site
> lives there. `cd web` before any `npm` command.

> **Status (2026-10-18): the canonical site is `https://lavignelabs.net`, served by
> Caddy on tunnel-bear** and published with `scripts/deploy-net.sh` (below).
> `lavignelabs.com` (old cPanel host, FTPS) still serves the previous copy until
> its 301 to `.net` is flipped; the FTPS route under "Old host" is only for that.

## lavignelabs.net (the live site): `scripts/deploy-net.sh`

```bash
cd web
./scripts/deploy-net.sh              # build on red, upload a release, swap, verify
./scripts/deploy-net.sh --skip-build # reuse the existing out/
./scripts/deploy-net.sh --rollback   # point `current` at the previous release
```

Run it **on red**. It needs nothing but the `tunnel-bear` ssh alias: no
credentials, no FTP, nothing to put in an env file.

1. `npm run export` builds `out/`. The export fails if any JSON-LD block does not
   parse, or if **any `lavignelabs.com` reference remains** (`scripts/check-domain.py`;
   the only allowed ones are the Organization JSON-LD `sameAs` and Wayback Machine
   image URLs that embed the old domain).
2. rsync `out/` to `tunnel-bear:/srv/lavignelabs.net/releases/<UTC ts>/`, with
   `--link-dest` against the live release so unchanged files are hard links
   (a no-change release costs ~200 KB).
3. Swap `/srv/lavignelabs.net/current` atomically (new symlink + `mv -T`) and keep
   the newest 3 releases.
4. Verify over HTTPS: `/`, `/work/`, `/articles/`, `/contact/`, `/api/v1/index.json`,
   `/llms.txt`, `/sitemap.xml`, `/robots.txt` return 200 and a missing page 404.
   On failure it exits 1 and prints the rollback command.

**Where the config lives (not in this repo):**
- DNS: Porkbun (domain paid to 2036). A records `@`, `www`, `forms` ->
  `154.213.178.159`, TTL 600; the MX/SPF records are Porkbun email forwarding
  (`hello@lavignelabs.net`). API key: the-den `secrets.env` (`PORKBUN_*`).
- Caddy: the `lavignelabs.net` / `www.lavignelabs.net` blocks in
  `the-den/tunnel-bear/Caddyfile.template`, published by
  `the-den/bin/tunnel-bear/push-caddyfile.sh`. Never edit the live Caddyfile.
  `try_files {path} {path}/ {path}/index.html {path}.html`, zstd/gzip,
  `/_next/static/*` cached a year (immutable), `404.html` for misses, `www` 301 to the apex.
- Form receiver: `forms.lavignelabs.net` (also `forms.hanquest.com`,
  `forms.lavignelabs.com`) -> repo `lavigne-inquiries`; CORS allows both
  `https://lavignelabs.net` and `https://lavignelabs.com`. The site's endpoint
  is the one constant `formsEndpoint` in `content/site.ts`.

**Flipping lavignelabs.com to .net (prepared, NOT applied):**
`scripts/htaccess-redirect.txt` is the old host's `.htaccess` (PHP handler kept)
plus a 301 of every path on `lavignelabs.com` and `www` to the same path on
`https://lavignelabs.net`. The original is saved as `docs/htaccess.orig`. To flip,
upload it as `.htaccess` to the old docroot over FTPS from tunnel-bear; to undo,
upload `docs/htaccess.orig`. Let's Encrypt renewals under `/.well-known/` stay
un-redirected so the old host's cert keeps renewing while the redirect lives.

## Old host: lavignelabs.com over FTPS (`scripts/deploy.sh`)


```bash
cd web
./scripts/deploy.sh              # build, then mirror out/ -> public_html over FTPS
./scripts/deploy.sh --dry-run    # show what would change, upload nothing
./scripts/deploy.sh --skip-build # reuse the existing out/
```

Runs unattended — no prompts, no interactive auth. It builds, refuses to upload a
broken build, mirrors over FTPS, then verifies the live site actually serves the
homepage and `/play/`.

> **Run it from tunnel-bear, not blue.** FTP does not survive blue's network
> (clash TUN / GFW): the control channel connects but the transfer hangs.
> Verified 2026-07-29 — login and passive mode work cleanly from tunnel-bear.

**First-time setup:** credentials live outside the repo at
`~/.config/lavigne-labs/deploy.env`, mode 0600. Copy the template from
`web/scripts/deploy.env.example` — the verified non-secret values for this host
are recorded at the top of it; paste `DEPLOY_PASS` from cPanel → FTP Accounts.
The script refuses to run if that file is missing or world-readable. Note this
host's account logs straight into the docroot, so `DEPLOY_REMOTE_DIR=.` (not
`public_html`), and its FTPS cert needs `DEPLOY_SSL_VERIFY=false`.

**What it does to the server:** mirrors with `--delete`, so the server ends up
exactly matching `out/` — stale files are removed. Protected from deletion on
this host: `DEPLOY_PROTECT='.well-known cgi-bin .htaccess .ftpquota'`
(`.well-known` holds Let's Encrypt renewal challenges → deleting it breaks HTTPS;
`.htaccess` is cPanel's PHP handler; `.ftpquota` is server-managed and erroring
on it fails the mirror). Set `DEPLOY_PROTECT=` empty for a literal pure mirror.

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

## SSL certificate renewal (Let's Encrypt, manual → cPanel)

The cert for `lavignelabs.com` is **not** auto-renewed by the host. It is issued
with certbot **on blue** and then **installed by hand in cPanel**. Verified
end-to-end 2026-09-01 (cert renewed to 2026-11-30).

**How it works.** certbot uses `authenticator = manual` with an http-01
challenge. The challenge file has to appear at
`http://lavignelabs.com/.well-known/acme-challenge/<token>` — so the hook
uploads it over FTPS **from tunnel-bear** (FTP transfers hang from blue, same
reason `deploy.sh` runs there). It reuses `deploy.env`, so no second credential.

    blue: certbot ──auth-hook──> ssh tunnel-bear ──FTPS──> docroot/.well-known/

**One-time setup on a fresh machine:**

```bash
# 1. the uploader, on tunnel-bear (needs ~/.config/lavigne-labs/deploy.env + lftp)
scp web/scripts/acme-put.sh tunnel-bear:~/acme-put.sh && ssh tunnel-bear chmod +x ~/acme-put.sh

# 2. the hooks, on blue — durable paths, NOT a temp dir
sudo install -m 755 web/scripts/acme-auth-hook.sh    /usr/local/sbin/lavigne-acme-auth.sh
sudo install -m 755 web/scripts/acme-cleanup-hook.sh /usr/local/sbin/lavigne-acme-cleanup.sh
sudo sed -i 's#^manual_auth_hook = .*#manual_auth_hook = /usr/local/sbin/lavigne-acme-auth.sh#; \
             s#^manual_cleanup_hook = .*#manual_cleanup_hook = /usr/local/sbin/lavigne-acme-cleanup.sh#' \
  /etc/letsencrypt/renewal/lavignelabs.com.conf
```

**To renew** (do it with >2 weeks of runway, not 3 days):

```bash
sudo certbot renew --dry-run          # staging; proves the hooks still work
sudo certbot renew                    # real issuance
```

**Then install it in cPanel — this step is manual and cannot be skipped.**
Issuing the cert does nothing to the live site on its own.

1. cPanel → **Security → SSL/TLS → Manage SSL sites** → pick `lavignelabs.com`.
2. Paste, from `/etc/letsencrypt/live/lavignelabs.com/`:
   - **Certificate (CRT)** ← `cert.pem`
   - **Private Key (KEY)** ← `privkey.pem`
   - **Certificate Authority Bundle (CABUNDLE)** ← `chain.pem`
3. **Install Certificate**, then verify:
   ```bash
   echo | openssl s_client -servername lavignelabs.com \
     -connect lavignelabs.com:443 2>/dev/null | openssl x509 -noout -dates
   ```

> **Never FTP the private key into the docroot.** `privkey.pem` is a secret;
> anything under the docroot is served publicly. The only file that ever gets
> uploaded is the ACME challenge token, which the hook handles.

**Known gap:** the cert covers `lavignelabs.com` only. `www.lavignelabs.com`
resolves to the same IP, so visitors to `www` get a name-mismatch warning. Fix
by adding `-d www.lavignelabs.com` to the certbot command at the next renewal
(validate `www` serves `/.well-known/` first, or the whole issuance fails).
