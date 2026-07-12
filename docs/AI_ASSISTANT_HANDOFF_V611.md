# AI Assistant Handoff - V611

## Contesto

Overlay **V611** per **ioSudo**, la PWA installabile collegata alla sezione **Per i SUDATORI**.

## Modifiche principali

- I giocatori sono cliccabili e aprono il dettaglio giocatore.
- Il click funziona da:
  - campetto;
  - risultati ricerca;
  - tab Rosa.
- Aggiunta scheda dettaglio giocatore con badge mercato, SOS, probabile XI, fonti ufficialita/trattative/infortuni e dati fantasy disponibili.
- Le card giocatore sono colorate per ruolo:
  - P giallo;
  - D verde;
  - C blu;
  - A rosso.
- Quando una squadra e aperta, la card ricerca viene nascosta.
- Il menu sezioni squadra resta sticky in alto.

## File principali

- `static/iosudo/index.html`
- `static/iosudo/sw.js`
- `static/fanta-engine/js/apps/iosudo-app-v611.js`
- `static/fanta-engine/css/iosudo-app-v611.css`
- `static/fanta-engine/tools/audit-iosudo-v611.mjs`

## Verifica

```bash
node static/fanta-engine/tools/audit-iosudo-v611.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v611.js
node --check static/iosudo/sw.js
```
