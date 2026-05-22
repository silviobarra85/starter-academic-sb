# V182 - Auth dashboard e report wrap

Data: 21/05/2026

## Obiettivi

- Evitare overflow nelle tabelle generate da `Controlla asset pubblici` e `Checklist online finale`, mandando a capo i valori lunghi dentro la stessa cella.
- Far atterrare admin e presidenti sulla Dashboard dopo login e logout.
- Aggiornare Version footer e cache-buster a V182.

## File modificati

- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/assets/styles.css`
- `static/zonaorientale/assets/css/mobile-suite-v168.css`

## Dettagli tecnici

### Report pre-online

Sono state aggiunte regole CSS mirate per:

- `.public-preflight-report-v179`
- `.deploy-checklist-report-v180`

Le celle delle tabelle ora usano `table-layout: fixed`, `white-space: normal`, `overflow-wrap: anywhere` e `word-break: break-word` per evitare sforamenti su mobile e desktop.

### Login/logout

È stato aggiunto un layer V182 che intercetta in capture phase:

- submit del form login email/password
- click su login Google
- click su Logout

In tutti i casi imposta la pagina SPA su `dashboard` prima/dopo il cambio stato Firebase Auth. Un breve follow-up su `onAuthStateChanged` mantiene la destinazione stabile dopo `renderAll()`.

### Version

Footer e cache-buster asset aggiornati a V182.

## Test consigliati

1. Mobile → Admin leggero → `Controlla asset pubblici`: verificare che URL e dettagli lunghi vadano a capo nella cella.
2. Mobile → Admin leggero → `Checklist online finale`: verificare che dettagli lunghi vadano a capo nella cella.
3. Login admin da una pagina diversa dalla Dashboard: deve atterrare su Dashboard.
4. Logout admin da una pagina diversa dalla Dashboard: deve atterrare su Dashboard.
5. Login presidente da una pagina diversa dalla Dashboard: deve atterrare su Dashboard.
6. Logout presidente da una pagina diversa dalla Dashboard: deve atterrare su Dashboard.
