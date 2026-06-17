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
  "$ROOT/assets/css/refactor/fanta-petillo-setup-kit-v458.css" \
  "$ROOT/assets/css/refactor/fanta-petillo-real-data-validator-v459.css" \
  "$ROOT/assets/css/refactor/fanta-petillo-firestore-seed-preview-v460.css" \
  "$ROOT/assets/css/refactor/fanta-petillo-firestore-import-v461.css" \
  "$ROOT/assets/css/refactor/fanta-petillo-real-data-workflow-v462.css" \
  "$ROOT/assets/css/refactor/fanta-petillo-public-snapshot-builder-v463.css" \
  "$ROOT/assets/css/refactor/fanta-petillo-team-area-readiness-v464.css" \
  "$ROOT/tools/fantapetillo-placeholder-seed-v457.json" \
  "$ROOT/tools/audit-placeholder-data-v457.mjs" \
  "$ROOT/tools/audit-setup-kit-v458.mjs" \
  "$ROOT/tools/audit-real-data-validator-v459.mjs" \
  "$ROOT/tools/audit-firestore-seed-preview-v460.mjs" \
  "$ROOT/tools/audit-firestore-import-v461.mjs" \
  "$ROOT/tools/audit-real-data-workflow-v462.mjs" \
  "$ROOT/tools/audit-public-snapshot-builder-v463.mjs" \
  "$ROOT/tools/audit-team-area-readiness-v464.mjs"
printf 'Cleanup standard Admin V467 completato.\n'
