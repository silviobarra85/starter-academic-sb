# Matrice candidati legacy V342

Data: 05/06/2026  
Origine: `node static/zonaorientale/tools/audit-legacy-dependencies-v342.mjs --quiet`

## Esito sintetico

- Nessun riferimento locale mancante rilevato.
- Presenti candidati versionati superati e altri file non referenziati direttamente.
- Nessun file e' stato rimosso in V342.

## Candidati e rischio

| File | Motivo audit | Rischio | Prossima azione consigliata |
| --- | --- | --- | --- |
| `assets/css/mobile-hotfix-v166.css` | versione piu recente: `mobile-hotfix-v167.css` | Medio | verificare import HTML, regressioni mobile e storico prima di rimuovere |
| `assets/css/mobile-hotfix-v167.css` | non referenziato direttamente | Medio | verificare se realmente non piu collegato, poi eventuale rimozione isolata |
| `assets/css/refactor/mobile-controls-v291.css` | alias stabile `mobile-controls.css` | Medio | candidato per V343 se confermato da test mobile |
| `assets/css/refactor/mobile-controls-v292.css` | alias stabile `mobile-controls.css` | Medio | candidato per V343 se confermato da test mobile |
| `assets/css/refactor/rosters-tables-v291.css` | alias stabile `rosters-tables.css` | Medio | verificare Rose/Listone mobile prima di rimuovere |
| `assets/css/refactor/rosters-tables-v292.css` | alias stabile `rosters-tables.css` | Medio | verificare Rose/Listone mobile prima di rimuovere |
| `assets/css/refactor/theme-light-suspended-v292.css` | alias stabile `theme-light-suspended.css` | Basso/Medio | verificare tema Light e classi sospese prima di rimuovere |
| `assets/js/calciomercato/calciomercato-players-v335.js` | versione piu recente: `calciomercato-players-v340.js` | Medio/Alto | non rimuovere finche matching/tag/timeline non sono testati a fondo |
| `assets/js/calciomercato/calciomercato-players-v337.js` | versione piu recente: `calciomercato-players-v340.js` | Medio/Alto | non rimuovere insieme a V335; verificare import e fallback |
| `assets/js/dev/trade-notification-simulator-v254.js` | versione piu recente: `trade-notification-simulator-v255.js` | Medio | verificare Admin/dev simulator prima di rimuovere |
| `assets/js/refactor/admin-publication-workflow-v213.js` | non referenziato direttamente | Medio | verificare workflow Admin/pubblicazione e documentazione storica |
| `assets/js/trade-notification-simulator-v255.js` | non referenziato direttamente | Medio | attenzione: esiste anche `assets/js/dev/trade-notification-simulator-v255.js` |
| `assets/js/utils/shared-helpers-v294.js` | rimosso in V345 dopo audit dedicato | Risolto | non ripristinare; usare V295 + bridge V341 |

## Regola operativa

La prossima pulizia deve scegliere un solo gruppo, preferibilmente CSS refactor versionati vecchi, e produrre una release dedicata con test browser mobile/desktop. Non cancellare JS Calciomercato legacy nella stessa release dei CSS.

## Output audit sintetico

```text
OK: nessun riferimento locale mancante rilevato.

Candidati versionati superati:
- assets/css/mobile-hotfix-v166.css
- assets/css/mobile-hotfix-v167.css
- assets/css/refactor/mobile-controls-v291.css
- assets/css/refactor/mobile-controls-v292.css
- assets/css/refactor/rosters-tables-v291.css
- assets/css/refactor/rosters-tables-v292.css
- assets/css/refactor/theme-light-suspended-v292.css
- assets/js/calciomercato/calciomercato-players-v335.js
- assets/js/calciomercato/calciomercato-players-v337.js
- assets/js/dev/trade-notification-simulator-v254.js
- assets/js/refactor/admin-publication-workflow-v213.js
- assets/js/trade-notification-simulator-v255.js
- assets/js/utils/shared-helpers-v294.js
```

## Aggiornamento V344

I candidati `assets/js/calciomercato/calciomercato-players-v335.js` e `assets/js/calciomercato/calciomercato-players-v337.js` sono stati rimossi in V344 dopo verifica che il runtime importa direttamente `assets/js/calciomercato/calciomercato-players-v340.js`.

Restano volutamente in `assets/app.js` alcuni wrapper con suffisso V335/V337 per compatibilita runtime; non sono file da rimuovere e non vanno rinominati automaticamente.

## Aggiornamento V350

Il candidato `assets/js/dev/trade-notification-simulator-v254.js` e stato rimosso nella V350 dopo audit V348 e correzione azioni locali V349. Non va reintrodotto: usare `assets/js/dev/trade-notification-simulator-v255.js`.


## Aggiornamento V351

`assets/js/refactor/admin-publication-workflow-v213.js` verificato con audit dedicato. Risulta non importato direttamente; resta in review e non viene rimosso in V351.

## Aggiornamento V352

- `assets/css/mobile-hotfix-v166.css`: rimosso in V352 come file sciolto; regole preservate in `assets/css/mobile-suite-v168.css`.
- `assets/css/mobile-hotfix-v167.css`: rimosso in V352 come file sciolto; regole preservate in `assets/css/mobile-suite-v168.css`.
- Audit dedicato: `static/zonaorientale/tools/audit-mobile-hotfix-v352.mjs`.

## Aggiornamento V353

- `assets/css/refactor/theme-light-suspended.css`: audit completato. Resta conservato e non importato dagli HTML. Non rimosso in V353 perche utile come archivio/rollback della Light mode.
- `assets/js/domain/competitions.js`: audit completato. Resta conservato e non importato dal runtime corrente. Non rimosso in V353 perche l'area Competizioni richiede test manuale dedicato.
- Audit dedicato: `static/zonaorientale/tools/audit-theme-competitions-v353.mjs`.

