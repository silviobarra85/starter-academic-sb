# AI Assistant Handoff Current - V619

Ultimo overlay: **V619**.

- Sudatori e ioSudo aggiornati con `fantacalcio_serie_a_2026_27_aggiornato_2026-07-12_mercato_fonti_extra_v3(1).xlsx`.
- Live rosters V618 mantenuti.
- Nuove fonti: +7; nuove righe trattative: +7; fonti controllo ritiri/amichevoli: +3.
- Non serve reinstallare ioSudo dopo il deploy.


---

# AI Assistant Handoff V618

Versione: **V618**

## Scopo
V618 modifica il comportamento di **Per i SUDATORI** e **ioSudo** in modo che l'assegnazione dei giocatori alle rose fantacalcio venga letta a runtime dagli stessi file della sezione **Rose** della lega.

## Modifica principale

Prima di V618:

- Per i SUDATORI leggeva `static/fanta-engine/data/sudatori/current/sudatori-data.json`.
- ioSudo leggeva lo stesso JSON.
- Il campo `fantasyRoster` dentro il JSON era uno snapshot generato dall'overlay.
- Se cambiavano le rose in `assets/rose`, Sudatori e ioSudo non si aggiornavano automaticamente.

Da V618:

- mercato, ufficialità, rumors, fonti, infortuni, probabili formazioni e amichevoli restano nel JSON Sudatori condiviso;
- le assegnazioni fantacalcio vengono rilette a runtime da:
  - `static/zonaorientale/assets/rose/manifest.json` e ultimo JSON rosa 2026-2027;
  - `static/fantapetillomantramanager/assets/rose/manifest.json` quando disponibile;
- se la lega non ha un file rose valido, viene mantenuto il fallback allo snapshot incorporato.

## Matching rose live

La chiave di matching usa:

- nome normalizzato;
- varianti canoniche/compatte/sortate;
- squadra reale normalizzata;
- ruolo P/D/C/A.

Questo evita errori noti come omonimi tra squadre diverse, per esempio casi tipo `Giovane`.

## ioSudo

In ioSudo V618 sono state aggiunte anche varianti grafiche squadra-per-squadra per evitare che club con gli stessi colori abbiano card identiche. Ad esempio Bologna, Cagliari e Genoa restano rosso/blu, ma usano pattern diversi.

## File principali

- `static/fanta-engine/js/sections/sudatori-section-v618.js`
- `static/fanta-engine/js/apps/iosudo-app-v618.js`
- `static/fanta-engine/css/iosudo-app-v618.css`
- `static/fanta-engine/data/sudatori/current/manifest.json`
- `static/fanta-engine/data/sudatori/current/sudatori-data.json`
- `static/iosudo/sw.js`

## Verifiche

- `node static/fanta-engine/tools/audit-sudatori-section-v618.mjs`
- `node static/fanta-engine/tools/audit-iosudo-v618.mjs`
- `node --check static/fanta-engine/js/sections/sudatori-section-v618.js`
- `node --check static/fanta-engine/js/apps/iosudo-app-v618.js`
- `node --check static/iosudo/sw.js`
