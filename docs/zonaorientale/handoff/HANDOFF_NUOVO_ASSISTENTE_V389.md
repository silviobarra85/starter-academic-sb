# Handoff nuovo assistente - V389

## Stato corrente

La base V389 parte dalla V388 e mantiene le funzionalita precedenti:

- Soccer Data solo admin V386.
- Layout mobile Soccer Data V387.
- Snapshot date comunicati admin V388.
- Mapping FBref corrente V383.

## Soccer Data

Runtime pubblico ridotto a:

- `assets/soccer-data/manifest.json`
- `assets/soccer-data/fbref-player-map.v383.json`
- `assets/soccer-data/stats/manifest.json`

Storico spostato in:

- `docs/zonaorientale/archive/soccer-data/mapping-history/`

## Prossimo passo consigliato

Definire un importer offline per generare un file statico, per esempio:

- `assets/soccer-data/stats/player-stats-summary-2025-2026.v001.json`

Il sito non deve fare scraping live dal browser. Prima di esporre colonne statistiche, validare schema e fonte dati.
