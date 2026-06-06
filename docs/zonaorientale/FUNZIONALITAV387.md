# Funzionalita V387 - Soccer Data mobile cleanup

Documento additivo di release. Non sostituisce e non modifica `FUNZIONALITA'.md`.

## Soccer Data

- La tabella Soccer Data mantiene la struttura V384/V385/V386, ma su mobile usa un layout compatto a larghezze fisse ispirato alla tabella Listone.
- Aggiunte classi dedicate alle colonne `FBref / Giocatore`, `Ruolo`, `Squadra`, `Rosa`, `Qt.A`, `FVM` e `Stato mapping`.
- Su smartphone la tabella resta una tabella orizzontale scrollabile, con header sticky e celle compatte.
- La prima colonna puo andare a capo per evitare sovrapposizioni tra link FBref, nome listone e pannello di associazione.
- Le colonne brevi e numeriche restano in larghezze controllate, con ellissi dove opportuno.
- Il pannello locale V385 per incollare link FBref viene compattato su mobile senza rimuovere pulsanti o campi.

## Garanzie di non regressione

- Nessuna modifica al mapping: resta `assets/soccer-data/fbref-player-map.v383.json`.
- Nessuna scrittura Firebase.
- Nessuno scraping live dal browser.
- Nessun cambio al caricamento listoni.
- Nessun cambio al gate admin V386.
- Nessun cambio alle patch locali V385.
- Nessuna modifica a `FUNZIONALITA'.md`.

## Test

- `node tools/audit-soccer-data-mobile-table-v387.mjs`
- `node tools/audit-soccer-data-admin-only-v386.mjs`
- `node tools/audit-soccer-data-association-patch-v385.mjs`
- `node tools/audit-soccer-data-table-cleanup-v384.mjs`
- `node tools/audit-soccer-data-fbref-batch-v383.mjs`
- `node --check assets/app.js`
- `find assets -name '*.js' -type f -print0 | xargs -0 -n 1 node --check`
