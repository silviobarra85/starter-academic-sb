# Sezione Per i SUDATORI - V603

V603 e una patch correttiva costruita sopra V602/V601. Mantiene l'Excel `fantacalcio_serie_a_2026_27_aggiornato_raduni_rumors_2026-07-11(1).xlsx` e modifica la logica della colonna **Mercato** nella tabella rosa.

## Cosa cambia

- la colonna **Mercato** mostra sempre un solo badge compatto;
- i badge ammessi sono solo `NUOVO`, `RUMOR`, `CONFERMATO`;
- `NUOVO` ha priorita se il giocatore e un nuovo acquisto ufficiale/riscatto;
- `RUMOR` compare se ci sono notizie, trattative, uscite/entrate o segnalazioni Transfermarkt/TMW;
- `CONFERMATO` compare quando il giocatore e in rosa senza segnalazioni di mercato;
- Gaetano in Atalanta viene corretto come `NUOVO`;
- Giovane del Napoli e Giovane dell'Atalanta sono disambiguati: il Giovane Napoli eredita la rosa fantacalcio Real Pisistrius, quello Atalanta no.

## Perche Gaetano risultava `In rosa`

Nel dataset V602 il record giocatore era `Gaetano`, mentre la nota di mercato ufficiale era indicizzata come `Gianluca Gaetano`. La UI precedente cercava solo la chiave esatta del nome breve e quindi non collegava la nota ufficiale al giocatore. V603 aggiunge risoluzione team-aware e corregge anche il dato del giocatore Atalanta.

## Disambiguazione Giovane

Il matching listone ora usa anche `originalName` e squadra reale. Quindi:

- `Giovane (Napoli)` cerca `Giovane` solo con squadra `NAP` e trova il listone con rosa fantacalcio `Real Pisistrius`;
- `Giovane (Atalanta)` cerca `Giovane` solo con squadra `ATA` e non eredita per errore il record Napoli.

## File principali

- `static/fanta-engine/js/sections/sudatori-section-v603.js`
- `static/fanta-engine/css/sudatori-section-v603.css`
- `static/fanta-engine/data/sudatori/current/manifest.json`
- `static/fanta-engine/data/sudatori/current/sudatori-data.json`
- `static/fanta-engine/tools/audit-sudatori-section-v603.mjs`

## Verifiche

```bash
node static/fanta-engine/tools/audit-sudatori-section-v603.mjs
node --check static/fanta-engine/js/sections/sudatori-section-v603.js
```
