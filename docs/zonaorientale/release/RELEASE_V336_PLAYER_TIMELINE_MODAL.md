# Release V336 - Timeline giocatore Calciomercato in scheda

## Tipo release

Fix UX + refactor protetto Calciomercato.

## Modifiche

- Il tag giocatore degli articoli Calciomercato apre una scheda/modal invece di una pagina dedicata.
- Rimossi dalla scheda timeline i tasti `Torna agli articoli` e `Torna al Calciomercato`.
- Aggiunti controlli di chiusura: X, backdrop, Escape.
- Mantenuta compatibilita con hash legacy `#calciomercato-player-*`.
- Aggiunta diagnostica `window.ZonaOrientaleCalciomercatoPlayerModalV336`.
- Aggiornati footer, cache-buster e `DEPLOY_EXPECTED_VERSION_V181` a V336.
- Aggiornato `check-zonaorientale.sh` con verifica V336.

## Funzionalita preservate

- Matching giocatore V335.
- Timeline da articoli caricati + archivio statico.
- Moduli immagini V334 e giocatori V335.
- Card compatte V332.
- Fonti TMW squadra V329.
- Pannello Solo Admin V327.
- Listone V333/V331.
- Rose, Fantamercato, Dashboard Presidente, Admin, Firebase/Auth/EmailJS.
- Netlify Functions e JSON dati non modificati.
- `FUNZIONALITA'.md` non modificato.

## Test consigliati

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/js/calciomercato/calciomercato-players-v335.js
static/zonaorientale/tools/check-zonaorientale.sh
static/zonaorientale/tools/audit-assets-v298.sh
static/zonaorientale/tools/audit-css-v300.sh
```

## Verifica browser

- Cliccare un tag giocatore in Calciomercato.
- Verificare che si apra una scheda/modal.
- Chiudere con X, backdrop ed Escape.
- Verificare che non ci siano piu' tasti `Torna...` nella scheda.
- Verificare che titolo/immagine articolo continuino ad aprire la fonte originale.
