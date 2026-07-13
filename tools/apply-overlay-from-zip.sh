#!/usr/bin/env bash
set -euo pipefail

OVERLAY_PATH="${1:-}"
COMMIT_MESSAGE="${2:-}"

ROOT_DIR="$(pwd)"
INCOMING_DIR="incoming/overlays"
TMP_DIR="$(mktemp -d)"

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

find_latest_zip() {
  find "$INCOMING_DIR" -maxdepth 1 -type f -name '*.zip' | sort -V | tail -n 1
}

if [ -z "$OVERLAY_PATH" ]; then
  OVERLAY_PATH="$(find_latest_zip || true)"
fi

if [ -z "$OVERLAY_PATH" ] || [ ! -f "$OVERLAY_PATH" ]; then
  echo "Nessuno zip overlay trovato. Carica uno zip in $INCOMING_DIR oppure passa overlay_path."
  exit 1
fi

OVERLAY_BASENAME="$(basename "$OVERLAY_PATH")"
echo "Overlay selezionato: $OVERLAY_PATH"

unzip -q "$OVERLAY_PATH" -d "$TMP_DIR/unpacked"

# Gestisce sia zip con cartella radice sia zip con static/docs direttamente in radice.
OVERLAY_ROOT="$TMP_DIR/unpacked"
if [ ! -d "$OVERLAY_ROOT/static" ] && [ ! -d "$OVERLAY_ROOT/docs" ] && [ ! -d "$OVERLAY_ROOT/.github" ] && [ ! -d "$OVERLAY_ROOT/tools" ]; then
  TOP_LEVEL_DIRS=$(find "$OVERLAY_ROOT" -mindepth 1 -maxdepth 1 -type d | wc -l | tr -d ' ')
  if [ "$TOP_LEVEL_DIRS" = "1" ]; then
    OVERLAY_ROOT="$(find "$OVERLAY_ROOT" -mindepth 1 -maxdepth 1 -type d | head -n 1)"
  fi
fi

echo "Radice overlay: $OVERLAY_ROOT"

copy_dir_contents() {
  local src="$1"
  local dst="$2"
  if [ -d "$src" ]; then
    mkdir -p "$dst"
    cp -R "$src/." "$dst/"
    echo "Copiato: $src -> $dst"
  fi
}

copy_dir_contents "$OVERLAY_ROOT/static" "$ROOT_DIR/static"
copy_dir_contents "$OVERLAY_ROOT/docs" "$ROOT_DIR/docs"
copy_dir_contents "$OVERLAY_ROOT/.github" "$ROOT_DIR/.github"
copy_dir_contents "$OVERLAY_ROOT/tools" "$ROOT_DIR/tools"
copy_dir_contents "$OVERLAY_ROOT/incoming" "$ROOT_DIR/incoming"

run_latest_node_script() {
  local pattern="$1"
  local latest
  latest="$(ls $pattern 2>/dev/null | sort -V | tail -n 1 || true)"
  if [ -n "$latest" ]; then
    echo "Eseguo: node $latest"
    node "$latest"
  else
    echo "Nessun file trovato per pattern: $pattern"
  fi
}

check_latest_js() {
  local pattern="$1"
  local latest
  latest="$(ls $pattern 2>/dev/null | sort -V | tail -n 1 || true)"
  if [ -n "$latest" ]; then
    echo "Controllo sintassi: node --check $latest"
    node --check "$latest"
  else
    echo "Nessun JS trovato per pattern: $pattern"
  fi
}

echo "Eseguo audit e controlli sintassi se disponibili..."
run_latest_node_script "static/fanta-engine/tools/audit-sudatori-section-v*.mjs"
run_latest_node_script "static/fanta-engine/tools/audit-iosudo-v*.mjs"
check_latest_js "static/fanta-engine/js/sections/sudatori-section-v*.js"
check_latest_js "static/fanta-engine/js/apps/iosudo-app-v*.js"
if [ -f "static/iosudo/sw.js" ]; then
  echo "Controllo sintassi: node --check static/iosudo/sw.js"
  node --check static/iosudo/sw.js
fi

# Rimuove lo zip processato per evitare ri-esecuzioni sullo stesso file.
rm -f "$OVERLAY_PATH"

git config user.name "github-actions[bot]"
git config user.email "41898282+github-actions[bot]@users.noreply.github.com"

git add -A static docs .github tools incoming

if git diff --cached --quiet; then
  echo "Nessuna modifica da committare."
  exit 0
fi

if [ -z "$COMMIT_MESSAGE" ]; then
  COMMIT_MESSAGE="[apply-overlay] applica ${OVERLAY_BASENAME}"
else
  COMMIT_MESSAGE="[apply-overlay] ${COMMIT_MESSAGE}"
fi

echo "Commit: $COMMIT_MESSAGE"
git commit -m "$COMMIT_MESSAGE"

echo "Push su ${GITHUB_REF_NAME:-master}"
git push origin "HEAD:${GITHUB_REF_NAME:-master}"

echo "Overlay applicato correttamente."
