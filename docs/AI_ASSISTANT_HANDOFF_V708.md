# AI Assistant Handoff — ioSudo V708

Data: 2026-07-17  
Sorgente: `fantacalcio_serie_a_2026_27_aggiornato_2026-07-17_aggiornamento_globale_v62.xlsx`

## Sintesi

V708 aggiorna ioSudo dall'Excel v62. L'intervento è mirato alle amichevoli: le gare Roma già presenti sono state riallineate alle fonti ufficiali specifiche AS Roma senza creare duplicati. La denominazione `Newport-Roma` è stata normalizzata in `Newport County-Roma`.

## Regole confermate

- Nessun giocatore con ufficialità attiva deve restare nei rumor/trattative attive.
- Le amichevoli già presenti vengono aggiornate su fonte, sede e orario senza duplicazione.
- Le schede cliccabili delle amichevoli restano attive; al momento il tabellino giocatori dettagliato è disponibile per Sassuolo-Alta Anaunia 22-1.

## Conteggi

- Squadre: 20
- Giocatori: 775
- Duplicati esatti giocatori: 0
- ID giocatori duplicati: 0
- Ufficialità attive: 362
- Trattative attive: 463
- Rumor attivi su giocatori ufficiali: 0
- Infortuni attivi: 22
- Amichevoli attive: 117
- Tabellini amichevoli dettagliati: 1
- Righe tabellino giocatori: 26

## File principali

- `static/fanta-engine/data/sudatori/current/sudatori-data.json`
- `static/fanta-engine/data/sudatori/current/manifest.json`
- `static/fanta-engine/js/apps/iosudo-app-v708.js`
- `static/fanta-engine/css/iosudo-app-v708.css`
- `static/iosudo/index.html`
- `static/iosudo/sw.js`
- `static/fanta-engine/tools/audit-iosudo-v708.mjs`

## Verifica consigliata

```bash
node --check static/fanta-engine/js/apps/iosudo-app-v708.js
node static/fanta-engine/tools/audit-iosudo-v708.mjs
```
