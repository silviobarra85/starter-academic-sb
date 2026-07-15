# Overlay ioSudo V685

## Comandi

```bash
rm -rf ~/Downloads/fantacalcio_overlay_iosudo_v685_globale_v35
unzip -o ~/Downloads/fantacalcio_overlay_iosudo_v685_globale_v35.zip -d ~/Downloads/

cp -R ~/Downloads/fantacalcio_overlay_iosudo_v685_globale_v35/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_iosudo_v685_globale_v35/docs/* docs/

node static/fanta-engine/tools/audit-iosudo-v685.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v685.js
node --check static/iosudo/sw.js

git status
git add static docs
git commit -m "Aggiorna ioSudo V685"
git push origin master
```

Da smartphone caricare lo zip in `incoming/overlays/`.
