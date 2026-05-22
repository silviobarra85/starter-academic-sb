# Refactor V136 - Dashboard prossime partite e mockup mobile

Data: 2026-05-20

## Modifica funzionale

Nella Dashboard, accanto alle prossime partite delle competizioni, vengono mostrate anche:

- data partita;
- giornata di Serie A, quando presente nei dati (`serieAMatchday`).

La modifica vale sia desktop sia mobile.

## File modificati

- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/assets/styles.css`

## File nuovi

- `docs/zonaorientale/REFACTOR_V136.md`
- `docs/zonaorientale/MOBILE_MOCKUPS_V136.md`

## Note tecniche

Sono stati aggiunti helper V136 per renderizzare le prossime partite in Dashboard senza modificare i renderer usati per risultati gia giocati.

Il CSS aggiunge badge compatti per data e Serie A.

## Test consigliati

- `/zonaorientale/#dashboard` desktop
- `/zonaorientale/#dashboard` mobile
- verifica `Classifiche competizioni`
- verifica una competizione ranking con prossime partite programmate
- verifica una competizione a eliminazione con prossima partita

