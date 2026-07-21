# Overlay V758 - Static data emergency

## Scopo

Risoluzione urgente del blocco caricamento dati del sito ZonaOrientale, soprattutto da mobile.

## Modifiche

- `static/zonaorientale/index.html`
  - cache-buster `app.js?v=758`.
  - mantiene disattivato il boot loader iniziale.
- `static/zonaorientale/assets/app.js`
  - aggiunge bootstrap static-first V758.
  - carica subito `assets/snapshots/seasons/<season>.json` senza attendere Firebase/Auth.
  - per utenti pubblici/mobile usa snapshot statico come fonte primaria.
  - per admin prova il live, ma dopo timeout ricade sullo statico.
  - espone `window.forceStaticDataV758()` per debug/forzatura manuale.
- `static/zonaorientale/assets/snapshots/seasons/2026-2027.json`
  - include descrizioni svincoli complete.
- `static/zonaorientale/assets/league-config.json`
  - aggiorna versione a 758.

## Verifiche

```bash
node --check static/zonaorientale/assets/app.js
grep -n "app.js?v=" static/zonaorientale/index.html
grep -n "Malinovskyi" static/zonaorientale/assets/snapshots/seasons/2026-2027.json
```

Atteso:

- `app.js?v=758`
- descrizione completa svincoli Real Pisistrius.

## Debug browser

```js
document.querySelector('script[src*="app.js"]')?.src
window.ZonaOrientaleStaticDataEmergencyV758
window.forceStaticDataV758()
```
