# Applicazione overlay V640

```bash
cp -R ~/Downloads/fantacalcio_overlay_sudatori_iosudo_v640_aggiornamento_globale_v16_sources/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_sudatori_iosudo_v640_aggiornamento_globale_v16_sources/docs/* docs/
```

```bash
node static/fanta-engine/tools/audit-sudatori-section-v640.mjs
node static/fanta-engine/tools/audit-iosudo-v640.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v640.js
node --check static/iosudo/sw.js
```
