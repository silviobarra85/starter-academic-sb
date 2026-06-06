# Soccer Data static stats template V390

## Obiettivo

Aggiungere file statici compilabili per le statistiche giocatore, senza scraping live e senza scritture Firebase.

## File runtime aggiunti

- `static/zonaorientale/assets/soccer-data/stats/player-stats-summary-2025-2026.v001.json`
- `static/zonaorientale/assets/soccer-data/stats/player-stats-summary-2025-2026.v001.template.csv`

Entrambi contengono tutti i 532 giocatori attivi del mapping `fbref-player-map.v383.json`. I campi statistici numerici sono `null`/vuoti: nessun dato inventato.

## Flusso previsto

1. Scaricare il CSV template da admin Soccer Data.
2. Compilare offline solo con dati verificati.
3. Convertire/aggiornare il JSON summary statico.
4. Aggiornare `assets/soccer-data/stats/manifest.json`.
5. Commit + deploy.

## Vincoli preservati

- Nessuno scraping live dal browser.
- Nessuna scrittura Firebase.
- Mapping V383 invariato.
- Soccer Data resta pubblico in sola lettura.
- Comandi template/export visibili e attivi solo admin.
- `FUNZIONALITA'.md` non modificato.
