# Applicazione overlay V600

```bash
cp -R ~/Downloads/fantacalcio_overlay_sudatori_v600_excel_serale/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_sudatori_v600_excel_serale/docs/* docs/
```

Controlli:

```bash
node static/fanta-engine/tools/audit-sudatori-section-v600.mjs
node --check static/fanta-engine/js/sections/sudatori-section-v600.js
```
