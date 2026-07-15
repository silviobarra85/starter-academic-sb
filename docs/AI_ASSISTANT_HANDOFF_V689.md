# AI Assistant Handoff V689 - ioSudo

Overlay generato da `fantacalcio_serie_a_2026_27_aggiornato_2026-07-15_aggiornamento_globale_v39-1.xlsx`.

## Scopo

Aggiornare solo ioSudo mantenendo la logica introdotta nelle versioni V682-V688:

- RUMOR raggruppati per giocatore;
- UFFICIALITA raggruppate per giocatore;
- MERCATO squadra con sottosezioni apribili/chiudibili;
- GIOCATORI leggero, senza giocatori solo-rumor;
- header con data e ora dell'aggiornamento dati.

## Conteggi

```json
{
  "version": "V689",
  "sourceFile": "fantacalcio_serie_a_2026_27_aggiornato_2026-07-15_aggiornamento_globale_v39-1.xlsx",
  "generatedAt": "2026-07-15T20:25:49+02:00",
  "players": 717,
  "talks": 568,
  "officialMoves": 311,
  "officialIncoming": 150,
  "officialOutgoing": 161,
  "friendlies": 90,
  "friendliesFilteredOut": 17,
  "injuries": 16,
  "sources": 455,
  "updateRows": 20
}
```

## File principali

- `static/fanta-engine/data/sudatori/current/sudatori-data.json`
- `static/fanta-engine/data/sudatori/current/manifest.json`
- `static/fanta-engine/js/apps/iosudo-app-v689.js`
- `static/fanta-engine/css/iosudo-app-v689.css`
- `static/iosudo/index.html`
- `static/iosudo/sw.js`
