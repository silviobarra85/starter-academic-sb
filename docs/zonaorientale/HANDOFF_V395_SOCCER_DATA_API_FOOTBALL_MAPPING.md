# Handoff V395 - Soccer Data API-Football mapping assistito

## Stato
Base: V394. La V395 interviene solo su Soccer Data.

## File principali modificati
- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/assets/soccer-data/manifest.json`
- `static/zonaorientale/assets/soccer-data/stats/manifest.json`
- `static/zonaorientale/assets/soccer-data/providers/api-football-player-map.v001.json`
- `static/zonaorientale/tools/audit-soccer-data-api-football-mapping-v395.mjs`
- `docs/zonaorientale/FUNZIONALITAV395.md`

## Cosa verificare dopo deploy
- Soccer Data e visibile anche da non-admin.
- I comandi `Trova ID API`, `Inserisci ID API`, `Recupera statistiche`, `Scarica mapping API`, `Scarica stats JSON` compaiono solo admin.
- Il link sul nome giocatore resta cliccabile quando il profilo e presente.
- `Trova ID API` mostra candidati e permette di salvare l'ID corretto.
- `Recupera statistiche` usa l'ID salvato e salva/cache su Firebase.
- `Scarica mapping API` genera un JSON con i playerKey e gli ID API-Football associati.
- `Scarica stats JSON` continua a esportare i dati statistici.

## Attenzione
La API key non deve essere committata. Deve stare solo su Netlify come `ZONAORIENTALE_API_FOOTBALL_KEY`.

## Prossimo step consigliato
Dopo aver associato 10-20 giocatori e verificato il recupero statistiche, creare una V396 per:
- cache guard TTL 7 giorni;
- contatore richieste giornaliere;
- blocco aggiornamenti se i dati sono gia freschi;
- eventuale aggiornamento batch controllato sui soli giocatori filtrati.
