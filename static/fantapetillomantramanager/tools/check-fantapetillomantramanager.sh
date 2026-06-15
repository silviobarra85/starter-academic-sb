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
  while IFS= read -r -d '' json_file; do python3 -m json.tool "$json_file" >/dev/null; done < <(find "$SITE_ROOT/assets" -name '*.json' -type f -print0)
  pass "JSON clone validi"
fi
if grep -q 'zonaorientale-d07af' "$SITE_ROOT/assets/firebase.js"; then fail "firebase ZonaOrientale presente nel clone"; else pass "Firebase ZonaOrientale assente dal clone"; fi
if grep -q '"adminOnboardingEnabled": true' "$SITE_ROOT/assets/league-config.json"; then pass "config onboarding Admin V451"; elif grep -q '"firebaseConnected": "admin-bootstrap-v450"' "$SITE_ROOT/assets/league-config.json"; then pass "config Admin bootstrap V450"; else fail "config Firebase clone non esplicita stato sicuro"; fi
versions="$(grep -Roh '?v=[0-9][0-9]*' "$SITE_ROOT"/*.html | sed 's/?v=//' | sort -u | tr '\n' ' ' | sed 's/[[:space:]]*$//')"
if [[ "$versions" == "453" ]]; then pass "cache-buster clone V453"; else fail "cache-buster clone non allineati: $versions"; fi
if command -v node >/dev/null 2>&1; then
  if node "$SITE_ROOT/tools/audit-admin-bootstrap-v450.mjs" --quiet; then pass "audit Admin bootstrap V450"; else fail "audit Admin bootstrap V450"; fi
  if node "$SITE_ROOT/tools/audit-admin-onboarding-v451.mjs" --quiet; then pass "audit Admin onboarding V451"; else fail "audit Admin onboarding V451"; fi
  if node "$SITE_ROOT/tools/audit-favicon-v452.mjs" --quiet; then pass "audit favicon V452"; else fail "audit favicon V452"; fi
  if node "$SITE_ROOT/tools/audit-regolamento-v453.mjs" --quiet; then pass "audit regolamento V453"; else fail "audit regolamento V453"; fi
else
  fail "node non disponibile per audit runtime clone"
fi
if [[ "$failures" -gt 0 ]]; then exit 1; fi
printf 'Controlli clone regolamento V453 passati.\n'
