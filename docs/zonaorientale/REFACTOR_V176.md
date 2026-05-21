# V176 - Fix azioni rapide Squadra mobile

Data: 2026-05-21

## Obiettivo

Correggere il comportamento mobile della sezione Squadra per i presidenti: i pulsanti dinamici `Tutte le rose` e `Mercato` nel riquadro Area squadra devono navigare correttamente alle rispettive sezioni.

## Problema

Il blocco mobile `mobileTeamAreaHubV144` viene renderizzato dopo l'inizializzazione della navigazione principale. I link dinamici con `data-page-link="clubs"` e `data-page-link="fantamercato"` potevano quindi aggiornare solo l'hash senza attivare la pagina SPA corretta.

## Soluzione

Aggiunto un handler delegato in `assets/app.js` che intercetta i click dentro `.mobile-teamarea-actions-v144` e richiama la navigazione interna `setAppPageV42`.

Per `Mercato`, l'handler forza anche il caricamento lazy del Fantamercato tramite `ensureTransferMarketDataV119`, mantenendo la riduzione letture introdotta in V170: il mercato viene letto solo quando si entra davvero nella sezione.

## File modificati

- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/index.html`

## Note

- Nessuna nuova lettura Firebase al caricamento iniziale pubblico.
- Footer aggiornato a V176.
- Cache-buster `app.js`, `styles.css` e `mobile-suite-v168.css` aggiornati a `v=176`.
