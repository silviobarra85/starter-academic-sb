# Overlay V597 apply

```bash
cp -R ~/Downloads/fantacalcio_overlay_sudatori_v597_excel_formazioni_coerenti/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_sudatori_v597_excel_formazioni_coerenti/docs/* docs/

node static/fanta-engine/tools/audit-sudatori-section-v597.mjs
node --check static/fanta-engine/js/sections/sudatori-section-v597.js
```
