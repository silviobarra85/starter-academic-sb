# V156 - Mobile date compatte e rose a blocchi

Data: 2026-05-21
Branch: feature/zonaorientale-competizioni-statiche

## Obiettivo

Migliorare solo la resa mobile senza cambiare la vista desktop.

## Modifiche

- Da mobile, le date visualizzate nel sito vengono convertite in formato compatto `GG-MM-AA`.
- La conversione agisce solo sul testo renderizzato, non su input, select, script o valori salvati.
- Aggiornata anche `competition.html` per usare lo stesso formato mobile compatto.
- Da mobile, la sezione `Rose` mostra una griglia a blocchi 2 colonne x 5 righe per selezionare le 10 rose.
- Ogni blocco rosa mostra logo, nome squadra, numero giocatori e saldo FM.
- Cliccando su un blocco si apre il dettaglio della rosa con le informazioni principali e la tabella giocatori esistente.
- La tabella dei movimenti resta sotto, come nella versione precedente.
- Desktop invariato.

## File modificati

- `static/zonaorientale/index.html`
- `static/zonaorientale/competition.html`
- `static/zonaorientale/assets/app.js`

## File nuovi

- `static/zonaorientale/assets/css/mobile-hotfix-v156.css`
- `docs/zonaorientale/REFACTOR_V156.md`

## Test consigliati

- `/zonaorientale/#dashboard` da mobile: date compatte.
- `/zonaorientale/#competitions` da mobile: date compatte nei blocchi competizione.
- `/zonaorientale/competition.html` da mobile: date compatte nella pagina competizione.
- `/zonaorientale/#clubs` da mobile: griglia rose 2 colonne, apertura dettaglio, movimenti sotto.
- Desktop: verificare che Rose e Competizioni restino invariate.
