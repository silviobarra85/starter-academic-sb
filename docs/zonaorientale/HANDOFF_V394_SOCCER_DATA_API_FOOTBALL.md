# Handoff V394 - Soccer Data API-Football

## Stato

Base di partenza: V393 Soccer Data Firebase rules + fallback locale.

La V394 aggiunge un provider API-Football server-side, admin-only, senza rimuovere il fallback FBref e senza toccare altre sezioni del sito.

## File principali modificati

- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/app.js`
- `netlify/functions/api-football-player-stats.js`
- `docs/zonaorientale/FUNZIONALITAV394.md`
- `docs/zonaorientale/HANDOFF_V394_SOCCER_DATA_API_FOOTBALL.md`

## Variabile ambiente Netlify richiesta

Impostare una delle seguenti, preferibilmente la prima:

```text
ZONAORIENTALE_API_FOOTBALL_KEY
```

Fallback supportati:

```text
API_FOOTBALL_KEY
API_FOOTBALL_API_KEY
APISPORTS_API_KEY
```

## Comportamento

- La ricerca ID usa la Netlify Function con `action: search`.
- Il recupero stats usa la stessa Function con `action: stats`.
- La Function legge la API key dal server, quindi non viene esposta nel frontend.
- Il frontend salva il risultato nella collection `soccerDataPlayerStats`.
- La tabella unisce statico + Firebase + fallback locale come gia previsto.
- La nuova colonna `Aggiornato` mostra `updatedAt`/`fetchedAt` quando disponibile.

## Prossimi passi consigliati

1. Configurare la variabile ambiente su Netlify.
2. Verificare le Firestore Rules per `soccerDataPlayerStats`.
3. Testare 3-5 giocatori con `Cerca API-Football ID` e `Recupera API-Football`.
4. Usare `Scarica stats JSON`.
5. Inserire il JSON statico in `assets/soccer-data/stats/` e aggiornare il manifest in una prossima release.

## Funzionalita non toccate

- Mapping FBref V383.
- Import HTML FBref V392.
- Fallback locale V393.
- Comunicati, snapshot, rose, calciomercato, competizioni, trattative.
