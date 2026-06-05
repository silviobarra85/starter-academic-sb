# Release V363 - Manual QA stability

## Tipo

Fix UX Admin QA.

## Summary

Stabilizza la checklist QA Admin e il pannello simulatore trade target presidente.

## Cambiamenti

- Card simulatore full-width.
- Select destinatario responsive.
- Auto-refresh non distruttivo.
- Info `i` persistente mentre aperta.
- Istruzioni di test presidente chiarite.

## Test

- `node --check static/zonaorientale/assets/app.js`
- `static/zonaorientale/tools/audit-manual-qa-stability-v363.mjs`
- `static/zonaorientale/tools/check-zonaorientale.sh`
- `static/zonaorientale/tools/audit-assets-v298.sh --quiet`
- `static/zonaorientale/tools/audit-css-v300.sh`
