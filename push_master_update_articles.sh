#!/usr/bin/env bash
set -euo pipefail

# Push helper for ZonaOrientale article/manifest updates.
# Usage:
#   ./push_master_update_articles.sh
#   ./push_master_update_articles.sh "data: aggiorna articoli calciomercato"
#
# Optional env vars:
#   WORK_BRANCH=refactor/260528-zonaorientale-next
#   MASTER_BRANCH=master

WORK_BRANCH="${WORK_BRANCH:-refactor/260528-zonaorientale-next}"
MASTER_BRANCH="${MASTER_BRANCH:-master}"
COMMIT_MESSAGE="${1:-data: aggiorna manifest e articoli calciomercato}"
MERGE_MESSAGE="merge: aggiorna articoli calciomercato"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "ERRORE: esegui lo script dentro la repo Git." >&2
  exit 1
fi

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

echo "== Repo =="
echo "$REPO_ROOT"
echo

echo "== Recupero branch remoti =="
git fetch origin

current_branch="$(git branch --show-current)"
if [ "$current_branch" != "$WORK_BRANCH" ]; then
  echo "Passo da $current_branch a $WORK_BRANCH"
  git checkout "$WORK_BRANCH"
fi

echo "== Allineo $WORK_BRANCH =="
git pull --ff-only origin "$WORK_BRANCH"

echo "== Pulizia file macOS locali =="
if [ -x "static/zonaorientale/tools/cleanup-macos-artifacts-v283.sh" ]; then
  static/zonaorientale/tools/cleanup-macos-artifacts-v283.sh --apply
else
  find static/zonaorientale docs/zonaorientale \
    \( -name ".DS_Store" -o -name "._*" -o -name "__MACOSX" -o -name ".AppleDouble" -o -name ".LSOverride" \) \
    -exec rm -rf {} + 2>/dev/null || true
fi

echo "== Aggiungo solo manifest/articoli Calciomercato =="
# Intenzionalmente limitato ai dati Calciomercato per evitare di committare modifiche non volute.
CALCIOMERCATO_PATHS=(
  "static/zonaorientale/assets/calciomercato"
  "docs/zonaorientale/calciomercato"
)

git add "${CALCIOMERCATO_PATHS[@]}"

if git diff --cached --quiet; then
  echo "Nessuna modifica Calciomercato da committare."
else
  echo "== Commit dati =="
  git status --short
  git commit -m "$COMMIT_MESSAGE"
fi

if [ -n "$(git status --porcelain)" ]; then
  echo
  echo "ERRORE: restano modifiche non committate fuori dai percorsi Calciomercato." >&2
  echo "Controlla con: git status" >&2
  git status --short >&2
  exit 1
fi

echo "== Controlli pre-push =="
if [ -x "static/zonaorientale/tools/check-zonaorientale.sh" ]; then
  static/zonaorientale/tools/check-zonaorientale.sh
else
  echo "WARN: static/zonaorientale/tools/check-zonaorientale.sh non trovato o non eseguibile."
fi

if [ -f "netlify/functions/calciomercato-feed.js" ]; then
  node --check netlify/functions/calciomercato-feed.js
fi

echo "== Push branch di lavoro =="
git push origin "$WORK_BRANCH"

echo "== Merge su $MASTER_BRANCH =="
git checkout "$MASTER_BRANCH"
git pull --ff-only origin "$MASTER_BRANCH"
git merge --no-ff "$WORK_BRANCH" -m "$MERGE_MESSAGE"
git push origin "$MASTER_BRANCH"

echo "== Ritorno su $WORK_BRANCH e riallineo =="
git checkout "$WORK_BRANCH"
git merge "$MASTER_BRANCH"
git push origin "$WORK_BRANCH"

echo "== Stato finale =="
git status
git log --oneline --decorate -5

echo
 echo "OK: aggiornamento manifest/articoli pubblicato su $MASTER_BRANCH e branch $WORK_BRANCH riallineato."
