# Overlay V611 - ioSudo dettaglio giocatore e colori ruolo

```bash
cp -R ~/Downloads/fantacalcio_overlay_iosudo_v611_player_detail_role_colors/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_iosudo_v611_player_detail_role_colors/docs/* docs/

node static/fanta-engine/tools/audit-iosudo-v611.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v611.js
node --check static/iosudo/sw.js
```
