# Overlay V754 - Fix checkbox Visibilita Admin desktop

Questo overlay corregge il selettore `Visibilita Admin` che rimane basato su UI V456, ma su desktop non recepiva il click delle checkbox.

## File modificati

- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/js/core/admin-card-visibility-v456.js`
- `static/fanta-engine/js/shared/v489/assets/js/core/admin-card-visibility-v456.js`
- `static/zonaorientale/assets/css/refactor/admin-card-visibility-v456.css`
- `static/fanta-engine/css/shared/v487/assets/css/refactor/admin-card-visibility-v456.css`

## Verifica

Da browser:

```js
document.querySelector('script[src*="admin-card-visibility-v456.js"]')?.src
window.ZonaOrientaleAdminCardCheckboxHardfixV754
```

La prima riga deve contenere `v=754`; la seconda deve restituire un oggetto con `version: "V754"`.
