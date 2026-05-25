# AI HANDOFF ZonaOrientale - V196

## Stato corrente

Ultima versione applicativa: **V196 - archivio stagioni evoluto**.

Il progetto resta una webapp statica HTML/CSS/JS puro in:

```text
static/zonaorientale/
```

Non usare build system. Gli overlay devono mantenere la struttura:

```text
static/zonaorientale/index.html
static/zonaorientale/assets/app.js
docs/zonaorientale/...
```

## Regole operative importanti

A ogni overlay:

1. aggiornare cache-buster in `index.html` a `v=<versione>`
2. aggiornare la Version nel footer
3. aggiornare `DEPLOY_EXPECTED_VERSION_V181` in `app.js`
4. includere `REFACTOR_VXXX.md`
5. includere `AI_HANDOFF_ZONAORIENTALE_VXXX.md`
6. considerare sempre il mobile
7. fornire comandi Git e comandi per locale:

```bash
cd ..
python3 -m http.server 1313 --bind 0.0.0.0
```

## Architettura letture dati

Priorità pubblica:

```text
JSON statici GitHub
-> snapshot pubblici Firebase solo se manca il JSON
-> collection Firebase granulari solo admin su richiesta
```

I dati statici principali sono:

```text
assets/public/config.json
assets/snapshots/seasons/manifest.json
assets/snapshots/seasons/<season>.json
assets/snapshots/honor.json
assets/rose/manifest.json
assets/listoni/manifest.json
assets/competitions/manifest.json
```

## V196: cosa è stato aggiunto

Nuova pagina pubblica:

```text
/zonaorientale/#archive
```

Etichette:

```text
Desktop: Archivio
Mobile: Altro -> Archivio stagioni
```

Funzioni principali in `app.js`:

```text
buildSeasonArchiveV196
renderSeasonArchiveV196
setSeasonArchiveSeasonIdV196
injectSeasonArchiveStylesV196
```

Oggetto console:

```js
ZonaOrientaleSeasonArchive.build()
ZonaOrientaleSeasonArchive.render()
ZonaOrientaleSeasonArchive.setSeason('2025-2026')
```

La pagina usa solo `state.raw` già caricato e non deve introdurre nuove letture Firebase.

## Punti delicati

- `assets/app.js` è ancora grande e contiene molti override storici.
- Le funzioni V193/V195 sono riusate anche da V196 (`getSeasonLabelV193`, `HISTORICAL_COMPETITIONS_V193`).
- Non normalizzare nomi squadra nei flussi rose: dopo V188 i nomi Excel vanno mantenuti.
- Le pagine nuove devono essere mobile-first e senza tabelle larghe.
- Il full-load admin deve restare lazy: solo dopo `Carica dati amministrazione`.

## Test minimo prima di consegnare overlay

```bash
node --check static/zonaorientale/assets/app.js
find static/zonaorientale/assets -type f -name '*.js' -print0 | xargs -0 -n 1 node --check
```

## Prossimi step suggeriti

- V197: generatore comunicati automatici.
- V198: centro notifiche admin/presidenti.
- V199: rifinitura mobile e controllo finale dei percorsi pubblici.
