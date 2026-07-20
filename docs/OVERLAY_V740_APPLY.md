# Overlay ioSudo V740

```bash
cp -R overlay_iosudo_v740/static/* static/
cp -R overlay_iosudo_v740/docs/* docs/
```

```bash
node --check static/fanta-engine/js/apps/iosudo-app-v740.js
node --check static/iosudo/sw.js
node static/fanta-engine/tools/audit-iosudo-v740.mjs
```
