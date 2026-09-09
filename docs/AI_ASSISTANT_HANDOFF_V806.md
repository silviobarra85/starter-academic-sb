# ZonaOrientale V806 - Recupero password

Data: 09/09/2026

## Modifica
- Aggiunto pulsante `Password dimenticata?` al dialog di login.
- L'utente inserisce la propria email e Firebase Authentication invia il link di reimpostazione password tramite `sendPasswordResetEmail`.
- La password precedente non viene letta o recuperata dal sito.
- Il messaggio di esito e' volutamente neutro per non rivelare se un indirizzo email esiste tra gli account.

## File runtime coinvolti
- `static/fanta-engine/js/firebase/firebase-adapter-v499.js`
- `static/zonaorientale/assets/firebase.js`
- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/index.html`
- `static/zonaorientale/release.json`
- `static/zonaorientale/assets/league-config.json`
- `static/zonaorientale/assets/js/core/league-config-v443.js`

## Verifiche
- `audit-zona-password-reset-v806.mjs`: 8/8
- `audit-static-first-v760.mjs`: 42/42
- `audit-admin-card-visibility-v763.mjs`: 71/71
- Sintassi JavaScript verificata con `node --check`.
