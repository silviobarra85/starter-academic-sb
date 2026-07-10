# AI Assistant Handoff V591

Versione: **V591 - Sezione standalone Per i SUDATORI**
Data: 10/07/2026

## Stato

- ZonaOrientale aggiornata a V591.
- FantaPetilloMantraManager aggiornata a V591.
- La sezione **Per i SUDATORI** è standalone e comune tramite `fanta-engine`.
- Nessuna modifica a Firebase, EmailJS, `rosterEntries`, rose ufficiali o listone operativo.

## Asset principali

- `static/fanta-engine/css/sudatori-section-v591.css`
- `static/fanta-engine/js/sections/sudatori-section-v591.js`
- `static/fanta-engine/data/sudatori/current/manifest.json`
- `static/fanta-engine/data/sudatori/current/sudatori-data.json`
- `static/fanta-engine/tools/audit-sudatori-section-v591.mjs`

## Funzioni introdotte

- Nuova pagina/hash `#sudatori`.
- Card rose Serie A.
- Schede giocatore con dati Excel + parametri listone quando disponibili.
- Ritiri, allenatori, moduli e amichevoli estive.
- Note mercato se presenti nel file Excel.

## Guardrail

- Non deve essere collegata al boot pesante.
- Non deve scrivere su Firestore.
- Deve restare cancellabile rimuovendo CSS/JS/data dedicati.
- Non deve influenzare Rose, Listone, Area Squadra, Dashboard Presidente.

## Audit

```bash
node static/fanta-engine/tools/audit-sudatori-section-v591.mjs
node --check static/fanta-engine/js/sections/sudatori-section-v591.js
```
