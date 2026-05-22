# AI Handoff ZonaOrientale - V201

## Stato

Versione corrente: V201 - fix Area squadra rose da snapshot.

## Contesto

Il sito e' stato ottimizzato per ridurre le letture Firebase. In modalita' pubblica leggera usa prima JSON statici e snapshot pubblici:

- `assets/public/config.json`
- `assets/snapshots/seasons/*.json`
- `assets/snapshots/honor.json`
- `assets/rose/*.json`

Dopo V199/V200 sono stati corretti Statistiche e Confronta per leggere honor/FIFA dallo snapshot statico. V201 applica lo stesso principio all'Area squadra dei presidenti per il conteggio della rosa.

## Modifica V201

Aggiunto blocco in `assets/app.js` prima dello startup finale:

- `getTeamNameKeysV201`
- `findSeasonTeamForRosterV201`
- `collectRosterEntriesFromSnapshotV201`
- `collectStaticRosterPlayersV201`
- `getRosterPlayersForSeasonTeamV201`

Override/estensioni:

- `getRosterForSeasonTeam`
- `getPresidentDashboardRosterV192`
- `renderMobileTeamAreaHubV144`

Debug pubblico:

```js
ZonaOrientaleRosterDebug.playersForTeam("seasonTeamId")
ZonaOrientaleRosterDebug.seasonTeam("seasonTeamId")
ZonaOrientaleRosterDebug.keys("Nome squadra")
```

## Vincoli importanti

- Non aggiungere letture Firebase automatiche in Area squadra.
- Non normalizzare/modificare i nomi squadra salvati nei JSON rose. La normalizzazione V201 e' solo runtime matching.
- Mantenere mobile-first: Area squadra deve restare fruibile da smartphone.
- Ad ogni overlay aggiornare Version footer e cache-buster.

## Test consigliati

1. Login presidente approvato.
2. Senza caricare dati admin, aprire Area squadra.
3. Controllare dashboard presidente: `Rosa x/30`.
4. Da mobile controllare hub Area squadra: `x/30 giocatori`.
5. Aprire `Mercato`: le letture mercato devono restare lazy.
6. Checklist online finale deve aspettarsi V201.
