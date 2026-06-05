# Matrice cleanup simulatore trade V347

Data: 05/06/2026

## Esito

| File | Stato V347 | Note |
| --- | --- | --- |
| `assets/js/trade-notification-simulator-v255.js` | rimosso | duplicato top-level non importato dal runtime |
| `assets/js/dev/trade-notification-simulator-v255.js` | preservato | copia canonica importata da `assets/app.js` |
| `assets/js/dev/trade-notification-simulator-v254.js` | candidato review | versione precedente, non importata; da valutare in V futura |

## Controlli richiesti

- `assets/app.js` deve importare `./js/dev/trade-notification-simulator-v255.js?v=347`.
- `assets/app.js` non deve importare `./js/trade-notification-simulator-v255.js`.
- `index.html`, `competition.html` e `player.html` non devono linkare il duplicato top-level.
- `static/zonaorientale/tools/audit-trade-simulator-v347.mjs` deve terminare con esito OK.

## Funzionalita preservate

- Fantamercato interno.
- Notifiche trade.
- Simulatore dev V255.
- Admin, Calciomercato, Listone, Rose, Dashboard Presidente, Firebase/Auth/EmailJS e Netlify Functions.

## Policy

La V347 rimuove un solo file. Gli altri candidati legacy minori restano in review e non vanno cancellati automaticamente.
