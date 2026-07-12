# Overlay V613 - Applicazione

Applicare dalla root del repository, dopo aver decompresso lo zip in `~/Downloads/fantacalcio_overlay_iosudo_v613_market_source_links`.

```bash
cp -R ~/Downloads/fantacalcio_overlay_iosudo_v613_market_source_links/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_iosudo_v613_market_source_links/docs/* docs/
```

## Verifiche

```bash
node static/fanta-engine/tools/audit-iosudo-v613.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v613.js
node --check static/iosudo/sw.js
```
