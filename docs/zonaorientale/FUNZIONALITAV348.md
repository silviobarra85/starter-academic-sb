# FUNZIONALITAV348 - ZonaOrientale

Versione: V348 audit simulatore trade dev  
Data: 05/06/2026

## Obiettivo della release

La V348 verifica in modo mirato il vecchio modulo `assets/js/dev/trade-notification-simulator-v254.js` rispetto al modulo attivo `assets/js/dev/trade-notification-simulator-v255.js`.

La release e' audit-only per questo candidato: non cancella file, non cambia UI, non cambia dati e non tocca Firebase o Netlify Functions.

## Esito tecnico

- Il runtime importa il simulatore trade canonico V255 da `assets/js/dev/trade-notification-simulator-v255.js`.
- Il modulo V254 non risulta importato dal runtime.
- Il modulo V255 mantiene l'alias console `window.ZonaOrientaleTradeSimulatorV254 = api`, quindi eventuali appunti/comandi storici V254 restano compatibili.
- Il modulo V255 contiene helper diagnostici aggiuntivi, tra cui `getTestCommands`, `help`, `printHelp` e `runLocalSmokeTest`.
- Il modulo V254 resta candidato review, ma non viene rimosso in V348.

## Funzionalita preservate

- Home pubblica con navigazione desktop/mobile e footer versione.
- Calciomercato con feed RSS/HTML, fonti TMW squadra, archivio statico, filtri, card compatte, fallback immagini/favicon/TMW, tag giocatore, matching conservativo, timeline giocatore in modal e pannello Solo Admin.
- Listone con stagione, ricerca, ruoli, filtro `Modifiche`, colonna `Modifica`, usciti storici ed export CSV Admin.
- Rose, pagina squadra e pagina giocatore standalone.
- Fantamercato interno, incluse notifiche trade, badge e simulatore dev V255.
- Dashboard Presidente.
- Area Admin generale, Diagnostica dati con timestamp ultimo refresh, richieste presidenti e convertitore listone.
- Firebase/Auth/EmailJS.
- Netlify Functions e share News/WhatsApp.
- Mobile bottom navigation, menu `Altro`, pulsante Su e viewport mobile adattivo.

## Funzionalita a rischio e mitigazione

| Area | Rischio | Mitigazione V348 |
| --- | --- | --- |
| Fantamercato interno | scollegare il simulatore trade usato dal runtime | nessuna modifica al modulo V255 e audit dedicato su import runtime |
| Notifiche trade | perdere comandi console storici V254 | V255 mantiene alias `window.ZonaOrientaleTradeSimulatorV254` |
| Cleanup legacy | cancellare V254 troppo presto | V348 non cancella file, classifica soltanto il candidato |
| Test futuri | non sapere quale modulo usare | documentata la copia attiva V255 e aggiunto tool `audit-trade-simulator-dev-v348.mjs` |

## File principali

- `static/zonaorientale/tools/audit-trade-simulator-dev-v348.mjs`
- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/tools/check-zonaorientale.sh`

## Marker runtime

```js
window.ZonaOrientaleTradeSimulatorDevAuditV348
```

## Verifiche consigliate dopo applicazione

```bash
static/zonaorientale/tools/audit-trade-simulator-dev-v348.mjs
static/zonaorientale/tools/check-zonaorientale.sh
```

## Candidati ancora da valutare, NON rimossi

| File | Stato | Policy |
| --- | --- | --- |
| `assets/js/dev/trade-notification-simulator-v254.js` | candidato review | rimuovere solo con V dedicata dopo test manuale simulatore V255 e badge Fantamercato |
| `assets/js/refactor/admin-publication-workflow-v213.js` | candidato review | non rimuovere senza test Admin/pubblicazione |
| `assets/css/mobile-hotfix-v166.css` | candidato review | verificare mobile light/dark prima di cleanup |
| `assets/css/mobile-hotfix-v167.css` | candidato review | verificare mobile light/dark prima di cleanup |
| `assets/css/refactor/theme-light-suspended.css` | candidato review | non rimuovere senza verifica tema light e rollback |
| `assets/js/domain/competitions.js` | candidato review | non rimuovere senza verifica `competition.html` e orchestratori |

## Cosa non e' stato modificato

- `docs/zonaorientale/FUNZIONALITA'.md`.
- Netlify Functions.
- `assets/calciomercato/links.json`.
- Archivi JSON Calciomercato.
- JSON Listone.
- CSS runtime.
- Logiche Firebase/Auth/EmailJS.
- Rendering card Calciomercato, filtri, Admin, Listone, Rose, Dashboard Presidente e Fantamercato.
