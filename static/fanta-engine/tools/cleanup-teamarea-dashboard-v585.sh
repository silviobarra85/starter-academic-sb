#!/usr/bin/env bash
set -euo pipefail

# V585 cleanup: keep the consolidated V584 player-table layer and V585 teamarea layer,
# remove obsolete experimental table resize/style assets if they are still present.
# Run from repository root:
#   bash static/fanta-engine/tools/cleanup-teamarea-dashboard-v585.sh

if [ -f static/fanta-engine/tools/cleanup-player-tables-mobile-v584.sh ]; then
  bash static/fanta-engine/tools/cleanup-player-tables-mobile-v584.sh
fi

rm -f \
  static/fanta-engine/css/table-column-resizer-v570.css \
  static/fanta-engine/css/table-column-resizer-v571.css \
  static/fanta-engine/js/ui/table-column-resizer-v570.js \
  static/fanta-engine/js/ui/table-column-resizer-v571.js \
  static/fanta-engine/tools/audit-table-column-resizer-v570.mjs \
  static/fanta-engine/tools/audit-table-column-resizer-v571.mjs

echo "V585 cleanup completed."
