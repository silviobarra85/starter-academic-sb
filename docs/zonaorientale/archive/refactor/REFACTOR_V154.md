# REFACTOR V154 - Mobile competizioni in tabella

Data: 2026-05-21

## Obiettivo

Uniformare la resa mobile delle partite nella sezione `#competitions` e nella pagina `competition.html`.

## Modifiche

- Solo mobile: ogni fase/giornata mostra una tabella compatta con colonne `Partita`, `Data`, `Risultato`.
- Nella colonna `Partita`, le due squadre sono disposte una sopra l'altra.
- La colonna `Data` mostra la data se presente, altrimenti `-`.
- La colonna `Risultato` mostra il risultato se presente, altrimenti `-`.
- La modifica vale anche per la pagina singola competizione aperta con `Apri competizione`.
- Desktop invariato: resta la tabella completa esistente.

## File coinvolti

- `static/zonaorientale/index.html`
- `static/zonaorientale/competition.html`
- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/assets/css/mobile-hotfix-v154.css`
