# Release V368 - Dashboard pubblicazione Admin protetta

## Obiettivo

Rendere piu' sicuro il momento di pubblicazione aggiungendo un cruscotto Admin read-only che riassume i controlli gia' esistenti senza cambiare flussi o dati.

## Modifiche runtime

- Aggiornata versione runtime a V368.
- Aggiornati cache-buster e footer su `index.html`, `competition.html`, `player.html`.
- Aggiunto pannello Admin `Cruscotto pre-deploy`.
- Aggiunto marker `window.ZonaOrientaleAdminPublicationDashboardV368`.
- Reso lo smoke test V367 tollerante verso release successive.

## Garanzie no-regression

- Nessuna funzionalita' rimossa.
- Nessun file runtime cancellato.
- Nessuna scrittura Firebase aggiunta.
- Nessuna modifica a `docs/zonaorientale/FUNZIONALITA'.md`.
- Pannelli V189/V190/V191 preservati.
- V367 smoke test preservato.
- Trattative reali e simulazioni local-only non toccate.

## Verifiche

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/js/market/transfer-market.js
node static/zonaorientale/tools/audit-protected-regression-v367.mjs
node static/zonaorientale/tools/audit-publication-dashboard-v368.mjs
bash static/zonaorientale/tools/check-zonaorientale.sh
```
