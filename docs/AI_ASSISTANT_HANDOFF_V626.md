# AI Assistant Handoff V626 - mercato, fonti e ufficialita v6

## Stato

Overlay V626 per **Per i SUDATORI** e **ioSudo**. Parte dalla V622 per i dati Sudatori e dalla V625 per l'app ioSudo, integrando il nuovo Excel `fantacalcio_serie_a_2026_27_aggiornato_2026-07-13_mercato_fonti_ufficialita_v6(1).xlsx`.

## Differenze dal file precedente

Il nuovo file contiene la scheda `Agg_13_07_v6` e introduce:

- 5 nuove fonti nel foglio `Fonti`;
- 20 righe ufficialita nel foglio `Ufficialita`;
- 11 righe trattative nel foglio `Trattative_Squadre`.

Le nuove ufficialita sono state deduplicate rispetto al dataset gia presente: 18 righe sono state aggregate a card esistenti, 1 nuova uscita e stata aggiunta al Venezia, 1 riga Verona/Leali e stata ignorata perche Verona non e tra le 20 squadre gestite dalla sezione.

Le nuove trattative sono state aggregate per giocatore: 6 nuove card attive e 5 righe fuse con card gia esistenti.

## Conteggi V626

- Giocatori: 714.
- Amichevoli/eventi reali: 94.
- Fonti: 126.
- Trattative aggregate: 186.
- Ufficialita in entrata: 97.
- Ufficialita in uscita: 136.
- Note mercato: 509.
- SOS/infortunati: 8.

## Funzioni mantenute

- Live rosters V618: Per i SUDATORI e ioSudo leggono a runtime le rose fantasy dalla stessa fonte della sezione Rose.
- Vista GIOCATORI ioSudo: include giocatori reali e virtuali, deduplicati, con click verso il dettaglio.
- Dettaglio giocatore: mostra link/fonti, trattative, ufficialita, SOS, listone e squadra fantasy quando disponibili.

## File principali

- static/fanta-engine/data/sudatori/current/sudatori-data.json
- static/fanta-engine/data/sudatori/current/manifest.json
- static/fanta-engine/js/sections/sudatori-section-v626.js
- static/fanta-engine/css/sudatori-section-v626.css
- static/fanta-engine/js/apps/iosudo-app-v626.js
- static/fanta-engine/css/iosudo-app-v626.css
- static/fanta-engine/tools/audit-sudatori-section-v626.mjs
- static/fanta-engine/tools/audit-iosudo-v626.mjs
