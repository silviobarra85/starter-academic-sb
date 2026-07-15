# AI Assistant Handoff V674 - ioSudo

Overlay generato per aggiornare ioSudo dal file Excel `fantacalcio_serie_a_2026_27_aggiornato_2026-07-15_aggiornamento_globale_v28.xlsx`.

## Perimetro

- Solo ioSudo e dati condivisi Sudatori usati da ioSudo.
- Non modifica il sito principale, le card mobile del sito, le rose JSON di lega o i listoni.
- Mantiene GIOCATORI leggero: rose Serie A + listone + rose fantasy; i giocatori solo-rumor restano in RUMOR/UFFICIALITÀ.

## Conteggi V674

- Giocatori: 714
- Trattative/Rumor: 468
- Ufficialità: 298
- Amichevoli effettive: 90
- SOS/Infortunati: 12
- Fonti: 300
- Righe aggiornamento v28: 22

## File principali

- `static/fanta-engine/data/sudatori/current/sudatori-data.json`
- `static/fanta-engine/data/sudatori/current/manifest.json`
- `static/fanta-engine/js/apps/iosudo-app-v674.js`
- `static/fanta-engine/css/iosudo-app-v674.css`
- `static/iosudo/index.html`
- `static/iosudo/sw.js`
- `static/fanta-engine/tools/audit-iosudo-v674.mjs`
