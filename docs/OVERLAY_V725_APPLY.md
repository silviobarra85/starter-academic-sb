# Overlay ioSudo V725

Applicazione dalla root del sito:

```bash
cp -R overlay_iosudo_v725/static/* static/
cp -R overlay_iosudo_v725/docs/* docs/
```

Verifica:

```bash
node --check static/fanta-engine/js/apps/iosudo-app-v725.js
node --check static/iosudo/sw.js
node static/fanta-engine/tools/audit-iosudo-v725.mjs
```
