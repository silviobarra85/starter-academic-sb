# Overlay V690

Applicazione manuale:

```bash
rm -rf ~/Downloads/fantacalcio_overlay_iosudo_site_v690_globale_v40
unzip -o ~/Downloads/fantacalcio_overlay_iosudo_site_v690_globale_v40.zip -d ~/Downloads/

cp -R ~/Downloads/fantacalcio_overlay_iosudo_site_v690_globale_v40/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_iosudo_site_v690_globale_v40/docs/* docs/

node static/fanta-engine/tools/audit-iosudo-v690.mjs
node static/fanta-engine/tools/audit-site-mobile-profile-v690.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v690.js
node --check static/iosudo/sw.js
node --check static/zonaorientale/assets/app.js
node --check static/fantapetillomantramanager/assets/app.js

git status
git add static docs
git commit -m "Aggiorna ioSudo e profili mobile V690"
git push origin master
```
