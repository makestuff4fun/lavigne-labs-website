#!/usr/bin/env bash
# Launch Claude Code for this project.
#
# The ACCOUNT POLICY lives in ~/projects/the-den/bin/claude-start.sh:
#   personal -> slot 4 (jtombarrett@gmail.com 1-year setup-token)
#   work     -> slot 1 (brian@humanarchive.ai, the work Team seat)
set -euo pipefail
cd "$(dirname "$0")"

confirm_channel() {
    local pane="$TMUX_PANE" text sel i
    for i in $(seq 1 60); do
        sleep 1
        text=$(tmux capture-pane -p -t "$pane" 2>/dev/null) || return 0
        grep -qi 'development channel' <<<"$text" || continue
        sel=$(grep -m1 '❯' <<<"$text" || true)
        if grep -qiE 'local development|I am using' <<<"$sel" && ! grep -qiE 'exit|\bno\b' <<<"$sel"; then
            tmux send-keys -t "$pane" Enter
        else
            echo "start-claude: development-channel dialog not recognised; confirm it by hand" >&2
        fi
        return 0
    done
}
if [ -n "${TMUX:-}" ] && [ -n "${TMUX_PANE:-}" ]; then
    confirm_channel </dev/null >/dev/null 2>&1 &
fi

exec "$HOME/projects/the-den/bin/claude-start.sh" personal --dangerously-load-development-channels server:den "$@"
