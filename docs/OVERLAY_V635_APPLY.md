# Overlay V635 - ioSudo ruoli e squadra attuale giocatori

## Applicazione

```bash
cp -R ~/Downloads/fantacalcio_overlay_sudatori_iosudo_v635_ruoli_listone/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_sudatori_iosudo_v635_ruoli_listone/docs/* docs/
```

## Controlli

```bash
node static/fanta-engine/tools/audit-sudatori-section-v635.mjs
node static/fanta-engine/tools/audit-iosudo-v635.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v635.js
node --check static/iosudo/sw.js
```
