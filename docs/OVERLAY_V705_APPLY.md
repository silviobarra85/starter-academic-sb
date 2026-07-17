# Overlay ioSudo V705

Aggiorna ioSudo dal file Excel `fantacalcio_serie_a_2026_27_aggiornato_2026-07-17_aggiornamento_globale_v55(1).xlsx`.

## Contenuto

- Dataset centrale `sudatori-data.json` aggiornato a V705.
- Manifest aggiornato con data e ora in header ioSudo.
- App shell aggiornata a `iosudo-app-v705.js` e `iosudo-app-v705.css`.
- Deduplica giocatori mantenuta e controlli duplicati esatti in audit.
- Fix Modulo/Allenatore e contatori squadra conservati dalla linea V702/V703/V704.

## Conteggi

```json
{
  "id": "sudatori-iosudo-v705",
  "label": "ioSudo V705",
  "seasonId": "2026-2027",
  "updatedAt": "2026-07-17",
  "updatedAtTime": "2026-07-17T14:11:03+02:00",
  "generatedAt": "2026-07-17T14:11:03+02:00",
  "sourceFile": "fantacalcio_serie_a_2026_27_aggiornato_2026-07-17_aggiornamento_globale_v55(1).xlsx",
  "dataFile": "sudatori-data.json",
  "teams": 20,
  "players": 767,
  "friendlies": 102,
  "marketNotes": 356,
  "teamTransferTalks": 622,
  "injuries": 17,
  "formationTeams": 20,
  "transfermarktRumors": 42,
  "transfermarktRumorPages": 20,
  "officialIncoming": 171,
  "officialOutgoing": 193,
  "officialMoves": 364,
  "sources": 1015,
  "uiVersion": 705,
  "globalPlayersMarketOnly": false,
  "version": "V705",
  "dedupVersion": "V696+V697+V698+V700+V701+V704+V705",
  "updateRows": 11,
  "friendliesFilteredOut": 14,
  "outOfScopeOfficialMoves": 1,
  "duplicateMergesDuringBuild": 0
}
```

## Applicazione manuale

```bash
cp -R fantacalcio_overlay_iosudo_v705_globale_v55_dedup/static/* static/
cp -R fantacalcio_overlay_iosudo_v705_globale_v55_dedup/docs/* docs/
node static/fanta-engine/tools/audit-iosudo-v705.mjs
```
