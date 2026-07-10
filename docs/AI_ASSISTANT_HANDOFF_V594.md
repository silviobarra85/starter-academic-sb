# AI Assistant Handoff V594 - Sudatori: trattative squadre

Versione: V594
Data: 2026-07-10

## Obiettivo
Integrare nella sezione standalone **Per i SUDATORI** le trattative in corso per ogni squadra di Serie A, senza influenzare Rose ufficiali, Listone operativo, Area Squadra, Firebase o rosterEntries.

## Modifiche principali
- Aggiunto `teamTransferTalksByTeam` in `static/fanta-engine/data/sudatori/current/sudatori-data.json`.
- Aggiunte card **Trattative in corso** nella scheda della squadra Serie A selezionata.
- Aggiunto KPI globale “Trattative squadre”.
- Aggiunto conteggio trattative nelle card delle rose del campionato.
- Dati generati dal foglio `Trattative_Squadre_10_07` del file `fantacalcio_serie_a_2026_27_trattative_squadre_2026-07-10(1).xlsx`.
- Conservato matching listone V593, incluso caso Milinkovic-Savic V.

## File principali
- `static/fanta-engine/css/sudatori-section-v594.css`
- `static/fanta-engine/js/sections/sudatori-section-v594.js`
- `static/fanta-engine/data/sudatori/current/manifest.json`
- `static/fanta-engine/data/sudatori/current/sudatori-data.json`
- `static/fanta-engine/tools/audit-sudatori-section-v594.mjs`

## Audit
```bash
node static/fanta-engine/tools/audit-sudatori-section-v594.mjs
node --check static/fanta-engine/js/sections/sudatori-section-v594.js
```

## Note isolamento
La sezione resta standalone: legge solo dati statici Sudatori e Listone, non scrive su Firestore, non aggiorna rosterEntries e non modifica le sezioni ufficiali.
