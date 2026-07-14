# Overlay V670 - Fix card mobile Listone/Rose

Overlay solo sito. Non modifica ioSudo e non modifica dati JSON.

## Correzioni

- Corregge la compressione delle card mobile del Listone/Rose.
- Neutralizza il verde ereditato da `td.fpt-v584-col-player` e dalle righe ruolo di `player-tables-mobile-v584.css`.
- Rende la card larga quasi quanto lo schermo su smartphone.
- Mantiene il colore sulla card del giocatore, non sul contenitore/cella legacy.

## Comandi

```bash
rm -rf ~/Downloads/fantacalcio_overlay_site_mobile_cards_v670
unzip -o ~/Downloads/fantacalcio_overlay_site_mobile_cards_v670.zip -d ~/Downloads/

cp -R ~/Downloads/fantacalcio_overlay_site_mobile_cards_v670/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_site_mobile_cards_v670/docs/* docs/

node static/fanta-engine/tools/audit-site-mobile-cards-v670.mjs
node --check static/zonaorientale/assets/app.js
node --check static/fantapetillomantramanager/assets/app.js

git status
git add static docs
git commit -m "Corregge card mobile sito V670"
git push origin master
```
