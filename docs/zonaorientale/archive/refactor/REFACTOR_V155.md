# V155 - Mobile Competizioni a blocchi

Data: 2026-05-21
Branch: `feature/zonaorientale-competizioni-statiche`

## Obiettivo

Rendere la sezione mobile `Competizioni/Coppe` più compatta: invece di mostrare l'anteprima di tutte le partite di tutte le competizioni, mostrare una schermata a blocchi cliccabili, uno per competizione.

## Modifiche

- Desktop invariato.
- Mobile: `#competitions` mostra una card/blocco per ogni competizione.
- Ogni blocco è cliccabile e apre direttamente `competition.html`, come il pulsante `Apri competizione`.
- Ogni blocco mostra:
  - nome competizione;
  - stato;
  - se la competizione è `ATTIVA`, prossima partita programmata e data.
- Le vecchie card complete restano nel DOM solo per desktop e vengono nascoste via CSS su mobile.

## File

- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/assets/css/mobile-hotfix-v155.css`

## Test

- Mobile: `/zonaorientale/#competitions`
- Desktop: `/zonaorientale/#competitions`
- Verificare che da mobile i blocchi aprano la competizione corretta.
- Verificare che il desktop sia invariato.
