# V587 - Editor rose statiche per GitHub

La V587 introduce in Area Admin un editor locale per i file JSON delle rose statiche.

## Percorso operativo
Area Admin -> File statici -> Editor rose GitHub.

## Cosa fa
- Carica l'ultima rosa presente in `assets/rose/manifest.json`.
- Mostra le rose e i giocatori con struttura coerente con i file `assets/rose/*.json`.
- Consente di togliere un giocatore dalla rosa selezionata.
- Consente di aggiungere un giocatore dal listone centrale.
- Se un giocatore è già in un'altra rosa, può essere spostato per evitare duplicati.
- Scarica il nuovo JSON della rosa.
- Scarica il `manifest.json` aggiornato.

## File generati
Per esempio, su ZonaOrientale:

```text
static/zonaorientale/assets/rose/2026-2027-2026-07-07.json
static/zonaorientale/assets/rose/manifest.json
```

## Struttura dati
Il JSON mantiene la struttura:

```json
{
  "meta": {
    "id": "seasonId-data",
    "seasonId": "2026-2027",
    "label": "...",
    "loadedAt": "2026-07-07",
    "sourceFile": "...",
    "teams": 10,
    "players": 300
  },
  "rosters": [
    {
      "name": "Nome squadra",
      "playerCount": 30,
      "players": [
        { "role": "A", "playerName": "Nome", "realTeam": "ROM", "cost": 10 }
      ]
    }
  ]
}
```

## Limiti
Lo strumento non committa automaticamente. Dopo il download bisogna copiare i file nei percorsi Git, fare commit e push.
