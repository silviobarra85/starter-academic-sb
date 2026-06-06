# Test V389 - Soccer Data assets cleanup

## Verifiche automatiche

```bash
node tools/audit-soccer-data-assets-cleanup-v389.mjs
node tools/audit-soccer-data-admin-only-v386.mjs
node tools/audit-soccer-data-mobile-table-v387.mjs
node tools/audit-admin-snapshot-dates-v388.mjs
node tools/audit-soccer-data-fbref-batch-v383.mjs
node --check assets/app.js
find assets -name '*.js' -type f -print0 | xargs -0 -n 1 node --check
```

## Esito atteso

- Gli asset pubblici Soccer Data restano ridotti a `manifest.json`, `fbref-player-map.v383.json` e `stats/manifest.json`.
- Gli storici sono presenti nei docs archive.
- Il mapping V383 resta valido.
- Soccer Data resta solo admin.
- Nessuna scrittura Firebase e nessuno scraping live.
