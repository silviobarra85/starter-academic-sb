# Release V350 - Cleanup simulatore trade dev legacy

Data: 05/06/2026

## Sommario

La V350 rimuove il vecchio modulo `assets/js/dev/trade-notification-simulator-v254.js`, gia non usato dal runtime. Resta attivo `assets/js/dev/trade-notification-simulator-v255.js`, che mantiene anche l'alias console V254.

## Cambiamenti

- Nuovo marker runtime `window.ZonaOrientaleTradeSimulatorDevCleanupV350`.
- Nuovo audit `tools/audit-trade-simulator-dev-cleanup-v350.mjs`.
- Audit V348 reso compatibile con la rimozione successiva di V254.
- Versione deploy aggiornata a V350.

## Funzionalita preservate

- Fantamercato reale.
- Notifiche trade reali.
- Simulazioni locali V255/V349.
- Calciomercato.
- Listone.
- Rose.
- Dashboard Presidente.
- Admin.
- Firebase/Auth/EmailJS.
- Netlify Functions.
- Navigazione mobile.

## Operazione manuale richiesta dopo zip

```bash
git rm --ignore-unmatch static/zonaorientale/assets/js/dev/trade-notification-simulator-v254.js
```
