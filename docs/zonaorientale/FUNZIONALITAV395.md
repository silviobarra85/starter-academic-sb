# FUNZIONALITA V395 - Soccer Data mapping API-Football assistito

## Scopo
La V395 lavora solo sulla sezione Soccer Data. Mantiene la sezione pubblica in sola lettura e sposta il flusso operativo delle statistiche su API-Football.

## Modifiche principali
- La tabella Soccer Data resta visibile a tutti.
- I comandi operativi restano visibili e utilizzabili solo dagli admin.
- I riferimenti operativi al vecchio fallback HTML/manuale sono stati rimossi dalla UI principale.
- Il nome del giocatore resta cliccabile quando e disponibile il link profilo gia presente nel mapping corrente.
- La prima colonna ora e `Giocatore`.
- La colonna di stato ora e `Stato profilo`.
- Aggiunto il file bootstrap `assets/soccer-data/providers/api-football-player-map.v001.json`.
- Aggiunto il pulsante admin `Scarica mapping API`.
- Per ogni giocatore admin sono disponibili:
  - `Trova ID API`
  - `Inserisci ID API`
  - `Recupera statistiche`
- Il mapping API-Football locale viene salvato in localStorage e puo essere esportato in JSON statico.
- La colonna `Aggiornato` resta disponibile per indicare l'ultimo aggiornamento delle stats.

## Flusso operativo admin
1. Apri Soccer Data.
2. Su un giocatore premi `Trova ID API`.
3. Il sito interroga la Netlify Function API-Football e mostra i candidati.
4. Inserisci nel prompt l'ID numerico corretto tra quelli proposti.
5. Premi `Recupera statistiche`.
6. Le statistiche vengono salvate su Firebase nella collection `soccerDataPlayerStats` o nel fallback locale se le rules non sono ancora aggiornate.
7. Premi `Scarica stats JSON` per esportare i dati statistici.
8. Premi `Scarica mapping API` per esportare gli ID provider e pubblicarli come asset statico.

## Invarianti conservati
- Nessuna modifica a Comunicati.
- Nessuna modifica a Rose.
- Nessuna modifica a Calciomercato.
- Nessuna modifica a Competizioni.
- Nessuna modifica a Snapshot.
- Nessuna modifica a Firebase Rules.
- Nessuna modifica al mapping profili V383.
- `FUNZIONALITA'.md` non modificato.

## Note tecniche
- API key sempre lato Netlify, mai nel frontend.
- Il pubblico legge prima JSON statico, poi Firebase, poi nessun dato.
- L'API viene usata solo con azione admin esplicita.
- Il mapping statico API e predisposto in `assets/soccer-data/providers/api-football-player-map.v001.json`.
