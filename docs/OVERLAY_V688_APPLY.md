# Overlay V688 - applicazione

## File
`fantacalcio_overlay_iosudo_v688_globale_v38.zip`

## Comandi

```bash
git switch master
git pull --rebase origin master

rm -rf ~/Downloads/fantacalcio_overlay_iosudo_v688_globale_v38
unzip -o ~/Downloads/fantacalcio_overlay_iosudo_v688_globale_v38.zip -d ~/Downloads/

cp -R ~/Downloads/fantacalcio_overlay_iosudo_v688_globale_v38/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_iosudo_v688_globale_v38/docs/* docs/

node static/fanta-engine/tools/audit-iosudo-v688.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v688.js
node --check static/iosudo/sw.js

git status
git add static docs
git commit -m "Aggiorna ioSudo V688"
git push origin master
```

Da smartphone caricare direttamente lo zip in `incoming/overlays/`.
