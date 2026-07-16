# Overlay ioSudo V700

Applicazione da computer:

```bash
rm -rf ~/Downloads/fantacalcio_overlay_iosudo_v700_globale_v47_dedup
unzip -o ~/Downloads/fantacalcio_overlay_iosudo_v700_globale_v47_dedup.zip -d ~/Downloads/

cp -R ~/Downloads/fantacalcio_overlay_iosudo_v700_globale_v47_dedup/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_iosudo_v700_globale_v47_dedup/docs/* docs/

node static/fanta-engine/tools/audit-iosudo-v700.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v700.js
node --check static/iosudo/sw.js
```
