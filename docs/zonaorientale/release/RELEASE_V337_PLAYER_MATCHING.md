# Release V337 - Matching giocatore Calciomercato migliorato

Data: 05/06/2026

## Sintesi

V337 migliora il riconoscimento dei giocatori associati agli articoli Calciomercato. I nomi nei titoli vengono ora confrontati dopo una normalizzazione specifica che rimuove punteggiatura e separatori.

## Fix principale

Titoli come:

```text
Kalulu, ...
```

ora riconoscono correttamente il giocatore `Kalulu`, se presente nell'ultimo listone della stagione selezionata.

## File modificati

- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/assets/js/calciomercato/calciomercato-players-v337.js`
- `static/zonaorientale/tools/check-zonaorientale.sh`
- `static/zonaorientale/index.html`
- `static/zonaorientale/competition.html`
- `static/zonaorientale/player.html`
- documentazione V337 in `docs/zonaorientale/`

## Funzionalita preservate

- Timeline giocatore in modal V336.
- Tag giocatore V335.
- Refactor immagini V334.
- Card compatte V332.
- TMW squadra V329/V330.
- Listone V333/V331.
- Tutte le altre sezioni del sito.

## Test

- `node --check` su `app.js` e modulo V337.
- `check-zonaorientale.sh`.
- Audit asset/import.
- Audit CSS.
- Smoke test V337 su `Kalulu, ...`.
