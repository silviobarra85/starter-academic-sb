# AI Assistant Handoff - V749

## Contesto

L'utente segnala che le descrizioni degli svincoli 2026-2027 compaiono correttamente nel JSON statico ma spariscono sul sito dopo deploy/cache/Firebase.

## Decisione V749

Per i movimenti `SVINCOLO` della stagione corrente, il sito deve usare come fonte autorevole lo snapshot statico:

`static/zonaorientale/assets/snapshots/seasons/{seasonId}.json`

La patch in `app.js` aggiunge `window.enforceStaticSvincoliV749()` e sostituisce/aggiunge in `state.raw.fmMovements` i soli movimenti `type=SVINCOLO` presi dallo snapshot statico. Non modifica Firestore e non tocca gli altri movimenti.

## Note operative

- Footer aggiornato a V749.
- `index.html` carica `app.js?v=749`.
- `league-config.json.currentVersion = 749`.
- Nel prossimo overlay mantenere questa regola finché Firestore/publicSnapshots non saranno sicuramente riallineati.
- Per debug da console: `window.ZonaOrientaleStaticSvincoliRepairV749`.

## Comando applicazione overlay da desktop

Da root progetto, se lo zip è già decompresso in Downloads:

```bash
cp -R ~/Downloads/overlay_site_v749_static_svincoli_footer/static/* static/
cp -R ~/Downloads/overlay_site_v749_static_svincoli_footer/docs/* docs/
git status
git add static/zonaorientale/assets/app.js static/zonaorientale/index.html static/zonaorientale/assets/league-config.json docs/AI_ASSISTANT_HANDOFF_CURRENT.md docs/AI_ASSISTANT_HANDOFF_V749.md docs/OVERLAY_V749_APPLY.md
git commit -m "Forza svincoli statici e footer V749"
git push origin master
```
