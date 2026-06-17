#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
rm -f \
  "$ROOT/assets/js/core/fanta-petillo-setup-kit-v458.js" \
  "$ROOT/assets/js/core/fanta-petillo-real-data-validator-v459.js" \
  "$ROOT/assets/js/core/fanta-petillo-firestore-seed-preview-v460.js" \
  "$ROOT/assets/js/core/fanta-petillo-firestore-import-v461.js" \
  "$ROOT/assets/js/core/fanta-petillo-real-data-workflow-v462.js" \
  "$ROOT/assets/js/core/fanta-petillo-public-snapshot-builder-v463.js" \
  "$ROOT/assets/js/core/fanta-petillo-team-area-readiness-v464.js" \
  "$ROOT/assets/js/core/fanta-petillo-launch-readiness-v465.js" \
  "$ROOT/assets/css/refactor/fanta-petillo-setup-kit-v458.css" \
  "$ROOT/assets/css/refactor/fanta-petillo-real-data-validator-v459.css" \
  "$ROOT/assets/css/refactor/fanta-petillo-firestore-seed-preview-v460.css" \
  "$ROOT/assets/css/refactor/fanta-petillo-firestore-import-v461.css" \
  "$ROOT/assets/css/refactor/fanta-petillo-real-data-workflow-v462.css" \
  "$ROOT/assets/css/refactor/fanta-petillo-public-snapshot-builder-v463.css" \
  "$ROOT/assets/css/refactor/fanta-petillo-team-area-readiness-v464.css" \
  "$ROOT/assets/css/refactor/fanta-petillo-launch-readiness-v465.css" \
  "$ROOT/tools/fantapetillo-placeholder-seed-v457.json" \
  "$ROOT/tools/audit-placeholder-data-v457.mjs" \
  "$ROOT/tools/audit-setup-kit-v458.mjs" \
  "$ROOT/tools/audit-real-data-validator-v459.mjs" \
  "$ROOT/tools/audit-firestore-seed-preview-v460.mjs" \
  "$ROOT/tools/audit-firestore-import-v461.mjs" \
  "$ROOT/tools/audit-real-data-workflow-v462.mjs" \
  "$ROOT/tools/audit-public-snapshot-builder-v463.mjs" \
  "$ROOT/tools/audit-team-area-readiness-v464.mjs" \
  "$ROOT/tools/audit-launch-readiness-v465.mjs"
rm -f \
  "$ROOT/assets/rose/2026-2027-placeholder.json" \
  "$ROOT/assets/competitions/campionato-2026-2027.json" \
  "$ROOT/assets/competitions/coppa-italia-2026-2027.json" \
  "$ROOT/assets/competitions/playoff-2026-2027.json"
rm -rf "$ROOT/assets/setup"
printf 'Cleanup standard Admin V468 completato. Restano il setup standard Admin e lo share Netlify.\n'
