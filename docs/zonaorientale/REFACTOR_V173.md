# V173 - Honor statico e date snapshot su mobile

Data: 21/05/2026

## Obiettivi

- Mostrare in Admin -> Snapshot pubblici la data dell'ultimo aggiornamento direttamente sotto il nome di ogni bottone, soprattutto su mobile.
- Servire Albo/FIFA anche da JSON statico GitHub prima del fallback Firestore, quando `assets/snapshots/honor.json` viene generato e pubblicato.
- Aggiornare la Version nel footer.

## File modificati

- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/assets/styles.css`
- `static/zonaorientale/assets/css/mobile-suite-v168.css`
- `static/zonaorientale/assets/js/admin/public-snapshots.js`

## Snapshot pubblici: cosa premere

Per aggiornare subito i dati letti dal sito pubblico tramite Firestore, usare:

- `Aggiorna tutto`: aggiorna snapshot stagione, Albo/FIFA e schede squadra.

Per ridurre ulteriormente le letture Firestore pubblicando i dati su GitHub, dopo `Aggiorna tutto` scaricare e committare anche i JSON statici:

- `Scarica config pubblica` -> `assets/public/config.json`
- `Scarica overlay snapshot stagioni` -> `assets/snapshots/seasons/`
- `Scarica honor JSON` -> `assets/snapshots/honor.json`

## Riduzione letture

Il sito pubblico ora prova a leggere l'honor snapshot da:

```text
assets/snapshots/honor.json
```

Se il file non è disponibile o non contiene dati validi, usa il fallback Firestore:

```text
publicSnapshots/honor
```

## Note tecniche

- I bottoni snapshot usano markup interno con `snapshot-button-title` e `snapshot-button-date`.
- Le date mostrate non forzano nuove letture massive: usano snapshot già caricati, config statica caricata, manifest statici o cache locale dello stato.
- L'import di `public-snapshots.js` è cache-busted con `?v=173`.

## Fix startup

La chiamata iniziale `initializeAppUi()` è stata spostata nuovamente a fine file tramite `startZonaOrientaleAppV173()`, così anche gli override V171-V173 vengono registrati prima del primo caricamento dati.
Questo rende effettive già al primo load le ottimizzazioni di lettura pubblica da `config.json`, snapshot stagioni statici e honor statico.
