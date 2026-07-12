# Overlay V610 - ioSudo logo, header compatto e rosa P-A

```bash
cp -R ~/Downloads/fantacalcio_overlay_iosudo_v610_logo_header_fix/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_iosudo_v610_logo_header_fix/docs/* docs/

node static/fanta-engine/tools/audit-iosudo-v610.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v610.js
node --check static/iosudo/sw.js
```
