# Overlay V646 - Per i SUDATORI / ioSudo

Data: 2026-07-14

Sorgente Excel: `fantacalcio_serie_a_2026_27_aggiornato_2026-07-14_aggiornamento_globale_v22(1).xlsx`

## Contenuto

- Aggiorna il dataset centrale `static/fanta-engine/data/sudatori/current/` da Excel globale v22.
- Mantiene le ottimizzazioni V645 di ioSudo per la vista GIOCATORI.
- Mantiene la visualizzazione della fantasy squadra nella sezione XI, quando disponibile dalle rose di lega/listone.
- Aggiorna i cache-buster shell ioSudo e sezione Per i SUDATORI a V646.
- Conserva le informazioni gia presenti nel JSON storico e aggiunge i blocchi V646.

## Conteggi

- Squadre: 20
- Giocatori: 714
- Amichevoli/eventi: 121
- Trattative/rumor: 371
- Ufficialita in entrata: 142
- Ufficialita in uscita: 152
- Infortunati/SOS: 8
- Fonti: 219
- Righe update v22: 18

## Verifiche

```bash
node static/fanta-engine/tools/audit-sudatori-section-v646.mjs
node static/fanta-engine/tools/audit-iosudo-v646.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v646.js
node --check static/fanta-engine/js/sections/sudatori-section-v646.js
node --check static/iosudo/sw.js
```
