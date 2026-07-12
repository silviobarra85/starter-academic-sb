# AI Assistant Handoff - V609

## Obiettivo
Introdurre **ioSudo**, mini app PWA installabile e mobile-first che espone solo le informazioni della sezione **Per i SUDATORI**.

## Decisione architetturale
- Nessun database separato.
- Nessun Excel separato.
- Nessun JSON duplicato.
- L'app legge sempre `static/fanta-engine/data/sudatori/current/manifest.json` e poi il file indicato dal campo `current`.

## File aggiunti
- `static/iosudo/index.html`
- `static/iosudo/manifest.webmanifest`
- `static/iosudo/sw.js`
- `static/iosudo/assets/icon.svg`
- `static/iosudo/assets/icon-192.png`
- `static/iosudo/assets/icon-512.png`
- `static/fanta-engine/js/apps/iosudo-app-v609.js`
- `static/fanta-engine/css/iosudo-app-v609.css`
- `static/fanta-engine/tools/audit-iosudo-v609.mjs`
- `static/zonaorientale/iosudo/index.html`
- `static/fantapetillomantramanager/iosudo/index.html`

## File modificati
- `static/zonaorientale/index.html`
- `static/fantapetillomantramanager/index.html`
- `static/zonaorientale/assets/league-config.json`
- `static/fantapetillomantramanager/assets/league-config.json`
- `docs/AI_ASSISTANT_HANDOFF_CURRENT.md`
- `docs/OVERLAY_ROADMAP.md`
- documenti indice delle due leghe.

## Funzioni app
- Home KPI: squadre, giocatori, ufficialita, trattative, SOS, amichevoli.
- Ricerca squadra/giocatore.
- Filtri rapidi: tutto, nuovi, rumor, SOS, XI.
- Scheda squadra con tab XI, mercato, SOS, rosa e amichevoli.
- Campetto ordinato con ruoli sinistri a sinistra e destri a destra.
- Badge mercato coerenti: NUOVO, RUMOR, CONFERMATO.
- Link fonti mercato dove presenti.

## Guardrail
Ogni aggiornamento futuro del file Sudatori aggiornera automaticamente ioSudo, perche l'app legge sempre il manifest corrente.
