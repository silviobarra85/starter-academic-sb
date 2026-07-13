# Applicazione overlay V639

```bash
cp -R ~/Downloads/fantacalcio_overlay_sudatori_iosudo_v639_aggiornamento_globale_v15_sources/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_sudatori_iosudo_v639_aggiornamento_globale_v15_sources/docs/* docs/
```

```bash
node static/fanta-engine/tools/audit-sudatori-section-v639.mjs
node static/fanta-engine/tools/audit-iosudo-v639.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v639.js
node --check static/iosudo/sw.js
```
