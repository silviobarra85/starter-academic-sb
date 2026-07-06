#!/usr/bin/env bash
set -euo pipefail

# V584 cleanup: remove experimental/obsolete mobile player-table and resize assets.
# Run from repository root: bash static/fanta-engine/tools/cleanup-player-tables-mobile-v584.sh

rm -f \
  static/fanta-engine/css/roster-sticky-first-col-v567.css \
  static/fanta-engine/css/roster-mobile-column-fit-v568.css \
  static/fanta-engine/css/teamarea-roster-first-col-compact-v569.css \
  static/fanta-engine/css/table-column-resizer-v570.css \
  static/fanta-engine/css/table-column-resizer-v571.css \
  static/fanta-engine/css/player-tables-mobile-v572.css \
  static/fanta-engine/css/player-tables-mobile-v573.css \
  static/fanta-engine/css/player-tables-mobile-v574.css \
  static/fanta-engine/css/player-tables-mobile-v575.css \
  static/fanta-engine/css/player-tables-mobile-v576.css \
  static/fanta-engine/css/player-tables-mobile-v577.css \
  static/fanta-engine/css/player-tables-mobile-v578.css \
  static/fanta-engine/css/player-tables-mobile-v579.css \
  static/fanta-engine/css/player-tables-mobile-v580.css \
  static/fanta-engine/css/player-tables-mobile-v581.css \
  static/fanta-engine/css/player-tables-mobile-v582.css \
  static/fanta-engine/css/player-tables-mobile-v583.css \
  static/fanta-engine/js/ui/table-column-resizer-v570.js \
  static/fanta-engine/js/ui/table-column-resizer-v571.js \
  static/fanta-engine/js/ui/player-tables-mobile-v575.js \
  static/fanta-engine/js/ui/player-tables-mobile-v576.js \
  static/fanta-engine/js/ui/player-tables-mobile-v577.js \
  static/fanta-engine/js/ui/player-tables-mobile-v578.js \
  static/fanta-engine/js/ui/player-tables-mobile-v579.js \
  static/fanta-engine/js/ui/player-tables-mobile-v580.js \
  static/fanta-engine/js/ui/player-tables-mobile-v581.js \
  static/fanta-engine/js/ui/player-tables-mobile-v582.js \
  static/fanta-engine/js/ui/player-tables-mobile-v583.js \
  static/fanta-engine/tools/audit-roster-sticky-first-col-v567.mjs \
  static/fanta-engine/tools/audit-roster-mobile-column-fit-v568.mjs \
  static/fanta-engine/tools/audit-teamarea-roster-first-col-v569.mjs \
  static/fanta-engine/tools/audit-table-column-resizer-v570.mjs \
  static/fanta-engine/tools/audit-table-column-resizer-v571.mjs \
  static/fanta-engine/tools/audit-player-tables-mobile-v572.mjs \
  static/fanta-engine/tools/audit-player-tables-mobile-v573.mjs \
  static/fanta-engine/tools/audit-player-tables-mobile-v574.mjs \
  static/fanta-engine/tools/audit-player-tables-mobile-v575.mjs \
  static/fanta-engine/tools/audit-player-tables-mobile-v576.mjs \
  static/fanta-engine/tools/audit-player-tables-mobile-v577.mjs \
  static/fanta-engine/tools/audit-player-tables-mobile-v578.mjs \
  static/fanta-engine/tools/audit-player-tables-mobile-v579.mjs \
  static/fanta-engine/tools/audit-player-tables-mobile-v580.mjs \
  static/fanta-engine/tools/audit-player-tables-mobile-v581.mjs \
  static/fanta-engine/tools/audit-player-tables-mobile-v582.mjs \
  static/fanta-engine/tools/audit-player-tables-mobile-v583.mjs

echo "V584 cleanup completed."
