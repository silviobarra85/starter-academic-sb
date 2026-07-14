# AI Assistant Handoff V648

## Stato

Patch ioSudo V648 preparata per correggere due richieste operative:

1. rimuovere la vista giocatori all'interno delle schede squadra;
2. correggere `Ultimo aggiornamento: +046216-01`, causato da date seriali Excel interpretate da JavaScript come anno esteso.

## Dettagli tecnici

- Base di partenza: sito con V647 applicata, ioSudo ancora su V646.
- Nuovo JS: `static/fanta-engine/js/apps/iosudo-app-v648.js`.
- Nuovo CSS: `static/fanta-engine/css/iosudo-app-v648.css`.
- `index.html` carica `iosudo-app-v648.*?v=648` e imposta `data-iosudo-version="648"`.
- `sw.js` usa cache `iosudo-shell-v648`.

## Modifiche UI

- Rimossa esposizione del tab `Rosa` nella scheda squadra.
- Whitelist tab squadra: `xi`, `mercato`, `sos`, `amichevoli`.
- Se un hash o stato vecchio richiede `tab=rose`, la scheda torna a `XI`.
- CSS: `.iosudo-shell.is-team-open .iosudo-results { display: none; }`, cosi i risultati globali non restano sotto la scheda aperta.

## Modifiche date

Aggiunta funzione `excelSerialDate(value)`:

- accetta seriali tipo `46216` o `46216.0`;
- accetta anche forme gia degradate tipo `+046216-01`;
- converte con origine Excel `1899-12-30`;
- viene usata da `formatDate` e `dateValue` prima di `Date.parse`.

## Audit

Eseguire:

```bash
node static/fanta-engine/tools/audit-iosudo-v648.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v648.js
node --check static/iosudo/sw.js
```
