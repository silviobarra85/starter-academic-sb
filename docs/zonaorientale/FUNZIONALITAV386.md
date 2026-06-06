# Funzionalita V386 - Soccer Data solo admin

Documento additivo di release. Non sostituisce e non modifica `FUNZIONALITA'.md`.

## Soccer Data

- La sezione `Soccer Data` viene resa disponibile solo agli admin.
- Il link desktop `Soccer Data` e il link mobile nel menu `Altro` sono nascosti ai non-admin tramite la stessa logica gia usata per i link admin.
- L'accesso diretto via hash `#soccerdata` viene bloccato se l'utente non e admin e riporta alla dashboard con richiesta di login.
- Il caricamento del manifest/mapping Soccer Data non viene avviato per utenti non-admin.
- La tabella resta invariata per gli admin: mapping V383, patch locale V385 e filtri restano disponibili.
- Il testo del link giocatore FBref nella colonna `FBref / Giocatore` e ora verde (`var(--primary)`) con hover/focus verde scuro.

## Garanzie di non regressione

- Nessuna modifica al mapping: resta `assets/soccer-data/fbref-player-map.v383.json`.
- Nessuna scrittura Firebase.
- Nessuno scraping live dal browser.
- Nessun cambio al caricamento listoni.
- Nessun cambio alle patch locali V385.
- Nessuna modifica a `FUNZIONALITA'.md`.
- Restano presenti le funzioni V371/V372/V383/V384/V385.

## Test

- `node tools/audit-soccer-data-admin-only-v386.mjs`
- `node tools/audit-soccer-data-association-patch-v385.mjs`
- `node tools/audit-soccer-data-table-cleanup-v384.mjs`
- `node tools/audit-soccer-data-fbref-batch-v383.mjs`
- `node --check assets/app.js`
- `node --check tools/audit-soccer-data-admin-only-v386.mjs`
