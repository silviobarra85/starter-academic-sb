# Refactor V144 - Area squadra mobile operativa

Data: 2026-05-20
Branch: `feature/zonaorientale-competizioni-statiche`

## Obiettivo

Migliorare solo la vista mobile di `#teamarea`, lasciando invariata la resa desktop/web.

## Modifiche

- Aggiunto hub mobile in Area squadra con riepilogo rapido della squadra.
- Aggiunti contatori mobile: giocatori in vendita, trattative inviate pendenti, trattative ricevute pendenti.
- Aggiunte azioni rapide mobile:
  - La mia rosa;
  - Tutte le rose;
  - Mercato;
  - Proposta;
  - Trattative;
  - Comunicato.
- Migliorata leggibilita mobile del form `Proponi svincolo`.
- Migliorate card e azioni mobile delle trattative.

## File

- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/assets/css/mobile-teamarea-v144.css`

## Note

La modifica non tocca Firebase, non cambia desktop, non cambia la logica di invio/accettazione/rifiuto trattative.
