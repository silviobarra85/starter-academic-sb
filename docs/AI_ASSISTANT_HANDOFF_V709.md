# AI Assistant Handoff — ioSudo V709

Data: 2026-07-17  
Sorgente: `fantacalcio_serie_a_2026_27_aggiornato_2026-07-17_aggiornamento_globale_v63-1.xlsx`

## Sintesi

V709 aggiorna ioSudo dall'Excel v63-1. L'intervento principale riguarda il mercato: Robin Gosens passa da rumor/monitoraggio a uscita ufficiale Fiorentina verso Schalke 04, Andres Cuenca viene riallineato alla fonte ufficiale Como, e le operazioni giovanili Tassani/Dorigo/Boerleider/Malidor vengono rafforzate con fonte deposito Lega Serie A.

## Regole confermate

- Nessun giocatore con ufficialità attiva deve restare nei rumor/trattative attive.
- Le voci individuali su Gosens e Cuenca sono state archiviate post-ufficialità e rimosse dalle trattative attive.
- Nessuna nuova amichevole giocata e nessun nuovo infortunio ufficiale da aggiungere nel v63-1.
- La scheda cliccabile Sassuolo-Alta Anaunia 22-1 resta disponibile con badge minuti, titolare/subentrato, gol, autogol e infortunio gara.

## Conteggi

- Squadre: 20
- Giocatori: 775
- Duplicati esatti giocatori: 0
- ID giocatori duplicati: 0
- Ufficialità attive: 363
- Trattative attive: 460
- Rumor attivi su giocatori ufficiali: 0
- Trattative archiviate post-ufficialità V709: 7
- Infortuni attivi: 22
- Amichevoli attive: 117
- Tabellini amichevoli dettagliati: 1
- Righe tabellino giocatori: 26

## File principali

- `static/fanta-engine/data/sudatori/current/sudatori-data.json`
- `static/fanta-engine/data/sudatori/current/manifest.json`
- `static/fanta-engine/js/apps/iosudo-app-v709.js`
- `static/fanta-engine/css/iosudo-app-v709.css`
- `static/iosudo/index.html`
- `static/iosudo/sw.js`
- `static/fanta-engine/tools/audit-iosudo-v709.mjs`

## Verifica consigliata

```bash
node --check static/fanta-engine/js/apps/iosudo-app-v709.js
node static/fanta-engine/tools/audit-iosudo-v709.mjs
```
