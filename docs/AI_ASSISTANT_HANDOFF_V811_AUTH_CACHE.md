# ZonaOrientale V811 - cache coerente Firebase Auth

Data: 11/09/2026

## Causa

`app.js` era versionato, mentre gli import dinamici `firebase.js` e `firebase-adapter-v499.js` non avevano cache-buster. Dopo V809/V810 un browser desktop poteva quindi costruire un grafo misto con moduli Auth di release differenti. Il sintomo era l'attesa permanente sia per email/password sia per Google, mentre un altro dispositivo con cache diversa continuava a funzionare.

## Correzione

- `app.js?v=811` importa `firebase.js?v=811`.
- `firebase.js?v=811` importa `firebase-adapter-v499.js?v=811`.
- Email/password, popup mobile e redirect desktop hanno un timeout esplicito di 15 secondi.
- In caso di blocco viene mostrato `auth/client-timeout-v811` invece di lasciare indefinitamente il messaggio verde.
- Restano incluse tutte le correzioni dati V810.

## Verifica

```bash
node static/fanta-engine/tools/audit-zona-auth-cache-v811.mjs
node static/fanta-engine/tools/audit-zona-canonical-data-v810.mjs
node static/zonaorientale/tools/audit-static-first-v760.mjs
```
