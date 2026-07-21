# ioSudo - payload runtime V759

## Modifica

Il codice applicativo resta V751; cambia il contratto dati del manifest corrente.

- `manifest.json` punta a `sudatori-runtime.json`.
- payload runtime: 3.684.800 byte.
- archivio completo: `sudatori-data.json`, 12.432.411 byte.
- riduzione del download ordinario: 70,4%.

## Chiavi incluse

- `meta`
- `teams`
- `playersByTeam`
- `formationsByTeam`
- `marketSummaryByTeam`
- `injuriesByTeam`
- `friendliesByTeam`
- `friendlyPlayerStatsByMatch`

Il file completo non viene cancellato perché contiene log, audit e storico utili ai tool di generazione e controllo.
