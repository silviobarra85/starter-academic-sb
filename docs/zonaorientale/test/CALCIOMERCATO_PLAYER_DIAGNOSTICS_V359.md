# Test manuale V359 - Diagnostica giocatori Calciomercato

1. Accedi come Admin.
2. Apri Calciomercato.
3. Verifica che le card continuino a mostrare i tag giocatore quando riconosciuti.
4. Apri la Checklist QA Admin in basso.
5. Nel gruppo Calciomercato usa `Report giocatori`.
6. Verifica che venga mostrato un riepilogo tipo `Giocatori: X/Y articoli associati`.
7. Apri un tag giocatore e verifica che la timeline modal funzioni ancora.
8. Da console, opzionale:

```js
window.ZonaOrientaleCalciomercatoPlayerMatchingV359.runSmokeTest()
window.ZonaOrientaleCalciomercatoPlayerDiagnosticsV359.generateCurrentReport()
```

Il test e' OK se non compaiono errori e la timeline continua ad aprirsi/chiudersi.
