#!/usr/bin/env bash
# Build and upload the site to lavignelabs.com over FTPS. Designed to run
# unattended (no prompts, no interactive auth). See docs/DEPLOYMENT.md.
#
#   ./scripts/deploy.sh              build, then mirror out/ -> public_html
#   ./scripts/deploy.sh --dry-run    show exactly what would change, upload nothing
#   ./scripts/deploy.sh --skip-build reuse the existing out/ (must already exist)
#
# Credentials live OUTSIDE the repo, in ~/.config/lavigne-labs/deploy.env
# (mode 0600). Override the location with LAVIGNE_DEPLOY_ENV.
set -euo pipefail
cd "$(dirname "$0")/.."

CONFIG="${LAVIGNE_DEPLOY_ENV:-$HOME/.config/lavigne-labs/deploy.env}"
DRY_RUN=0
SKIP_BUILD=0
for arg in "$@"; do
  case "$arg" in
    --dry-run)    DRY_RUN=1 ;;
    --skip-build) SKIP_BUILD=1 ;;
    -h|--help)    sed -n '2,9p' "$0"; exit 0 ;;
    *) echo "deploy: unknown option '$arg'" >&2; exit 2 ;;
  esac
done

log() { printf '\n\033[1;34m==>\033[0m %s\n' "$*"; }
die() { printf '\n\033[1;31mdeploy failed:\033[0m %s\n' "$*" >&2; exit 1; }

# --- credentials -------------------------------------------------------------
[ -f "$CONFIG" ] || die "no config at $CONFIG
Create it with:
  mkdir -p ~/.config/lavigne-labs
  install -m 600 /dev/null ~/.config/lavigne-labs/deploy.env
then add DEPLOY_HOST / DEPLOY_USER / DEPLOY_PASS (see deploy.env.example)."

perms=$(stat -c '%a' "$CONFIG")
[ "$perms" = "600" ] || die "$CONFIG is mode $perms — it holds a password. chmod 600 it."

# shellcheck disable=SC1090
set -a; . "$CONFIG"; set +a

: "${DEPLOY_HOST:?not set in $CONFIG}"
: "${DEPLOY_USER:?not set in $CONFIG}"
: "${DEPLOY_PASS:?not set in $CONFIG}"
DEPLOY_REMOTE_DIR="${DEPLOY_REMOTE_DIR:-public_html}"
# Paths never deleted from the server. A static export can't contain these, and
# removing .well-known breaks Let's Encrypt renewal (HTTPS dies weeks later, far
# from the cause). Set DEPLOY_PROTECT= (empty) for a literal pure mirror.
DEPLOY_PROTECT="${DEPLOY_PROTECT:-.well-known cgi-bin}"
DEPLOY_VERIFY_URL="${DEPLOY_VERIFY_URL:-https://lavignelabs.com}"

# --- build -------------------------------------------------------------------
if [ "$SKIP_BUILD" = 1 ]; then
  [ -d out ] && [ -f out/index.html ] || die "--skip-build but out/ has no index.html — run a real build first."
  log "Skipping build, reusing existing out/"
else
  log "Building static export"
  npm run export
fi

[ -f out/index.html ] || die "out/index.html missing after build — refusing to mirror an empty tree."
# Guard against uploading a truncated build over a working site.
file_count=$(find out -type f | wc -l)
[ "$file_count" -ge 50 ] || die "out/ has only $file_count files — that looks like a broken build. Refusing to deploy."
log "Built $file_count files ($(du -sh out | cut -f1))"

# --- upload ------------------------------------------------------------------
exclude_args=""
for p in $DEPLOY_PROTECT; do
  exclude_args="$exclude_args --exclude ^${p}/"
done

mirror_flags="--reverse --delete --parallel=4 --no-perms --verbose"
[ "$DRY_RUN" = 1 ] && mirror_flags="$mirror_flags --dry-run"

if [ "$DRY_RUN" = 1 ]; then
  log "DRY RUN — connecting to $DEPLOY_HOST, nothing will be written"
else
  log "Uploading to $DEPLOY_HOST:$DEPLOY_REMOTE_DIR (mirror, stale files deleted)"
  [ -n "$DEPLOY_PROTECT" ] && echo "    protected from deletion: $DEPLOY_PROTECT"
fi

# The local HTTP proxy doesn't speak FTP; always go direct.
env -u ftp_proxy -u FTP_PROXY -u http_proxy -u HTTP_PROXY -u https_proxy \
    -u HTTPS_PROXY -u all_proxy -u ALL_PROXY \
lftp -c "
  set ftp:ssl-force true;
  set ftp:ssl-protect-data true;
  set ssl:verify-certificate ${DEPLOY_SSL_VERIFY:-true};
  set ftp:passive-mode true;
  set net:max-retries 5;
  set net:reconnect-interval-base 5;
  set net:timeout 30;
  set cmd:fail-exit true;
  set xfer:log false;
  open -u '$DEPLOY_USER','$DEPLOY_PASS' '$DEPLOY_HOST';
  mirror $mirror_flags $exclude_args out/ '$DEPLOY_REMOTE_DIR';
" || die "lftp transfer failed (see output above). The site may be partially updated — re-run to finish."

[ "$DRY_RUN" = 1 ] && { log "Dry run complete — nothing uploaded."; exit 0; }

# --- verify ------------------------------------------------------------------
log "Verifying $DEPLOY_VERIFY_URL"
fail=0
check() { # <url> <expected string>
  local url="$1" want="$2" code body
  body=$(curl -fsS --max-time 25 --retry 3 --retry-all-errors "$url" 2>/dev/null) || {
    echo "  ✗ $url — request failed"; fail=1; return; }
  if grep -qF "$want" <<<"$body"; then
    echo "  ✓ $url"
  else
    echo "  ✗ $url — 200 but missing expected content ('$want')"; fail=1
  fi
}
check "$DEPLOY_VERIFY_URL/"      "Lavigne Labs"
check "$DEPLOY_VERIFY_URL/play/" "Shiverwing"

if [ "$fail" = 1 ]; then
  die "upload finished but verification failed — check the site."
fi

log "Deployed successfully."
