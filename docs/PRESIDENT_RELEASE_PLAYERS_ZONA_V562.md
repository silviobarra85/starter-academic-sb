# V562 - Riattivazione Svincola Giocatori su ZonaOrientale

## Sintesi

V562 riattiva la card presidente `Svincola Giocatori` su ZonaOrientale tramite configurazione, senza cambiare il runtime della funzione e senza riattivare Calciomercato.

## Dettaglio tecnico

La funzionalita' era gia' presente in `static/zonaorientale/assets/app.js` con pannello `#teamPlayerReleasePanelV261`, ma veniva nascosta dal registry delle card perche' `release-players` era disabilitata.

La patch modifica:

- `features.presidentReleasePlayers: true`;
- `featureCardRegistry.cards[].id = release-players` con `enabled: true`;
- `featureKey: presidentReleasePlayers`;
- `currentVersion: 562`;
- cache-buster home `?v=562`;
- footer home ZonaOrientale `V562`;
- fallback config JS `league-config-v443.js`.

## Nota stagione corrente

La configurazione della lega viene anche allineata a `2026-2027`, includendo `multiSeasonDataAdapterV526.currentSeasonId` e la lista `seasons`, per evitare ritorni indesiderati al default `2025-2026`.

## Funzionalita non toccate

- Firebase/Auth.
- EmailJS e relativi template/service.
- Dashboard Admin.
- Dashboard Presidente diversa da `Svincola Giocatori`.
- Listone, Rose, Svincolati, Competizioni, Bilanci.
- Disattivazione Calciomercato V561.
