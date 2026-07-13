# Applicazione overlay V643

## Con GitHub Actions da smartphone

Caricare lo zip in `incoming/overlays/` e fare commit. La workflow applica l'overlay automaticamente.

## Da Mac

```bash
cp -R ~/Downloads/fantacalcio_overlay_sudatori_iosudo_v643_aggiornamento_globale_v18/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_sudatori_iosudo_v643_aggiornamento_globale_v18/docs/* docs/
```

Controlli:

```bash
node static/fanta-engine/tools/audit-sudatori-section-v643.mjs
node static/fanta-engine/tools/audit-iosudo-v643.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v643.js
node --check static/iosudo/sw.js
```
