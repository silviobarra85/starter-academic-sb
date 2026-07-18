# Overlay ioSudo V724

Applicazione dalla root del sito:

```bash
cp -R overlay_iosudo_v724/static/* static/
cp -R overlay_iosudo_v724/docs/* docs/
```

Verifica:

```bash
node --check static/fanta-engine/js/apps/iosudo-app-v724.js
node --check static/iosudo/sw.js
node static/fanta-engine/tools/audit-iosudo-v724.mjs
```
