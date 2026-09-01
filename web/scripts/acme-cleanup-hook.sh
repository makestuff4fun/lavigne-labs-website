#!/usr/bin/env bash
# certbot --manual-cleanup-hook: drop the challenge file again.
set -euo pipefail
sudo -u bairui -H ssh -o BatchMode=yes -o ConnectTimeout=20 tunnel-bear \
  "~/acme-put.sh --rm '$CERTBOT_TOKEN'" || true
