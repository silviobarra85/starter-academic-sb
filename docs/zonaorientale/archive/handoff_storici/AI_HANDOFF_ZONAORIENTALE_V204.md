# AI HANDOFF ZonaOrientale - V204

## Stato
Branch di lavoro previsto: `feature/zonaorientale-v187-next`.
Versione frontend: V204.

## Modifica principale
V204 corregge la pagina `#archive`: dopo refresh/logout, selezionando una stagione storica, partecipanti, vincitori, competizioni e partite devono essere letti dallo snapshot statico della stagione (`assets/snapshots/seasons/<seasonId>.json`) e non solo da `state.raw`.

## Contesto tecnico
- `config.json` fornisce elenco stagioni e stagione corrente.
- `assets/snapshots/seasons/manifest.json` indica gli snapshot statici disponibili.
- `loadPublicSeasonSnapshotV32(seasonId)` prova prima il JSON statico e solo in fallback Firebase.
- `honor.json` fornisce l'albo/palmarès/FIFA.

## Funzioni V204
- `ensureSeasonArchiveSnapshotV204(seasonId)`
- `buildSeasonArchiveV204` tramite override di `buildSeasonArchiveV196`
- override dei render Archivio per usare mappe locali dello snapshot
- `ZonaOrientaleSeasonArchive.ensureSnapshot()` per debug console

## Verifica
1. Aprire `/zonaorientale/#archive` senza login e senza `Carica dati amministrazione`.
2. Selezionare una stagione passata.
3. Verificare che compaiano squadre, competizioni, vincitori e partite se presenti nello snapshot statico.
4. Fare refresh e ripetere.
5. Verificare mobile.

## Attenzione
Non reintrodurre full-load admin o letture granulari Firebase all'avvio. L'Archivio deve restare consultivo e static-first.
