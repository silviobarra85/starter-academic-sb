# Handoff V477 - Dashboard presidente FantaMantraManager

## Contesto

Il progetto contiene due siti statici distinti nella repo `starter-academic-sb`:

- `static/zonaorientale/`
- `static/fantapetillomantramanager/`

Questa modifica riguarda solo FantaMantraManager. La cartella storica resta `fantapetillomantramanager`, anche se il nome pubblico e stato rinominato in `FantaMantraManager` in V475.

## Stato precedente rilevante

- V472: footer/news isolati multi-lega.
- V473: tool sorteggio giornate per entrambe le leghe.
- V474: regolamento PDF 2026-2027 solo FantaMantraManager.
- V475: rename pubblico a FantaMantraManager e nuovo logo/favicon.
- V476: rimozione banner bootstrap e Area Squadra visibile per FantaMantraManager.

## Richiesta V477

Per FantaMantraManager:

1. nascondere la card `Svincola Giocatori` dalla dashboard/Area Squadra presidente;
2. nascondere la card `Comunicato avvenuto scambio`;
3. non mostrare la Dashboard Presidente quando il login e Admin.

ZonaOrientale non deve essere toccato.

## Soluzione applicata

In `assets/app.js` e stato aggiunto il layer V477:

- `renderPresidentDashboardV369` viene wrappata: se `state.isAdmin` e vero ritorna `''`;
- `renderPresidentNotificationCenterV370` viene wrappata con la stessa logica, per evitare blocchi presidente in sessione Admin;
- `enhanceTransferCommunicationPresidentAreaV242` e `enhancePlayerReleasePresidentAreaV261` sono sostituite da cleanup no-op;
- il cleanup rimuove pannelli e pulsanti mobile legacy se altri wrapper precedenti provano a reiniettarli;
- `renderAll` e `renderUserAreaV34` applicano il cleanup dopo ogni render.

## File overlay

L'overlay contiene solo file FantaMantraManager effettivamente modificati e docs FantaMantraManager:

- `fantapetillomantramanager/assets/app.js`
- `fantapetillomantramanager/assets/league-config.json`
- `fantapetillomantramanager/index.html`
- `fantapetillomantramanager/competition.html`
- `fantapetillomantramanager/player.html`
- `fantapetillomantramanager/bilanci.html`
- `fantapetillomantramanager/news.html`
- `fantapetillomantramanager/tools/audit-president-area-v477.mjs`
- `docs/fantapetillomantramanager/README.md`
- `docs/fantapetillomantramanager/PRESIDENT_DASHBOARD_V477.md`
- `docs/fantapetillomantramanager/HANDOFF_V477_PRESIDENT_DASHBOARD.md`

## Verifica

```bash
cd static/fantapetillomantramanager
node tools/audit-president-area-v477.mjs
```

Controllare anche manualmente:

- login Admin: non deve apparire la Dashboard Presidente;
- login presidente: non devono apparire `Svincola Giocatori` e `Comunicato avvenuto scambio`;
- Area Squadra deve restare raggiungibile.

## Vincoli da mantenere

- Mai cancellare funzionalita se non richiesto esplicitamente.
- Non toccare ZonaOrientale per modifiche FantaMantraManager-only.
- Consegnare overlay con soli file modificati.
- Aggiornare docs e handoff a ogni overlay.
