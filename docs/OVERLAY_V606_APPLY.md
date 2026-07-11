# Overlay V606 - applicazione

```bash
cp -R ~/Downloads/fantacalcio_overlay_sudatori_v606_excel_pomeriggio/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_sudatori_v606_excel_pomeriggio/docs/* docs/

node static/fanta-engine/tools/audit-sudatori-section-v606.mjs
node --check static/fanta-engine/js/sections/sudatori-section-v606.js
```
