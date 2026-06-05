# FUNZIONALITAV346 - ZonaOrientale

Versione: V346 audit candidati legacy minori  
Data: 05/06/2026

## Obiettivo della release

La V346 e' una release di audit-only: non cancella file e non cambia UI o dati. Serve a classificare i candidati legacy minori rimasti dopo le pulizie V343-V345 e a preparare eventuali rimozioni future in versioni dedicate, una alla volta.

## Funzionalita preservate

- Home pubblica con sezioni principali, navigazione desktop/mobile e footer versione.
- Calciomercato con feed RSS/HTML, fonti TMW squadra, archivio statico, filtri, card compatte, fallback immagini/favicon/TMW, tag giocatore, matching conservativo, timeline giocatore in modal e pannello Solo Admin.
- Listone con stagione selezionata, ricerca, ruoli, filtro `Modifiche`, colonna `Modifica`, usciti storici ed export CSV riservato Admin.
- Rose, pagina squadra e pagina giocatore standalone.
- Fantamercato interno e gestione mercato.
- Dashboard Presidente.
- Area Admin generale, Diagnostica dati con timestamp ultimo refresh, richieste presidenti e convertitore listone.
- Firebase/Auth/EmailJS.
- Netlify Functions e share News/WhatsApp.
- Mobile bottom navigation, menu `Altro`, pulsante Su e viewport mobile adattivo.

## Modifica tecnica

- Aggiunto tool `static/zonaorientale/tools/audit-minor-legacy-v346.mjs`.
- Aggiunta diagnostica runtime `window.ZonaOrientaleMinorLegacyAuditV346`.
- Aggiornato `check-zonaorientale.sh` per verificare tool, marker e documentazione V346.
- Aggiornati cache-buster, footer e `DEPLOY_EXPECTED_VERSION_V181` a V346.
- Nessun file e' stato rimosso in questa versione.

## Candidati classificati ma NON rimossi

| File | Stato | Policy |
| --- | --- | --- |
| `assets/js/dev/trade-notification-simulator-v254.js` | candidato review | versione dev precedente; non rimuovere senza test notifiche trade |
| `assets/js/trade-notification-simulator-v255.js` | candidato review | possibile duplicato top-level; app importa `assets/js/dev/trade-notification-simulator-v255.js` |
| `assets/js/refactor/admin-publication-workflow-v213.js` | candidato review | storico Admin/pubblicazione; non rimuovere senza test Admin dedicato |
| `assets/css/mobile-hotfix-v166.css` | candidato review | hotfix mobile storico; verificare mobile light/dark |
| `assets/css/mobile-hotfix-v167.css` | candidato review | hotfix mobile storico; verificare mobile light/dark |
| `assets/css/refactor/theme-light-suspended.css` | candidato review | tema sospeso/storico; non rimuovere senza verifica rollback/light theme |
| `assets/js/domain/competitions.js` | candidato review | modulo dominio competizioni; non rimuovere senza verifica `competition.html` e orchestratori |

## Funzionalita a rischio e mitigazione

| Area | Rischio | Mitigazione V346 |
| --- | --- | --- |
| Notifiche trade/simulatore dev | rimuovere il file sbagliato | solo audit, nessuna rimozione |
| Admin pubblicazione/comunicati | scollegare workflow storico | solo classificazione, nessuna modifica al runtime |
| Mobile light/dark | perdere hotfix storico | nessuna rimozione CSS mobile |
| Competizioni | rimuovere modulo non importato direttamente ma utile a refactor futuri | nessuna rimozione e note in matrice |
| Calciomercato/Listone/Admin | regressioni da cleanup generico | controlli runtime V346 e check globale |

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
static/zonaorientale/tools/audit-minor-legacy-v346.mjs
static/zonaorientale/tools/check-zonaorientale.sh
```
