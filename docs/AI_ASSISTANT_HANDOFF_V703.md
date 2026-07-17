# AI Assistant Handoff V703

Patch solo ioSudo sopra V702.

## Fix
- I contatori nelle card squadra e nel pannello squadra non leggono piu `team.officialIncomingCount`, `team.officialOutgoingCount`, `team.talksIncomingCount`, `team.talksOutgoingCount`, `team.injuriesCount`, perche nel dataset corrente quei campi non sono presenti nel record `teams`.
- Nuovo helper `teamCounters(teamId, summary)` calcola i valori da `marketSummaryByTeam[teamId]` e da `injuriesByTeam[teamId]`.

## Scope
- Non cambia i JSON dati.
- Non tocca il sito.
- Aggiorna cache-buster ioSudo a V703.
