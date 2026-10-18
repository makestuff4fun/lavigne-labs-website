#!/usr/bin/env bash
# Build the static export on red and publish it to https://lavignelabs.net on tunnel-bear.
#
#   ./scripts/deploy-net.sh              build, upload a new release, swap, verify
#   ./scripts/deploy-net.sh --skip-build reuse the existing out/
#   ./scripts/deploy-net.sh --rollback   point `current` at the previous release, verify
#
# Layout on tunnel-bear (served by Caddy's lavignelabs.net block, the-den
# tunnel-bear/Caddyfile.template):
#   /srv/lavignelabs.net/releases/<UTC timestamp>/   one complete out/ each
#   /srv/lavignelabs.net/current -> releases/<ts>    swapped atomically (rename)
# The last KEEP (3) releases are kept, so a rollback is one symlink swap.
#
# Needs nothing but the `tunnel-bear` ssh alias: no credentials, no FTP.
# The old cPanel FTPS route (scripts/deploy.sh) only serves lavignelabs.com.
set -euo pipefail
cd "$(dirname "$0")/.."

HOST=${DEPLOY_NET_HOST:-tunnel-bear}
BASE=/srv/lavignelabs.net
URL=${DEPLOY_NET_URL:-https://lavignelabs.net}
KEEP=3
MODE=deploy
case "${1:-}" in
  "") ;;
  --skip-build) MODE=skip-build ;;
  --rollback) MODE=rollback ;;
  *) echo "usage: $0 [--skip-build|--rollback]" >&2; exit 2 ;;
esac

verify() {
  local fail=0 p code
  for p in / /work/ /articles/ /contact/ /api/v1/index.json /llms.txt /sitemap.xml /robots.txt; do
    code=$(curl -sS --noproxy '*' --max-time 30 -o /dev/null -w '%{http_code}' "$URL$p" || echo 000)
    printf '  %-22s %s\n' "$p" "$code"
    [[ "$code" == 200 ]] || fail=1
  done
  code=$(curl -sS --noproxy '*' --max-time 30 -o /dev/null -w '%{http_code}' "$URL/this-page-does-not-exist/" || echo 000)
  printf '  %-22s %s (want 404)\n' "/<missing>" "$code"
  [[ "$code" == 404 ]] || fail=1
  return $fail
}

if [[ $MODE == rollback ]]; then
  ssh "$HOST" "set -e; cd $BASE; cur=\$(readlink current); prev=\$(ls -1d releases/*/ | sed 's:/\$::' | sort | grep -B1 -x \"\$cur\" | head -1)
    [ -n \"\$prev\" ] && [ \"\$prev\" != \"\$cur\" ] || { echo 'no earlier release' >&2; exit 1; }
    ln -sfn \"\$prev\" current.new && mv -T current.new current && echo \"current -> \$prev (was \$cur)\""
  verify
  exit
fi

if [[ $MODE == deploy ]]; then
  npm run export
fi

# Refuse to publish a broken or wrong-domain build.
[[ -f out/index.html && -f out/404.html && -f out/api/v1/index.json ]] \
  || { echo "REFUSING: out/ is incomplete (index.html, 404.html, api/v1/index.json)" >&2; exit 1; }
python3 scripts/check-domain.py out

TS=$(date -u +%Y%m%dT%H%M%SZ)
REL=$BASE/releases/$TS
PREV=$(ssh "$HOST" "readlink $BASE/current 2>/dev/null || true")
echo "uploading release $TS (previous: ${PREV:-none})"
ssh "$HOST" "mkdir -p $BASE/releases"
# --link-dest against the live release: unchanged files become hard links, so only
# what changed crosses the wire and each extra release costs almost no disk.
LINK=()
[[ -n "$PREV" ]] && LINK=(--link-dest="$BASE/$PREV")
rsync -a --delete --chmod=D755,F644 "${LINK[@]}" out/ "$HOST:$REL/"

# Atomic swap: a new symlink renamed over the old one (rename(2) is atomic).
ssh "$HOST" "set -e; cd $BASE; ln -sfn releases/$TS current.new && mv -T current.new current
  ls -1d releases/*/ | sed 's:/\$::' | sort | head -n -$KEEP | while read -r d; do
    [ \"\$d\" = \"releases/$TS\" ] || rm -rf -- \"\$d\"; done
  echo \"current -> \$(readlink current)\"; ls -1 releases"

echo "verify $URL:"
if ! verify; then
  echo "VERIFY FAILED. Roll back with: $0 --rollback" >&2
  exit 1
fi
echo "deployed $TS"
