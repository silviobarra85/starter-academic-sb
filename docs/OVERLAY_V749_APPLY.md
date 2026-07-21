# Overlay V749 - static svincoli e footer corrente

## Scopo

- Le descrizioni dei movimenti `SVINCOLO` della stagione corrente vengono sempre riprese dallo snapshot statico `static/zonaorientale/assets/snapshots/seasons/{seasonId}.json`.
- Questo evita che Firestore/publicSnapshots con descrizioni vecchie o tronche sovrascrivano le note complete.
- Footer aggiornato a `Fantacalcio - V749 - Aggiornato al 21/07/2026`.
- Cache-bust `app.js?v=749`.

## File modificati

- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/league-config.json`
- `docs/AI_ASSISTANT_HANDOFF_CURRENT.md`
- `docs/AI_ASSISTANT_HANDOFF_V749.md`
- `docs/OVERLAY_V749_APPLY.md`

## Verifica browser

Console:

```js
window.ZonaOrientaleStaticSvincoliRepairV749
window.enforceStaticSvincoliV749 && window.enforceStaticSvincoliV749('manual')
```

Se `changed > 0`, il runtime aveva caricato movimenti Firestore/publicSnapshot non allineati e li ha sostituiti con quelli statici.
