# Overlay V607 - Applicazione

Comandi di copia:

```bash
cp -R ~/Downloads/fantacalcio_overlay_sudatori_v607_excel_finale/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_sudatori_v607_excel_finale/docs/* docs/
```

Controlli:

```bash
node static/fanta-engine/tools/audit-sudatori-section-v607.mjs
node --check static/fanta-engine/js/sections/sudatori-section-v607.js
```
