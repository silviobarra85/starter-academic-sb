# AI Assistant Handoff V682 - ioSudo

Overlay generato per aggiornare ioSudo dal file Excel `fantacalcio_serie_a_2026_27_aggiornato_2026-07-15_aggiornamento_globale_v29(1).xlsx`.

## Perimetro

- Solo ioSudo e dati condivisi Sudatori usati da ioSudo.
- Non modifica il sito principale, le card mobile del sito, le rose JSON di lega o i listoni.
- Mantiene GIOCATORI leggero: rose Serie A + listone + rose fantasy; i giocatori solo-rumor restano in RUMOR/UFFICIALITÀ.

## Conteggi V682

- Giocatori: 714
- Trattative/Rumor: 484
- Ufficialità: 299
- Amichevoli effettive: 90
- SOS/Infortunati: 14
- Fonti: 318
- Righe aggiornamento v29: 18

## File principali

- `static/fanta-engine/data/sudatori/current/sudatori-data.json`
- `static/fanta-engine/data/sudatori/current/manifest.json`
- `static/fanta-engine/js/apps/iosudo-app-v682.js`
- `static/fanta-engine/css/iosudo-app-v682.css`
- `static/iosudo/index.html`
- `static/iosudo/sw.js`
- `static/fanta-engine/tools/audit-iosudo-v682.mjs`
