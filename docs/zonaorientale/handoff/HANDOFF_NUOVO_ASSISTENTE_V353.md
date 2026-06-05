# Handoff nuovo assistente - V353

Versione corrente: V353.

## Ultima modifica

Audit-only su:

- `assets/css/refactor/theme-light-suspended.css`
- `assets/js/domain/competitions.js`

Nessun file e stato rimosso. Non serve `git rm` dopo applicazione zip.

## Marker runtime

```js
window.ZonaOrientaleThemeCompetitionsAuditV353
```

Smoke test browser:

```js
window.ZonaOrientaleThemeCompetitionsAuditV353.runSmokeTest()
```

## Tool

```bash
static/zonaorientale/tools/audit-theme-competitions-v353.mjs
static/zonaorientale/tools/check-zonaorientale.sh
```

## Funzionalita da preservare obbligatoriamente

- Calciomercato completo, inclusi feed TMW, archivio statico, card compatte, tag giocatore e modal timeline.
- Listone, filtro Modifiche, export CSV Admin.
- Rose, pagina squadra, player page.
- Competizioni e `competition.html`.
- Fantamercato interno, notifiche reali e simulatore V255.
- Admin, Diagnostica dati, Stato Firebase/JSON e preflight.
- Firebase/Auth/EmailJS, Netlify Functions e mobile navigation.

## Prossimo step consigliato

V354: consolidamento finale con matrice cleanup aggiornata e piano prossime attivita. Evitare rimozioni ulteriori senza test manuale mirato.

## Nota importante

Non modificare `docs/zonaorientale/FUNZIONALITA'.md` senza richiesta esplicita dell'utente.
