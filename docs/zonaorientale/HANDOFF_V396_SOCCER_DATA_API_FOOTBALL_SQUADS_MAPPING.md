# Handoff V396 - Soccer Data mapping API-Football da rose Serie A

## Stato
Base: V395. La V396 interviene solo su Soccer Data e sulla Netlify Function API-Football necessaria ai comandi admin.

## Obiettivo
Ridurre le ricerche singole dei giocatori su API-Football. L'admin scarica una volta squadre e rose Serie A, poi il sito genera localmente il mapping `playerKey -> apiFootballId` usando nome + squadra.

## File principali modificati
- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/assets/soccer-data/manifest.json`
- `static/zonaorientale/assets/soccer-data/stats/manifest.json`
- `static/zonaorientale/tools/audit-soccer-data-api-football-squads-v396.mjs`
- `netlify/functions/api-football-player-stats.js`
- `docs/zonaorientale/HANDOFF_V396_SOCCER_DATA_API_FOOTBALL_SQUADS_MAPPING.md`
- `docs/zonaorientale/test/SOCCER_DATA_API_FOOTBALL_SQUADS_MAPPING_V396.md`

## Cosa cambia in Soccer Data
- Aggiunto comando admin `Scarica rose Serie A API`.
- Aggiunto comando admin `Genera mapping da rose`.
- `Trova ID API` ora prova prima i candidati presenti nella cache locale delle rose; se li trova non consuma richieste API.
- `Scarica mapping API` esporta anche metadati sulla cache rose e sull'automapping V396.
- Il link profilo giocatore resta cliccabile quando disponibile.
- La sezione resta pubblica in sola lettura; tutti i comandi operativi restano admin-only.

## Flusso admin consigliato
1. Aprire Soccer Data online su deploy Netlify, non dal server statico `python3 -m http.server`.
2. Premere `Scarica rose Serie A API`.
3. Attendere il completamento: consuma circa `1 + numero squadre Serie A` richieste API.
4. Premere `Genera mapping da rose`.
5. Controllare il riepilogo: confermati, da verificare, mancanti.
6. Premere `Scarica mapping API`.
7. Pubblicare il JSON esportato in `assets/soccer-data/providers/api-football-player-map.v001.json` quando il mapping e verificato.
8. Da quel momento `Recupera statistiche` usa l'ID API statico/cacheato e le letture API restano limitate agli aggiornamenti espliciti.

## Invarianti conservati
- Nessuna modifica a Comunicati.
- Nessuna modifica a Rose.
- Nessuna modifica a Calciomercato.
- Nessuna modifica a Competizioni.
- Nessuna modifica a Snapshot.
- Nessuna modifica alle Firebase Rules.
- Nessuna modifica al mapping profili V383.
- `FUNZIONALITA'.md` non modificato.

## Note tecniche
- La API key resta solo su Netlify come `ZONAORIENTALE_API_FOOTBALL_KEY`.
- La function supporta ora anche le action `teams` e `squad`.
- Il provider usa league ID `135` per Serie A.
- I dati rose vengono salvati localmente nel browser per generare il mapping senza ulteriori richieste API.
