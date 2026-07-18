# Overlay ioSudo V726

Applicazione dalla root del sito:

```bash
cp -R overlay_iosudo_v726/static/* static/
cp -R overlay_iosudo_v726/docs/* docs/
```

Verifica:

```bash
node --check static/fanta-engine/js/apps/iosudo-app-v726.js
node --check static/iosudo/sw.js
node static/fanta-engine/tools/audit-iosudo-v726.mjs
```
