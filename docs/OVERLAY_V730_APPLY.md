# Overlay ioSudo V730

Applicare dalla radice del sito:

```bash
cp -R overlay_iosudo_v730/static/* static/
cp -R overlay_iosudo_v730/docs/* docs/
```

Poi verificare:

```bash
node --check static/fanta-engine/js/apps/iosudo-app-v730.js
node --check static/iosudo/sw.js
node static/fanta-engine/tools/audit-iosudo-v730.mjs
```
