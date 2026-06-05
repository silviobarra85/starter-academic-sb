# FUNZIONALITAV353 - Audit tema Light sospeso e dominio competizioni

## Scopo versione

La V353 esegue un audit mirato, senza rimozioni automatiche, su due candidati legacy rimasti dopo il cleanup V352:

- `assets/css/refactor/theme-light-suspended.css`
- `assets/js/domain/competitions.js`

## Esito funzionale

Nessuna funzionalita cambia comportamento in V353.

## Funzionalita preservate

- Dashboard pubblica e privata.
- Calciomercato, feed RSS/HTML, archivio statico e pannello Solo Admin.
- Card compatte Calciomercato, fallback immagini e timeline giocatore modal.
- Listone, filtro Modifiche, export CSV Admin e manifest Listoni.
- Rose, pagine squadra e pagina giocatore.
- Competizioni, `competition.html`, ordinamento competizioni e gruppi pubblici.
- Fantamercato interno, trattative, notifiche reali e simulatore V255.
- Admin, Diagnostica dati, Stato Firebase/JSON e preflight asset pubblici.
- Firebase/Auth/EmailJS e Netlify Functions.
- Navigazione mobile, menu Altro e tema corrente.

## File auditati

- `theme-light-suspended.css` resta conservato come archivio/rollback della Light mode. Non e importato dagli HTML.
- `domain/competitions.js` resta conservato come modulo storico non importato. Le funzioni canoniche per competizioni restano inline in `assets/app.js`.

## File nuovi

- `static/zonaorientale/tools/audit-theme-competitions-v353.mjs`
- `docs/zonaorientale/audit/THEME_COMPETITIONS_AUDIT_MATRIX_V353.md`
- `docs/zonaorientale/handoff/HANDOFF_NUOVO_ASSISTENTE_V353.md`
- `docs/zonaorientale/refactor/THEME_COMPETITIONS_AUDIT_V353.md`
- `docs/zonaorientale/release/RELEASE_V353_THEME_COMPETITIONS_AUDIT.md`

## Marker runtime

```js
window.ZonaOrientaleThemeCompetitionsAuditV353
```

## Decisione V353

Audit-only. Nessun `git rm` richiesto in questa versione.
