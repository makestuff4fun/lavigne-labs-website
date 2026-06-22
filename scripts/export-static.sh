#!/usr/bin/env bash
# Build a fully static export of the site into ./out, then assemble the
# games-only bundles used for cPanel/FTP deployment. See docs/DEPLOYMENT.md.
#
#   ./scripts/export-static.sh
#
# Produces:
#   out/                      full static export (every page)
#   dist-games/               games only: _next/ games/ play/ (+ redirect index.html)
#   lavigne-games-folder.zip  drop into public_html ROOT  -> lavignelabs.com/play
#   lavigne-games.zip         deploy at a subdomain ROOT  -> games.example.com
set -euo pipefail
cd "$(dirname "$0")/.."

# The contact API route can't be statically exported; move it aside during the
# export and always restore it (even on failure).
restore() { [ -d _api_tmp ] && mv _api_tmp app/api 2>/dev/null || true; }
trap restore EXIT
[ -d app/api ] && mv app/api _api_tmp

STATIC_EXPORT=1 npx next build
trap - EXIT; restore

# --- assemble the games-only distribution ---
rm -rf dist-games
mkdir -p dist-games
cp -r out/_next dist-games/_next
cp -r out/play dist-games/play
cp -r out/games dist-games/games
[ -f out/favicon.ico ] && cp out/favicon.ico dist-games/ || true
cat > dist-games/index.html <<'HTML'
<!doctype html><html><head><meta charset="utf-8"><title>Lavigne Labs — Play</title>
<meta http-equiv="refresh" content="0; url=./play/"></head>
<body style="font-family:sans-serif;background:#0b1220;color:#eee;text-align:center;padding:60px">
<p>Loading the games… <a style="color:#93c5fd" href="./play/">enter →</a></p></body></html>
HTML

zip_dir() { # <srcdir> <zipfile> [exclude_top...]
  python3 - "$@" <<'PY'
import sys, os, zipfile
src, out, *skip = sys.argv[1:]
if os.path.exists(out): os.remove(out)
with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
    for dp, _, fs in os.walk(src):
        for f in fs:
            full = os.path.join(dp, f)
            rel = os.path.relpath(full, src)
            # skip by exact relative path (e.g. index.html) or top-level dir
            if rel in skip or rel.split(os.sep)[0] in skip:
                continue
            z.write(full, rel)
print(f"  {out}  {round(os.path.getsize(out)/1024/1024, 2)} MB")
PY
}

echo "Bundles:"
zip_dir dist-games lavigne-games.zip                       # subdomain root (keeps index.html)
zip_dir dist-games lavigne-games-folder.zip index.html     # main-domain /play folder (no root index)
echo "Done."
