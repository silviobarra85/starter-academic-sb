# Overlay V604 - applicazione

```bash
cp -R ~/Downloads/fantacalcio_overlay_sudatori_v604_market_badges_fix/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_sudatori_v604_market_badges_fix/docs/* docs/
```

Verifiche:

```bash
node static/fanta-engine/tools/audit-sudatori-section-v604.mjs
node --check static/fanta-engine/js/sections/sudatori-section-v604.js
```
