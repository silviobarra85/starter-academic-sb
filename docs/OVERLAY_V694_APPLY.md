# Overlay V694

Applicazione manuale:

```bash
cp -R fantacalcio_overlay_v694_iosudo_site_v41/static/* static/
cp -R fantacalcio_overlay_v694_iosudo_site_v41/docs/* docs/
node static/fanta-engine/tools/audit-iosudo-v694.mjs
node static/fanta-engine/tools/audit-site-mobile-profile-v694.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v694.js
node --check static/iosudo/sw.js
node --check static/zonaorientale/assets/app.js
node --check static/fantapetillomantramanager/assets/app.js
```
