# AI Assistant Handoff V754

Correzione mirata alla sezione Admin, blocco `Visibilita Admin`.

Problema: da desktop le checkbox del selettore card Admin non cambiavano stato o non applicavano la visibilita'. Il componente e' il vecchio `admin-card-visibility-v456.js`, caricato direttamente da `index.html` con cache-buster dedicato, quindi patchare solo `app.js` non basta.

Fix V754:
- aggiornato `index.html` per caricare `admin-card-visibility-v456.js?v=754` e CSS `?v=754`;
- patchati sia il file condiviso `static/fanta-engine/.../admin-card-visibility-v456.js` sia il fallback locale `static/zonaorientale/assets/js/core/admin-card-visibility-v456.js`;
- aggiunto hardfix runtime `window.ZonaOrientaleAdminCardCheckboxHardfixV754` che intercetta direttamente click/pointerup su label e input, aggiorna localStorage `zonaorientale.adminCardVisibility.v456.selectedCards` e richiama `LeagueAdminCardVisibilityV456.apply()`;
- patchati CSS condiviso e locale per garantire pointer-events/z-index sulle checkbox.

Verifica console:
```js
document.querySelector('script[src*="admin-card-visibility-v456.js"]')?.src
window.ZonaOrientaleAdminCardCheckboxHardfixV754
```
