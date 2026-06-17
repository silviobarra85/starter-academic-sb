#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SITE_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
failures=0
fail(){ printf 'FAIL: %s\n' "$1" >&2; failures=$((failures+1)); }
pass(){ printf 'OK: %s\n' "$1"; }
if command -v node >/dev/null 2>&1; then
  while IFS= read -r -d '' js_file; do node --check "$js_file" >/dev/null; done < <(find "$SITE_ROOT/assets" -name '*.js' -type f -print0)
  pass "node --check clone completato"
else
  fail "node non disponibile"
fi
if command -v python3 >/dev/null 2>&1; then
  SITE_ROOT_JSON="$SITE_ROOT" python3 - <<'PYJSON'
import json
import os
from pathlib import Path
root = Path(os.environ["SITE_ROOT_JSON"]) / "assets"
for path in root.rglob("*.json"):
    with path.open("r", encoding="utf-8") as handle:
        json.load(handle)
PYJSON
  pass "JSON clone validi"
fi
if grep -q 'zonaorientale-d07af' "$SITE_ROOT/assets/firebase.js"; then fail "firebase ZonaOrientale presente nel clone"; else pass "Firebase ZonaOrientale assente dal clone"; fi
if grep -q '"adminOnboardingEnabled": true' "$SITE_ROOT/assets/league-config.json"; then pass "config onboarding Admin V451"; elif grep -q '"firebaseConnected": "admin-bootstrap-v450"' "$SITE_ROOT/assets/league-config.json"; then pass "config Admin bootstrap V450"; else fail "config Firebase clone non esplicita stato sicuro"; fi
versions="$(grep -Roh '?v=[0-9][0-9]*' "$SITE_ROOT"/*.html | sed 's/?v=//' | sort -u | tr '\n' ' ' | sed 's/[[:space:]]*$//')"
if [[ "$versions" == "469" ]]; then pass "cache-buster clone V469"; else fail "cache-buster clone non allineati: $versions"; fi
if command -v node >/dev/null 2>&1; then
  if node "$SITE_ROOT/tools/audit-admin-bootstrap-v450.mjs" --quiet; then pass "audit Admin bootstrap V450"; else fail "audit Admin bootstrap V450"; fi
  if node "$SITE_ROOT/tools/audit-admin-onboarding-v451.mjs" --quiet; then pass "audit Admin onboarding V451"; else fail "audit Admin onboarding V451"; fi
  if node "$SITE_ROOT/tools/audit-favicon-v455.mjs" --quiet; then pass "audit favicon V455"; else fail "audit favicon V455"; fi
  if node "$SITE_ROOT/tools/audit-regolamento-v453.mjs" --quiet; then pass "audit regolamento V453"; else fail "audit regolamento V453"; fi
  if node "$SITE_ROOT/tools/audit-admin-card-visibility-v456.mjs" --quiet; then pass "audit selettore card Admin V456 compatibile"; else fail "audit selettore card Admin V456 compatibile"; fi
  if node "$SITE_ROOT/tools/audit-standard-admin-cleanup-v468.mjs" --quiet; then pass "audit setup standard Admin V469"; else fail "audit setup standard Admin V469"; fi
  if node "$SITE_ROOT/tools/audit-share-netlify-v466.mjs" --quiet; then pass "audit share Netlify V466"; else fail "audit share Netlify V466"; fi
else
  fail "node non disponibile per audit runtime clone"
fi
if [[ "$failures" -gt 0 ]]; then exit 1; fi
printf 'Controlli clone setup standard Admin V469 passati.\n'
