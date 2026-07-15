# Overlay V687 - applicazione

## File
`fantacalcio_overlay_iosudo_v687_globale_v37.zip`

## Comandi

```bash
git switch master
git pull --rebase origin master

rm -rf ~/Downloads/fantacalcio_overlay_iosudo_v687_globale_v37
unzip -o ~/Downloads/fantacalcio_overlay_iosudo_v687_globale_v37.zip -d ~/Downloads/

cp -R ~/Downloads/fantacalcio_overlay_iosudo_v687_globale_v37/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_iosudo_v687_globale_v37/docs/* docs/

node static/fanta-engine/tools/audit-iosudo-v687.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v687.js
node --check static/iosudo/sw.js

git status
git add static docs
git commit -m "Aggiorna ioSudo V687"
git push origin master
```

Da smartphone caricare direttamente lo zip in `incoming/overlays/`.
