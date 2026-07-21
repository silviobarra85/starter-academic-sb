# Overlay V751 - Svincoli statici e fix Tutte le Rose

Data: 21/07/2026

## Cosa cambia

- Aggiorna `static/zonaorientale/index.html` da `app.js?v=698` a `app.js?v=751`.
- Aggiorna footer a V751.
- Mantiene come fonte canonica le descrizioni complete degli svincoli luglio 2026.
- Ripara al runtime eventuali descrizioni `SVINCOLI LUGLIO 2026` senza lista giocatori.
- Aggiunge handler robusti in capture phase per:
  - click squadra in `Tutte le Rose` -> pagina squadra;
  - pulsante espandi/riduci in `Tutte le Rose`.
- Aggiorna `league-config.json` a V751.

## Comandi

Dalla root del progetto:

```bash
cp -R ~/Downloads/overlay_site_v751_static_svincoli_roster_nav/static/* static/
cp -R ~/Downloads/overlay_site_v751_static_svincoli_roster_nav/docs/* docs/
```

Poi:

```bash
git status
git add static/zonaorientale/index.html static/zonaorientale/assets/app.js static/zonaorientale/assets/league-config.json static/zonaorientale/assets/snapshots/seasons/2026-2027.json docs/OVERLAY_V751_APPLY.md docs/AI_ASSISTANT_HANDOFF_V751.md docs/AI_ASSISTANT_HANDOFF_CURRENT.md
git commit -m "Fix svincoli statici e navigazione rose V751"
git push origin master
```

## Verifiche browser

```js
document.querySelector('script[src*="app.js"]')?.src
fetch('/zonaorientale/assets/snapshots/seasons/2026-2027.json?v=' + Date.now()).then(r => r.json()).then(d => d.fmMovements.filter(m => m.type === 'SVINCOLO'))
window.enforceStaticSvincoliV751('manual')
window.ZonaOrientaleStaticSvincoliV751
```
