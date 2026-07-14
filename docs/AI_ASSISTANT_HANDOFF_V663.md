# AI Assistant Handoff V663

## Ambito

Overlay solo sito, successivo a V662. Non tocca ioSudo e non modifica dati.

## Modifiche principali

- Nuovo CSS `static/fanta-engine/css/site-performance-v663.css`.
- Aggiornati gli `index.html` delle due leghe per caricare il CSS V663.
- Aggiunto wrapper JS V663 in entrambi gli `assets/app.js`.
- Le card mobile di Listone/Rose sono piu' compatte e ordinate.
- Il contenitore della lista e' neutro; il colore leggibile e' quello della card ruolo.
- Nascosta l'intestazione tabellare su mobile.
- Aggiunti badge coerenti: `In listone` verde, `Asteriscato` giallo, `Svincolato` giallo scuro.
- La rosa fantasy compare accanto al nome giocatore, con logo quando risolvibile.
- Costo rosa e quotazione attuale visibili nelle card dei giocatori in rosa.

## Vincoli rispettati

- ioSudo non modificato.
- Dataset non modificati.
- Per i SUDATORI pubblico resta disattivato.
- Filtri esistenti mantenuti.
- Rendering progressivo mantenuto.
- Nessuna cartella root `tools/` nello zip, per evitare sovrascrittura dello script workflow durante l'esecuzione.
