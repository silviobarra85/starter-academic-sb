# AI Assistant Handoff - V563

## Versione
V563 - Svincola Giocatori ZonaOrientale runtime fix

## Stato
Overlay mirato per ZonaOrientale. Corregge la V562: la funzionalita Svincola Giocatori viene attivata gia nel bootstrap del registry card e viene riagganciata dopo i render dell'Area Presidente.

## File modificati
- `static/zonaorientale/assets/js/core/league-config-v443.js`
- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/assets/league-config.json`
- `static/zonaorientale/index.html`
- `static/fanta-engine/tools/audit-zona-release-players-v563.mjs`
- `docs/PRESIDENT_RELEASE_PLAYERS_ZONA_V563.md`
- `docs/AI_ASSISTANT_HANDOFF_CURRENT.md`
- `docs/AI_ASSISTANT_HANDOFF_V563.md`
- `docs/OVERLAY_ROADMAP.md`
- `docs/zonaorientale/00_STATO_CORRENTE_E_INDICE.md`

## Note operative
Il problema era di bootstrap: `league-config.json` veniva caricato dopo la costruzione del registry V497. Per questo abilitare solo il JSON non bastava. V563 aggiorna il default runtime e aggiunge una patch di riattivazione post-render.

## Verifica manuale
1. Login con un presidente ZonaOrientale associato alla stagione corrente.
2. Aprire Area Presidente / Area Squadra.
3. Verificare la presenza del pannello Svincola Giocatori.
4. Selezionare uno o piu giocatori dalla rosa.
5. Verificare l'anteprima email.
6. Inviare e verificare che l'email parta verso il presidente di lega.
7. Verificare che Calciomercato resti assente dalla navigazione.

## Audit
```bash
node static/fanta-engine/tools/audit-zona-release-players-v563.mjs
```
