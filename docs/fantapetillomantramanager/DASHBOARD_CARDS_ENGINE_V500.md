# Dashboard cards engine V500

La V500 introduce un motore comune per governare le card dashboard tramite `fanta-engine`.

## File principali

- `static/fanta-engine/js/ui/dashboard-cards-engine-v500.js`
- `static/fanta-engine/data/dashboard-cards-engine-v500.json`
- `static/fanta-engine/tools/audit-dashboard-cards-engine-v500.mjs`

## Modalita'

La modalita' corrente e' `observe-first`.

Il motore:

- legge il registry card/funzionalita' V497;
- calcola lo snapshot delle card abilitate per contesto;
- marca gli elementi esistenti con attributi `data-*`;
- non forza ancora hide/remove delle card;
- non riscrive il rendering Admin/Presidente.

## Perche' e' prudente

La Dashboard Presidente e gli strumenti Admin sono parti sensibili. La V500 centralizza il controllo e prepara il terreno per una fase successiva, ma mantiene il rendering locale gia' testato.

## Prossimi passi

- V501 Tool engine comune.
- V502 Template nuova lega.
- V503 Test browser Playwright.
- V504 eventuale enforcement card, solo dopo test reali.
