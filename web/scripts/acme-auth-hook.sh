#!/usr/bin/env bash
# certbot --manual-auth-hook for lavignelabs.com. Runs AS ROOT (certbot is
# sudo'd), so it drops to bairui to use that user's ssh key for tunnel-bear.
# Install to /usr/local/sbin/lavigne-acme-auth.sh — see docs/DEPLOYMENT.md.
set -euo pipefail
sudo -u bairui -H ssh -o BatchMode=yes -o ConnectTimeout=20 tunnel-bear \
  "~/acme-put.sh '$CERTBOT_TOKEN' '$CERTBOT_VALIDATION'"
# Confirm Let's Encrypt will actually be able to read it before returning.
for _ in 1 2 3 4 5; do
  got=$(curl -fsS --max-time 20 \
    "http://$CERTBOT_DOMAIN/.well-known/acme-challenge/$CERTBOT_TOKEN" || true)
  [ "$got" = "$CERTBOT_VALIDATION" ] && { echo "auth-hook: challenge live"; exit 0; }
  sleep 3
done
echo "auth-hook: challenge NOT retrievable over HTTP" >&2; exit 1
