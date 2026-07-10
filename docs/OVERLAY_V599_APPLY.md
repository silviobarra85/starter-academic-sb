# Overlay V599 apply

```bash
cp -R ~/Downloads/fantacalcio_overlay_sudatori_v599_tmw_aggiornato/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_sudatori_v599_tmw_aggiornato/docs/* docs/

node static/fanta-engine/tools/audit-sudatori-section-v599.mjs
node --check static/fanta-engine/js/sections/sudatori-section-v599.js
```
