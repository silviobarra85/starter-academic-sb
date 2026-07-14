# Overlay ioSudo V655

Comandi:

```bash
cp -R ~/Downloads/fantacalcio_overlay_iosudo_v655_globale_v25_fast_players/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_iosudo_v655_globale_v25_fast_players/docs/* docs/

node static/fanta-engine/tools/audit-iosudo-v655.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v655.js
node --check static/iosudo/sw.js

git add static docs
git commit -m "Aggiorna ioSudo V655"
git push origin master
```
