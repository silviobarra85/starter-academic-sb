# V389 - Soccer Data assets cleanup + stats import base

Stato: V389.

## Obiettivo

Ridurre gli asset pubblici della sezione Soccer Data e preparare una struttura ordinata per importare in futuro statistiche giocatore tramite JSON statici, senza scraping live e senza toccare il mapping V383.

## Modifiche

- `assets/soccer-data` contiene solo i file runtime necessari:
  - `manifest.json`
  - `fbref-player-map.v383.json`
  - `stats/manifest.json`
- Spostati nei docs archive gli storici mapping/review V371-V383 non necessari al runtime pubblico.
- Aggiunto `assets/soccer-data/stats/manifest.json` come base per futuri import statici/manuali.
- Il pannello Soccer Data mostra una card `Stats import` che indica che la struttura e pronta ma non carica ancora dataset statistici reali.
- La sezione Soccer Data torna visibile a tutti in sola lettura.
- I comandi amministrativi Soccer Data restano disponibili solo agli admin: export CSV/mapping, patch FBref e pannello associazione sui giocatori da rivedere.
- `manifest.json` mantiene il mapping corrente V383 e aggiunge metadati V389 su asset pubblici, archivio e stats.

## Cosa non cambia

- Mapping corrente invariato: `fbref-player-map.v383.json`.
- Totale mapping invariato: 531 confermati / 1 needs-review.
- La sezione Soccer Data non e piu solo admin: e pubblica in sola lettura.
- I comandi amministrativi Soccer Data restano solo admin.
- Patch locale associazione FBref V385 invariata.
- Layout mobile V387 invariato.
- Snapshot comunicati admin V388 invariato.
- Nessuna scrittura Firebase.
- Nessuno scraping live.
- `FUNZIONALITA'.md` non modificato.

## Nota operativa

Per completare davvero la pulizia nella repo, dopo aver applicato lo zip bisogna rimuovere da Git i vecchi file pubblici `assets/soccer-data/fbref-player-map.v371-v382.*`, `fbref-player-map.v383.csv` e `fbref-review-batch.v372-v383.csv`. I contenuti sono gia conservati in `docs/zonaorientale/archive/soccer-data/mapping-history/`.
