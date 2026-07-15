# Overlay ioSudo V689

Aggiornamento ioSudo da Excel globale v39.

## Applicazione manuale

```bash
rm -rf ~/Downloads/fantacalcio_overlay_iosudo_v689_globale_v39
unzip -o ~/Downloads/fantacalcio_overlay_iosudo_v689_globale_v39.zip -d ~/Downloads/

cp -R ~/Downloads/fantacalcio_overlay_iosudo_v689_globale_v39/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_iosudo_v689_globale_v39/docs/* docs/

node static/fanta-engine/tools/audit-iosudo-v689.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v689.js
node --check static/iosudo/sw.js

git status
git add static docs
git commit -m "Aggiorna ioSudo V689"
git push origin master
```

Da smartphone: caricare lo zip in `incoming/overlays/`.
