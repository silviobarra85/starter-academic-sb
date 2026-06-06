# Test V396 - Soccer Data mapping API-Football da rose

## Test automatici
Eseguire dalla cartella `static/zonaorientale` dopo aver applicato lo zip:

```bash
node tools/audit-soccer-data-api-football-squads-v396.mjs
node tools/audit-soccer-data-api-football-mapping-v395.mjs
node tools/audit-soccer-data-api-football-v394.mjs
node --check assets/app.js
node --check ../netlify/functions/api-football-player-stats.js
find assets -name '*.js' -type f -print0 | xargs -0 -n 1 node --check
```

## Test manuale online
1. Pubblicare la V396 su Netlify production o branch deploy con function attiva.
2. Verificare che `ZONAORIENTALE_API_FOOTBALL_KEY` sia configurata su Netlify.
3. Aprire Soccer Data da admin.
4. Verificare che i non-admin vedano solo la tabella in sola lettura.
5. Premere `Scarica rose Serie A API`.
6. Confermare il warning sulle richieste API.
7. Verificare che lo stato mostri progressivamente le squadre scaricate.
8. Premere `Genera mapping da rose`.
9. Verificare che il riepilogo indichi confermati, da verificare e mancanti.
10. Su una riga senza ID confermato, premere `Trova ID API`: se la cache rose ha candidati, il prompt deve mostrarli senza chiamata API di ricerca.
11. Premere `Scarica mapping API` e controllare che il JSON contenga i `apiFootballId` confermati.

## Regressioni da controllare
- Il nome giocatore resta cliccabile verso il profilo quando il link e disponibile.
- La colonna `Aggiornato` resta presente.
- `Recupera statistiche` resta admin-only e salva/cache su Firebase o fallback locale.
- Nessun comando API compare ai non-admin.
