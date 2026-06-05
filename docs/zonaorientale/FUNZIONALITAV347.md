# FUNZIONALITAV347 - ZonaOrientale

Versione: V347 cleanup controllato duplicato simulatore trade  
Data: 05/06/2026

## Obiettivo della release

La V347 rimuove in modo controllato il duplicato top-level `assets/js/trade-notification-simulator-v255.js`. Il runtime continua a usare la copia canonica gia importata da `assets/js/dev/trade-notification-simulator-v255.js`.

La release non cambia UI, dati, Firebase, Netlify Functions o logiche di business.

## Funzionalita preservate

- Home pubblica con sezioni principali, navigazione desktop/mobile e footer versione.
- Calciomercato con feed RSS/HTML, fonti TMW squadra, archivio statico, filtri, card compatte, fallback immagini/favicon/TMW, tag giocatore, matching conservativo, timeline giocatore in modal e pannello Solo Admin.
- Listone con stagione selezionata, ricerca, ruoli, filtro `Modifiche`, colonna `Modifica`, usciti storici ed export CSV riservato Admin.
- Rose, pagina squadra e pagina giocatore standalone.
- Fantamercato interno, inclusi flussi trade e notifiche.
- Simulatore notifiche trade dev V255 tramite `assets/js/dev/trade-notification-simulator-v255.js`.
- Dashboard Presidente.
- Area Admin generale, Diagnostica dati con timestamp ultimo refresh, richieste presidenti e convertitore listone.
- Firebase/Auth/EmailJS.
- Netlify Functions e share News/WhatsApp.
- Mobile bottom navigation, menu `Altro`, pulsante Su e viewport mobile adattivo.

## Modifica tecnica

- Rimosso il file duplicato non canonico `static/zonaorientale/assets/js/trade-notification-simulator-v255.js`.
- Preservato il file canonico `static/zonaorientale/assets/js/dev/trade-notification-simulator-v255.js`.
- Aggiunto tool `static/zonaorientale/tools/audit-trade-simulator-v347.mjs`.
- Aggiunta diagnostica runtime `window.ZonaOrientaleTradeSimulatorCleanupV347`.
- Aggiornato `check-zonaorientale.sh` per verificare assenza del duplicato, presenza della copia canonica e documentazione V347.
- Aggiornati cache-buster, footer e `DEPLOY_EXPECTED_VERSION_V181` a V347.

## Funzionalita a rischio e mitigazione

| Area | Rischio | Mitigazione V347 |
| --- | --- | --- |
| Notifiche trade dev | rimuovere il file importato davvero | audit dedicato verifica che `app.js` importi `assets/js/dev/trade-notification-simulator-v255.js?v=347` |
| Fantamercato interno | scollegare merge simulazioni locali | nessun cambio al modulo canonico o ai call-site in `app.js` |
| Workflow Admin/Fantamercato | perdere strumenti di test | il modulo dev V255 resta presente e importato |
| Link storici | eventuale link diretto al duplicato top-level | audit verifica assenza di link in `index.html`, `competition.html`, `player.html`; documentazione storica resta solo come nota |

## Candidati ancora da valutare, NON rimossi

| File | Stato | Policy |
| --- | --- | --- |
| `assets/js/dev/trade-notification-simulator-v254.js` | candidato review | vecchia versione dev; non rimuovere senza test notifiche trade dedicato |
| `assets/js/refactor/admin-publication-workflow-v213.js` | candidato review | storico Admin/pubblicazione; non rimuovere senza test Admin dedicato |
| `assets/css/mobile-hotfix-v166.css` | candidato review | hotfix mobile storico; verificare mobile light/dark |
| `assets/css/mobile-hotfix-v167.css` | candidato review | hotfix mobile storico; verificare mobile light/dark |
| `assets/css/refactor/theme-light-suspended.css` | candidato review | tema sospeso/storico; non rimuovere senza verifica rollback/light theme |
| `assets/js/domain/competitions.js` | candidato review | modulo dominio competizioni; non rimuovere senza verifica `competition.html` e orchestratori |

## Cosa non e' stato modificato

- `docs/zonaorientale/FUNZIONALITA'.md`.
- Netlify Functions.
- `assets/calciomercato/links.json`.
- Archivi JSON Calciomercato.
- JSON Listone.
- CSS runtime.
- Logiche Firebase/Auth/EmailJS.
- Rendering card Calciomercato, filtri, Admin, Listone, Rose e Dashboard Presidente.

## Verifiche consigliate dopo applicazione

```bash
static/zonaorientale/tools/audit-trade-simulator-v347.mjs
static/zonaorientale/tools/check-zonaorientale.sh
```
