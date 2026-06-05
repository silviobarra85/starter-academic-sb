# Refactor V347 - cleanup duplicato simulatore trade

## Scopo

Rimuovere il duplicato top-level `assets/js/trade-notification-simulator-v255.js` senza toccare la copia canonica importata dal runtime.

## Motivazione

L'audit V346 classificava il file top-level come duplicato: `assets/app.js` importa il simulatore da `assets/js/dev/trade-notification-simulator-v255.js`. Mantenere due copie uguali aumenta il rischio di divergenze future.

## Intervento

- Rimosso solo `assets/js/trade-notification-simulator-v255.js`.
- Preservato `assets/js/dev/trade-notification-simulator-v255.js`.
- Aggiunto audit V347 per verificare assenza del duplicato e import canonico.
- Aggiunto marker runtime `window.ZonaOrientaleTradeSimulatorCleanupV347`.

## Vincoli

- Non modificare logiche Fantamercato/notifiche trade.
- Non modificare Firebase/Auth/EmailJS.
- Non modificare Netlify Functions.
- Non modificare `FUNZIONALITA'.md`.
