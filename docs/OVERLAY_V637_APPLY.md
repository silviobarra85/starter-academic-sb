# Overlay V637 - applicazione

```bash
cp -R ~/Downloads/fantacalcio_overlay_sudatori_iosudo_v637_aggiornamento_globale_alias/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_sudatori_iosudo_v637_aggiornamento_globale_alias/docs/* docs/
```

```bash
node static/fanta-engine/tools/audit-sudatori-section-v637.mjs
node static/fanta-engine/tools/audit-iosudo-v637.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v637.js
node --check static/iosudo/sw.js
```
