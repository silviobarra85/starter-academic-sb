# V591 - Sezione standalone Per i SUDATORI

## Obiettivo

Aggiunge una sezione consultiva e standalone chiamata **Per i SUDATORI**.

La sezione non scrive su Firebase, non modifica `rosterEntries`, non modifica le rose ufficiali della lega e non modifica il listone operativo. Legge solo dati statici.

## Dati

I dati sono stati generati dal file Excel:

`fantacalcio_serie_a_2026_27_aggiornato_2026-07-10(1).xlsx`

Percorso operativo:

`static/fanta-engine/data/sudatori/current/`

File principali:

- `manifest.json`
- `sudatori-data.json`

Il JSON contiene:

- 20 squadre Serie A;
- 725 giocatori;
- 84 amichevoli;
- note mercato derivate dai fogli movimenti/aggiornamenti presenti nell'Excel.

## Funzionalità

La sezione mostra:

- card delle rose del campionato;
- allenatore, modulo, ritiro/preparazione e numero amichevoli per squadra;
- rosa della squadra selezionata;
- scheda giocatore con parametri disponibili dal listone corrente;
- link alla scheda Fantacalcio.it quando il listone contiene `fantacalcioId`;
- note mercato disponibili nel file caricato;
- amichevoli estive della squadra.

## Isolamento

Asset introdotti:

- `static/fanta-engine/css/sudatori-section-v591.css`
- `static/fanta-engine/js/sections/sudatori-section-v591.js`
- `static/fanta-engine/data/sudatori/current/manifest.json`
- `static/fanta-engine/data/sudatori/current/sudatori-data.json`
- `static/fanta-engine/tools/audit-sudatori-section-v591.mjs`

Le singole leghe caricano solo CSS e JS. La sezione crea dinamicamente voce menu e pagina `#sudatori`.

Per rimuovere la sezione basta togliere i riferimenti CSS/JS dagli `index.html` e cancellare gli asset `sudatori-*` e `data/sudatori/`.

## Audit

```bash
node static/fanta-engine/tools/audit-sudatori-section-v591.mjs
```
