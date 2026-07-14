# Overlay ioSudo V669

Applicazione manuale:

```bash
rm -rf ~/Downloads/fantacalcio_overlay_iosudo_v669_globale_v26
unzip -o ~/Downloads/fantacalcio_overlay_iosudo_v669_globale_v26.zip -d ~/Downloads/

cp -R ~/Downloads/fantacalcio_overlay_iosudo_v669_globale_v26/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_iosudo_v669_globale_v26/docs/* docs/

node static/fanta-engine/tools/audit-iosudo-v669.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v669.js
node --check static/iosudo/sw.js

git status
git add static docs
git commit -m "Aggiorna ioSudo V669"
git push origin master
```
