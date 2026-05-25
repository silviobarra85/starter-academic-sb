# REFACTOR V195 - Confronta squadre

## Obiettivo
Aggiungere una nuova pagina pubblica mobile-first per confrontare due club storici della lega senza aumentare le letture Firebase.

## File modificati
- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/app.js`
- `docs/zonaorientale/REFACTOR_V195.md`
- `docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_V195.md`

## Funzionalita'
Nuova pagina `#compare` / **Confronta squadre** con:
- selezione Squadra 1 / Squadra 2
- metriche storiche: titoli, podi campionato, stagioni, ranking FIFA, partite, gol
- dettaglio presidenti storici
- ultimi titoli
- scontri diretti con vittorie, pareggi, gol e ultime partite trovate

## Dati e letture
La pagina usa solo dati gia' presenti in `state.raw`:
- `seasonTeams`
- `teams`
- `honorRoll`
- `fifaRankings`
- `competitionMatches`
- `fmMovements`

Non aggiunge chiamate Firebase, non modifica dati e non scrive su Firebase.

## Mobile
Layout a card responsive, nessuna tabella larga, select a tutta larghezza su smartphone, testi lunghi wrappati.

## Versione
Footer e cache-buster aggiornati a V195.
