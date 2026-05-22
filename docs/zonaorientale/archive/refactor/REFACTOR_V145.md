# V145 - Competizioni mobile compatte

Data: 2026-05-20
Branch: `feature/zonaorientale-competizioni-statiche`

## Obiettivo

Migliorare la fruizione mobile della sezione `Competizioni` senza modificare la resa desktop/web, senza cambiare dati e senza toccare Firebase.

## Modifiche

- Aggiunto nuovo CSS mobile-only:
  - `static/zonaorientale/assets/css/mobile-competitions-v145.css`
- Aggiornato `index.html` per caricare il CSS V145.
- Aggiornato `competition.html` per riusare lo stesso CSS mobile anche nella pagina singola competizione.
- Aggiornato cache busting a `v=145`.
- Aggiornato footer a `V145 competizioni mobile`.

## Cosa migliora da mobile

### Sezione Competizioni

- Card competizione piu compatte.
- Header card piu leggibile.
- Pulsante `Apri competizione` piccolo e non invasivo.
- Badge stato allineato nella riga azioni.
- Blocchi fasi/giornate piu compatti.
- Tabelle partite e classifiche scrollabili orizzontalmente dentro la card.
- Loghi squadra piu piccoli e coerenti con la vista mobile.

### Pagina singola competizione

- Titolo e meta piu compatti.
- Sezioni risultati e partite piu compatte.
- Tabella partite completa ancora scrollabile orizzontalmente.
- Colonna `Partita` ridotta rispetto alle versioni precedenti, ma ancora abbastanza larga per leggere le squadre.
- Classifica piu compatta con colonna posizione stretta.

## Note tecniche

- Nessuna modifica a `app.js`.
- Nessuna modifica a Firestore Rules.
- Nessuna modifica al desktop: tutte le regole sono racchiuse in media query mobile e/o `body.is-mobile-ux`.

## Test consigliati

Da smartphone:

```text
/zonaorientale/#competitions
/zonaorientale/competition.html
```

Controllare:

```text
- card competizione
- pulsante Apri competizione
- badge stato
- fasi/giornate espandibili
- scroll orizzontale delle tabelle
- classifica Campionato
- pagina singola competizione
```
