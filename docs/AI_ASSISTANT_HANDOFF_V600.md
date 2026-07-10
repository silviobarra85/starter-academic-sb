# AI Assistant Handoff - V600 Sudatori Excel serale

Versione: V600
Data: 2026-07-10 sera
Overlay: fantacalcio_overlay_sudatori_v600_excel_serale.zip

## Contenuto

Aggiorna la sezione Per i SUDATORI usando il workbook serale `fantacalcio_serie_a_2026_27_aggiornato_2026-07-10_sera(1).xlsx`.

## Modifiche dati principali

- Gila rimosso dalla Lazio e aggiunto al Milan come acquisto ufficiale TMW.
- Havel aggiunto al Genoa.
- Luvumbo rimosso dal Cagliari per passaggio al Maiorca.
- Omar Traore aggiunto all'Udinese con stato da monitorare.
- Ndow segnalato come cessione in chiusura ma non rimosso.
- Aggiunte Fiorentina-Real Madrid e Burnley-Torino alle amichevoli.
- Aggiornate le trattative da Trattative_Squadre_10_07 e TMW_Sera_10_07.

## Garanzie mantenute

- Il campetto usa il modulo formazione usato.
- Le posizioni con S sono ordinate a sinistra e quelle con D a destra.
- I badge fisici sul campo compaiono solo in caso di segnalazione.
- La colonna Mercato non mostra il badge Probabile XI.

## Verifica

Eseguire:

```bash
node static/fanta-engine/tools/audit-sudatori-section-v600.mjs
node --check static/fanta-engine/js/sections/sudatori-section-v600.js
```
