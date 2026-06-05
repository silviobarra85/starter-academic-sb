# Calciomercato player diagnostics V359

## Scopo

V359 introduce una diagnostica controllata per il matching articoli -> giocatori. Il matching resta conservativo e usa sempre l'ultimo listone della stagione selezionata.

## File principali

- `assets/js/calciomercato/calciomercato-players-v359.js`
- `assets/app.js`
- `tools/audit-calciomercato-player-diagnostics-v359.mjs`

## Matching V359

Il modulo mantiene:

- nome completo;
- cognome univoco;
- cognome composto;
- controllo maiuscola per alias di una sola parola.

Aggiunge:

- alias configurati nei dati giocatore;
- forma compatta dei nomi con apostrofi/spazi (`N'Doye` -> `ndoye`);
- report diagnostico con articoli associati/non associati.

## API runtime

```js
window.ZonaOrientaleCalciomercatoPlayerMatchingV359.runSmokeTest()
window.ZonaOrientaleCalciomercatoPlayerDiagnosticsV359.generateCurrentReport()
await window.ZonaOrientaleCalciomercatoPlayerDiagnosticsV359.generateReport({ includeArchive: true })
await window.ZonaOrientaleCalciomercatoPlayerDiagnosticsV359.print({ includeArchive: false })
```

## Impatto funzionale

Nessuna modifica a feed, archivi, Firebase, Netlify o JSON Listone.
