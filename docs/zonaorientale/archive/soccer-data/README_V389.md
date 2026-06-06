# Archivio Soccer Data V389

Questa cartella conserva lo storico dei mapping e dei review batch FBref spostati fuori dagli asset pubblici.

## Perche lo storico e stato spostato

La sezione Soccer Data, a runtime, usa solo:

- `assets/soccer-data/manifest.json`
- `assets/soccer-data/fbref-player-map.v383.json`
- `assets/soccer-data/stats/manifest.json`

I file precedenti V371-V382 e i CSV di lavorazione non sono necessari al caricamento della pagina. Restano qui per audit, rollback e ricostruzione del processo di mapping.

## Vincoli preservati

- Nessuna funzionalita esistente viene rimossa.
- Il mapping corrente resta V383.
- Soccer Data resta solo admin.
- Nessuno scraping live dal browser.
- Nessuna scrittura Firebase.
