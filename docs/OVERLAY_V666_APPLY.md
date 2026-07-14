# Overlay V666 - fix audit GitHub Action

Questo overlay ripubblica la V665 e aggiunge un audit `audit-iosudo-v665.mjs` compatibile con lo script automatico `apply-overlay-from-zip.sh`.

Motivo: la Action eseguiva ancora `audit-iosudo-v658.mjs`, che falliva quando `static/iosudo/index.html` puntava correttamente alla shell V665.

Non contiene la cartella root `tools/` e non sovrascrive lo script mentre la Action lo esegue.
