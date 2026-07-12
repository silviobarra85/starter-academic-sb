# Overlay V608 - applicazione

```bash
cp -R ~/Downloads/fantacalcio_overlay_sudatori_v608_excel_2026_07_12_market_summary/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_sudatori_v608_excel_2026_07_12_market_summary/docs/* docs/

node static/fanta-engine/tools/audit-sudatori-section-v608.mjs
node --check static/fanta-engine/js/sections/sudatori-section-v608.js
```
