# AI Assistant handoff - V548

## Stato

Overlay V548: Calciomercato live feed recovery whole-site.

## Problema risolto

Dopo la rimozione dei fallback locali, Calciomercato poteva non mostrare articoli pur senza errori. Il recupero live dai siti deve passare dalla Netlify Function; il frontend non deve fare scraping diretto dei siti esterni.

V548 aggiunge un retry live senza filtro data e ripristina il fallback agli ultimi giorni archiviati nel path centrale.

## File modificati

- `static/zonaorientale/assets/app.js`
- `static/fantapetillomantramanager/assets/app.js`
- entrypoint HTML/cache-buster delle due leghe
- `assets/league-config.json` e `league-config-v443.js` delle due leghe
- `static/fanta-engine/tools/audit-calciomercato-live-feed-recovery-v548.mjs`
- `docs/CALCIOMERCATO_LIVE_FEED_RECOVERY_V548.md`
- `docs/OVERLAY_ROADMAP.md`
- `docs/CENTRALIZATION_STATUS_V521.md`
- `docs/AI_ASSISTANT_HANDOFF_CURRENT.md`

## Comando audit

```bash
node static/fanta-engine/tools/audit-calciomercato-live-feed-recovery-v548.mjs
```

## Guardrail futuri

Non ripristinare i fallback locali di Listoni/Calciomercato. La fonte unica resta `static/fanta-engine/data/shared-assets/current/`.

Non aggiungere nuovi micro-moduli di navigazione: il prossimo lavoro deve essere solo bugfix mirato o nuova roadmap esplicita.
