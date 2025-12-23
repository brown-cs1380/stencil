#!/usr/bin/env bash

# Check if we are inside a git repository, otherwise exit
if ! git rev-parse --is-inside-work-tree &> /dev/null; then
    echo "[pretest] not insde a git repository, make sure your project is under git version control" >&2
    exit 1
fi

TOP_LEVEL=$(git rev-parse --show-toplevel)
cd "$TOP_LEVEL" || exit 1

if [ ! -d "node_modules" ]; then
    npm install
fi

if [ ! -d "non-distribution/node_modules" ]; then
    cd non-distribution || exit 1
    npm install
fi
