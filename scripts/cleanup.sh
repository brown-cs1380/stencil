#!/usr/bin/env bash

top=$(git rev-parse --show-toplevel)

kill_by_pattern() {
    pattern="$1"
    if command -v pkill >/dev/null 2>&1; then
        pkill -f "$pattern"
    fi
}

kill_by_port() {
    port="$1"
    lsof -ti tcp:"$port" | xargs -r kill
}

cd "$top" || exit 1

all_ports=$(grep -Rho 'port: [0-9]\+' "$top/test" | cut -d' ' -f2 | sort -n  | uniq)

warn_distribution_listeners() {
    if ! command -v lsof >/dev/null 2>&1; then
        return
    fi

    matches=$(lsof -nP -iTCP -sTCP:LISTEN 2>/dev/null | grep -i "distribution" || true)
    if [ -n "$matches" ]; then
        echo "[cleanup] WARNING: found processes with 'distribution' in name listening on ports:"
        echo "$matches"
    fi
}

# Try to stop spawned nodes that run the project entrypoints.
kill_by_pattern "node .*distribution.js"
kill_by_pattern "node .*config.js"
for port in $all_ports; do
    kill_by_port "$port"
done

warn_distribution_listeners

echo "[cleanup] done"
