#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
rm -f \
  "$ROOT/tools/audit-fantapetillo-sandbox-v447.mjs" \
  "$ROOT/tools/audit-fantapetillo-clone-qa-v448.mjs" \
  "$ROOT/tools/audit-fantapetillo-firebase-v449.mjs" \
  "$ROOT/tools/audit-fantapetillo-admin-bootstrap-v450.mjs" \
  "$ROOT/tools/audit-fantapetillo-admin-onboarding-v451.mjs" \
  "$ROOT/tools/audit-fantapetillo-favicon-v452.mjs" \
  "$ROOT/tools/audit-fantapetillo-regolamento-v453.mjs" \
  "$ROOT/tools/audit-fantapetillo-favicon-v455.mjs" \
  "$ROOT/tools/audit-fantapetillo-placeholder-data-v457.mjs" \
  "$ROOT/tools/audit-fantapetillo-setup-kit-v458.mjs" \
  "$ROOT/tools/audit-fantapetillo-real-data-validator-v459.mjs" \
  "$ROOT/tools/audit-fantapetillo-firestore-seed-preview-v460.mjs" \
  "$ROOT/tools/audit-fantapetillo-firestore-import-v461.mjs" \
  "$ROOT/tools/audit-fantapetillo-real-data-workflow-v462.mjs" \
  "$ROOT/tools/audit-fantapetillo-public-snapshot-builder-v463.mjs" \
  "$ROOT/tools/audit-fantapetillo-team-area-readiness-v464.mjs" \
  "$ROOT/tools/audit-fantapetillo-launch-readiness-v465.mjs" \
  "$ROOT/tools/audit-fantapetillo-share-netlify-v466.mjs" \
  "$ROOT/tools/audit-fantapetillo-standard-admin-cleanup-v467.mjs"
printf 'Cleanup audit cross-lega V468 completato. Il check ZonaOrientale non dipende più dal clone.\n'
