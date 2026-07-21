# Overlay V750 - Svincoli statici autorevoli

Correzione mirata per ZonaOrientale:

- forza `index.html` a caricare `assets/app.js?v=750`;
- corregge in memoria tutti i movimenti `SVINCOLO` prendendo le descrizioni complete da `assets/snapshots/seasons/{seasonId}.json`;
- funziona anche se desktop/admin carica movimenti da Firestore o snapshot non aggiornati;
- aggiorna footer a V750;
- espone `window.ZonaOrientaleStaticSvincoliV750` e `window.enforceStaticSvincoliV750()` per debug.

## Comandi

```bash
cp -R ~/Downloads/overlay_site_v750_static_svincoli_hardfix/static/* static/
cp -R ~/Downloads/overlay_site_v750_static_svincoli_hardfix/docs/* docs/

git add static/zonaorientale/assets/app.js static/zonaorientale/index.html static/zonaorientale/assets/league-config.json docs/OVERLAY_V750_APPLY.md docs/AI_ASSISTANT_HANDOFF_V750.md docs/AI_ASSISTANT_HANDOFF_CURRENT.md
git commit -m "Hard fix svincoli statici V750"
git push origin master
```

Dopo il deploy aprire `/zonaorientale/?v=750` e controllare in console:

```js
await window.enforceStaticSvincoliV750('manual')
window.ZonaOrientaleStaticSvincoliV750
```
