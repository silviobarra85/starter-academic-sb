# Overlay V686 - applicazione

## File
`fantacalcio_overlay_iosudo_v686_globale_v36.zip`

## Comandi

```bash
rm -rf ~/Downloads/fantacalcio_overlay_iosudo_v686_globale_v36
unzip -o ~/Downloads/fantacalcio_overlay_iosudo_v686_globale_v36.zip -d ~/Downloads/

cp -R ~/Downloads/fantacalcio_overlay_iosudo_v686_globale_v36/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_iosudo_v686_globale_v36/docs/* docs/

node static/fanta-engine/tools/audit-iosudo-v686.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v686.js
node --check static/iosudo/sw.js

git status
git add static docs
git commit -m "Aggiorna ioSudo V686"
git push origin master
```

Da smartphone caricare direttamente lo zip in `incoming/overlays/`.
