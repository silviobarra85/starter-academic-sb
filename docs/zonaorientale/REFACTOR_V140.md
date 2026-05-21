# V140 - Mobile Home a blocchi

Data: 2026-05-20
Branch consigliato: `feature/zonaorientale-mobile-block-ui`

## Obiettivo

Introdurre una nuova esperienza mobile a blocchi per la Dashboard, senza modificare la resa desktop del sito.

## File modificati

- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/app.js`

## File nuovi

- `static/zonaorientale/assets/css/mobile-block-ui-v140.css`
- `docs/zonaorientale/REFACTOR_V140.md`

## Cosa cambia

Solo da mobile, nella Dashboard viene mostrata una Home a blocchi con accessi rapidi a:

- Alert
- Competizioni / prossime partite
- Fantamercato / trattative
- Area squadra
- Listone
- Comunicati

La Dashboard desktop resta invariata. Il blocco mobile e nascosto fuori dalla UX mobile.

## Note tecniche

- CSS isolato in `assets/css/mobile-block-ui-v140.css`.
- Il file CSS usa media query mobile e `body.is-mobile-ux`.
- Il rendering dei blocchi e in `app.js`, wrapper V140 di `renderDashboard`.
- Non ci sono modifiche a Firebase, regole, import statici, competizioni o Admin.

## Test consigliati

- `/zonaorientale/#dashboard` da smartphone
- `/zonaorientale/#dashboard` da desktop, per verificare che sia invariata
- link rapidi verso Competizioni, Fantamercato, Area squadra, Listone e News
