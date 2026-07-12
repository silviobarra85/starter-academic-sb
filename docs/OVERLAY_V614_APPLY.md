# Overlay V614 - applicazione

```bash
cp -R ~/Downloads/fantacalcio_overlay_sudatori_v614_pulizia_ufficialita/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_sudatori_v614_pulizia_ufficialita/docs/* docs/
```

Controlli:

```bash
node static/fanta-engine/tools/audit-sudatori-section-v614.mjs
node --check static/fanta-engine/js/sections/sudatori-section-v614.js
```
