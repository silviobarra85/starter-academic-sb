# Overlay V603 - applicazione

```bash
cp -R ~/Downloads/fantacalcio_overlay_sudatori_v603_market_badges_gaetano_giovane/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_sudatori_v603_market_badges_gaetano_giovane/docs/* docs/
```

Verifiche:

```bash
node static/fanta-engine/tools/audit-sudatori-section-v603.mjs
node --check static/fanta-engine/js/sections/sudatori-section-v603.js
```
