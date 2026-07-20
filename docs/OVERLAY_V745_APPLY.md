# Overlay ioSudo V745

Applicare dalla radice del progetto:

```bash
cp -R overlay_iosudo_v745/static/* static/
cp -R overlay_iosudo_v745/docs/* docs/
```

Poi verificare:

```bash
node --check static/fanta-engine/js/apps/iosudo-app-v745.js
node --check static/iosudo/sw.js
node static/fanta-engine/tools/audit-iosudo-v745.mjs
```
