#!/usr/bin/env bash
# Publish (or remove) one ACME http-01 challenge file in the lavignelabs.com
# docroot, over FTPS. THIS RUNS ON tunnel-bear — FTP transfers don't survive
# blue's network. Deployed to ~/acme-put.sh there.
#
#   acme-put.sh <token> <validation>   publish
#   acme-put.sh --rm <token>           remove
#
# Reuses the same credentials as deploy.sh: ~/.config/lavigne-labs/deploy.env.
set -euo pipefail
CONFIG="${LAVIGNE_DEPLOY_ENV:-$HOME/.config/lavigne-labs/deploy.env}"
[ -f "$CONFIG" ] || { echo "acme-put: no deploy.env at $CONFIG" >&2; exit 1; }
# shellcheck disable=SC1090
set -a; . "$CONFIG"; set +a
: "${DEPLOY_HOST:?not set}"; : "${DEPLOY_USER:?not set}"; : "${DEPLOY_PASS:?not set}"
REMOTE="${DEPLOY_REMOTE_DIR:-.}/.well-known/acme-challenge"

if [ "${1:-}" = '--rm' ]; then
  CMDS="rm -f '$REMOTE/$2';"
else
  TMP=$(mktemp -d); printf '%s' "$2" > "$TMP/$1"
  CMDS="mkdir -p -f '$REMOTE'; put -O '$REMOTE' '$TMP/$1';"
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
  set net:timeout 30;
  set cmd:fail-exit true;
  open -u '$DEPLOY_USER','$DEPLOY_PASS' '$DEPLOY_HOST';
  $CMDS
"
[ -n "${TMP:-}" ] && rm -rf "$TMP"
echo 'acme-put: ok'
