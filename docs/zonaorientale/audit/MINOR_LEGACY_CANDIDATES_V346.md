# Matrice candidati legacy minori - V346

La V346 non rimuove file. Questa matrice serve a decidere le prossime rimozioni controllate, una release alla volta.

| Candidato | Evidenza | Rischio se rimosso subito | Azione consigliata |
| --- | --- | --- | --- |
| `assets/js/dev/trade-notification-simulator-v254.js` | versione precedente rispetto a `assets/js/dev/trade-notification-simulator-v255.js` | basso/medio: possibile uso manuale dev | verificare simulatori trade e poi eventuale V dedicata |
| `assets/js/trade-notification-simulator-v255.js` | duplicato top-level; runtime importa la copia in `assets/js/dev/` | basso/medio: possibile link storico non rilevato | grep completo + test Admin/Fantamercato prima di rimozione |
| `assets/js/refactor/admin-publication-workflow-v213.js` | non importato direttamente dagli entrypoint correnti | medio: area Admin/pubblicazione storica | non rimuovere senza test su workflow pubblicazione e comunicati |
| `assets/css/mobile-hotfix-v166.css` | non referenziato dagli HTML correnti | medio: hotfix storico mobile | valutare insieme a `mobile-hotfix-v167.css` in una sola V CSS |
| `assets/css/mobile-hotfix-v167.css` | non referenziato dagli HTML correnti | medio: hotfix storico mobile | test mobile light/dark prima di rimozione |
| `assets/css/refactor/theme-light-suspended.css` | non referenziato direttamente | medio: tema sospeso/rollback | lasciare finche non si decide policy tema light |
| `assets/js/domain/competitions.js` | non importato direttamente | medio: dominio competizioni/refactor futuri | verificare `competition.html`, orchestratori e storico release |

## Regola operativa

- Non cancellare piu di un gruppo alla volta.
- Ogni cleanup deve avere zip dedicato, test dedicato e documento release dedicato.
- Prima di cancellare: `grep`, audit asset, audit CSS, check globale e test browser.
- Preservare tutte le funzionalita arrivate all'ultimo merge su master.

## Aggiornamento V350

`assets/js/dev/trade-notification-simulator-v254.js` e stato rimosso in modo controllato nella V350. Il modulo attivo resta `assets/js/dev/trade-notification-simulator-v255.js`, che mantiene anche l'alias console `ZonaOrientaleTradeSimulatorV254`.


## Aggiornamento V351

- `assets/js/refactor/admin-publication-workflow-v213.js`: audit completato. Non importato dal runtime corrente, ma tenuto per prudenza storica. Non rimosso in V351.

## Aggiornamento V352

- `assets/css/mobile-hotfix-v166.css`: rimosso in V352 come file sciolto; regole preservate in `assets/css/mobile-suite-v168.css`.
- `assets/css/mobile-hotfix-v167.css`: rimosso in V352 come file sciolto; regole preservate in `assets/css/mobile-suite-v168.css`.
- Audit dedicato: `static/zonaorientale/tools/audit-mobile-hotfix-v352.mjs`.

## Aggiornamento V353

- `assets/css/refactor/theme-light-suspended.css`: audit completato. Resta conservato e non importato dagli HTML. Non rimosso in V353 perche utile come archivio/rollback della Light mode.
- `assets/js/domain/competitions.js`: audit completato. Resta conservato e non importato dal runtime corrente. Non rimosso in V353 perche l'area Competizioni richiede test manuale dedicato.
- Audit dedicato: `static/zonaorientale/tools/audit-theme-competitions-v353.mjs`.

