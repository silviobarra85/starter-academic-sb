#!/usr/bin/env bash
set -euo pipefail

HUGO_VERSION_PIN="0.80.0"
HUGO_DIR="/tmp/hugo-${HUGO_VERSION_PIN}"
HUGO_BIN="${HUGO_DIR}/hugo"
HUGO_ARCHIVE="/tmp/hugo_extended_${HUGO_VERSION_PIN}_Linux-64bit.tar.gz"
HUGO_URL="https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION_PIN}/hugo_extended_${HUGO_VERSION_PIN}_Linux-64bit.tar.gz"

if [ ! -x "$HUGO_BIN" ]; then
  echo "Installing Hugo extended ${HUGO_VERSION_PIN} for this build..."
  rm -rf "$HUGO_DIR"
  mkdir -p "$HUGO_DIR"
  curl -fsSL "$HUGO_URL" -o "$HUGO_ARCHIVE"
  tar -xzf "$HUGO_ARCHIVE" -C "$HUGO_DIR"
  chmod +x "$HUGO_BIN"
fi

echo "Using Hugo binary: $HUGO_BIN"
"$HUGO_BIN" version

base_url="${URL:-}"
if [ "${CONTEXT:-}" != "production" ] && [ -n "${DEPLOY_PRIME_URL:-}" ]; then
  base_url="$DEPLOY_PRIME_URL"
fi
if [ -z "$base_url" ]; then
  base_url="https://silviobarra.com"
fi

echo "Running V760 source contract audit..."
node static/zonaorientale/tools/audit-static-first-v760.mjs .

echo "Running V761 event-loop safety audit..."
node static/zonaorientale/tools/audit-admin-card-loop-v761.mjs .

echo "Building site with base URL: $base_url"
"$HUGO_BIN" --gc --minify -b "$base_url"

echo "Running V760 published artifact audit..."
node static/zonaorientale/tools/audit-static-first-v760.mjs public

echo "Running V761 published event-loop safety audit..."
node static/zonaorientale/tools/audit-admin-card-loop-v761.mjs public
