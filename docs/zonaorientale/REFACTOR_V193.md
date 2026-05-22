# V193 - Statistiche storiche pubbliche

## Obiettivo

Aggiungere una pagina pubblica **Statistiche storiche / Hall of Fame** per valorizzare i dati storici già presenti nel sito, senza aumentare le letture Firebase.

## File modificati

- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/app.js`
- `docs/zonaorientale/REFACTOR_V193.md`
- `docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_V193.md`

## Funzionalità

Nuova pagina pubblica:

- `#stats`
- voce desktop `Statistiche`
- voce mobile in `Altro → Statistiche storiche`

La pagina mostra:

- metriche generali della storia della lega
- club più vincenti
- podi Campionato all-time
- presidenti vincenti
- ultimi titoli assegnati
- Top FIFA Ranking

## Letture Firebase

La pagina non effettua letture Firebase dedicate. Usa solo dati già caricati nello stato applicativo:

- `state.raw.honorRoll`
- `state.raw.seasons`
- `state.raw.seasonTeams`
- `state.raw.teams`
- `state.raw.presidents`
- `state.raw.fifaRankings`

Questi dati arrivano dal normale flusso pubblico: JSON statici/snapshot, con Firebase solo come fallback già esistente.

## Mobile

La pagina è mobile-first:

- card al posto di tabelle larghe
- testi lunghi a capo
- ranking a una colonna su smartphone
- nessuna lettura extra quando si apre la pagina

## Note tecniche

Il codice V193 è stato aggiunto come overlay incrementale in fondo a `assets/app.js`, prima dello startup centralizzato `startZonaOrientaleAppV173()`.

Sono stati aggiunti:

- `buildHistoricalStatsV193()`
- `renderHistoricalStatsV193()`
- `ZonaOrientaleHistoricalStats.build()`
- `ZonaOrientaleHistoricalStats.render()`

La checklist online finale è aggiornata per aspettarsi la versione `193`.
