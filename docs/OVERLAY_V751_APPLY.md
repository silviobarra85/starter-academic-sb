# Overlay ioSudo V751

Applicazione dalla root del progetto:

```bash
cp -R overlay_iosudo_v751/static/* static/
cp -R overlay_iosudo_v751/docs/* docs/
node --check static/fanta-engine/js/apps/iosudo-app-v751.js
node --check static/iosudo/sw.js
node static/fanta-engine/tools/audit-iosudo-v751.mjs
```

File principali:
- `static/fanta-engine/data/sudatori/current/sudatori-data.json`
- `static/fanta-engine/data/sudatori/current/manifest.json`
- `static/fanta-engine/js/apps/iosudo-app-v751.js`
- `static/fanta-engine/css/iosudo-app-v751.css`
- `static/iosudo/index.html`
- `static/iosudo/sw.js`
