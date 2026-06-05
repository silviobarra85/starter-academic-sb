# Matrice audit simulatore trade dev V348

Data: 05/06/2026

## Scope

Audit mirato di `assets/js/dev/trade-notification-simulator-v254.js` rispetto al modulo canonico `assets/js/dev/trade-notification-simulator-v255.js`.

## Esito

| Controllo | Esito | Nota |
| --- | --- | --- |
| V255 presente | OK | modulo attivo e importato dal runtime |
| V254 presente | OK | conservato solo come candidato review |
| Runtime importa V255 | OK | import in `assets/app.js` su `./js/dev/trade-notification-simulator-v255.js?v=<versione>` |
| Runtime importa V254 | OK | nessun import runtime a V254 |
| HTML pubblici importano simulatori dev | OK | nessun link diretto da `index.html`, `competition.html`, `player.html` |
| Alias console V254 in V255 | OK | `window.ZonaOrientaleTradeSimulatorV254 = api` preserva compatibilita |
| Comandi diagnostici V255 | OK | V255 include `getTestCommands`, `help`, `printHelp`, `runLocalSmokeTest` |

## Raccomandazione

Non rimuovere `assets/js/dev/trade-notification-simulator-v254.js` in questa release. La rimozione puo essere una V successiva, ma solo dopo test manuale di:

- `ZonaOrientaleTradeSimulatorV255.help()`;
- `ZonaOrientaleTradeSimulatorV255.runLocalSmokeTest()`;
- badge notifiche Fantamercato;
- proposta ricevuta/inviata simulata;
- `markAllOutcomeSeen()` se Firebase lo consente.

## Policy

Ogni rimozione deve essere isolata in una versione dedicata, con tool audit, documentazione e comandi `git rm` separati.

## Aggiornamento V350

Dopo l'audit V348 e la correzione V349, `assets/js/dev/trade-notification-simulator-v254.js` e stato rimosso in V350. La compatibilita console V254 resta garantita dall'alias esposto dal modulo V255.
