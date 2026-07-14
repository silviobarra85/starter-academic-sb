# ioSudo App V648

## Intervento

V648 e una patch conservativa sopra V646/V647. Mantiene il dataset Sudatori esistente e interviene solo sulla shell ioSudo.

## Schede squadra

La scheda di ogni squadra ora mostra solo:

- XI;
- Mercato;
- SOS;
- Amichevoli.

La vista elenco giocatori di squadra non e piu esposta dentro la scheda squadra. Inoltre, quando una scheda squadra o giocatore e aperta, i risultati globali sotto la scheda vengono nascosti. La vista globale `GIOCATORI` resta disponibile dalla navigazione principale dell'app.

## Date Excel

Alcuni record provenienti dall'Excel possono contenere date seriali, per esempio `46216`. JavaScript tendeva a interpretarle con `Date.parse` come anni estesi, producendo valori come `+046216-01`.

V648 introduce `excelSerialDate(value)` e fa passare `formatDate` e `dateValue` prima da questo parser. Quindi `46216` viene mostrato come `13/07/2026` invece di `+046216-01`.

## File principali

- `static/fanta-engine/js/apps/iosudo-app-v648.js`
- `static/fanta-engine/css/iosudo-app-v648.css`
- `static/iosudo/index.html`
- `static/iosudo/sw.js`
- `static/fanta-engine/tools/audit-iosudo-v648.mjs`
