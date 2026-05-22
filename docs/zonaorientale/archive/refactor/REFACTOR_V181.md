# V181 - Fix report mobile e cache-buster finale

## Obiettivo

Consolidare il pre-online dopo V180 correggendo due dettagli emersi dai test:

- le tabelle generate da **Controlla asset pubblici** e **Checklist online finale** non devono sforare a destra su mobile;
- la checklist deve considerare coerenti tutti i cache-buster degli asset caricati in `index.html`.

## File modificati

- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/assets/css/mobile-suite-v168.css`

## Dettagli tecnici

### Report admin mobile

Aggiunte regole CSS mobile dedicate a:

- `.public-preflight-report-v179`
- `.deploy-checklist-report-v180`

Le regole forzano il contenimento del report nel proprio blocco, rendono la tabella larga al massimo il 100%, consentono l'eventuale scroll orizzontale interno e applicano `overflow-wrap`/`word-break` alle celle con testi lunghi.

### Cache-buster

Aggiornati tutti gli asset versionati caricati da `index.html` a `v=181`, inclusi i CSS separati ancora fermi a `v=169`:

- `styles.css?v=181`
- `components-v130.css?v=181`
- `admin-v130.css?v=181`
- `transfer-market-v130.css?v=181`
- `competition-detail-v130.css?v=181`
- `mobile-suite-v168.css?v=181`
- `app.js?v=181`

La checklist ora si aspetta `V181` per footer e asset.

## Impatto Firebase

Nessuna nuova lettura Firebase.

Le funzioni di controllo restano solo diagnostiche:

- `Controlla asset pubblici` fa fetch dei JSON statici su GitHub/static hosting;
- `Checklist online finale` riusa il controllo asset statici e aggiunge verifiche runtime su versione, modalità admin e letture stimate.

## Test consigliati

1. Avviare in locale da `static/zonaorientale`:

```bash
cd ..
python3 -m http.server 1313 --bind 0.0.0.0
```

2. Aprire:

```text
http://localhost:1313/zonaorientale/
```

3. Da mobile/DevTools mobile, entrare in Admin leggero e premere:

- `Controlla asset pubblici`
- `Checklist online finale`

4. Verificare che le tabelle restino dentro il box e che `Version e cache-buster` sia `OK`.

## Commit suggerito

```bash
git add static/zonaorientale/index.html static/zonaorientale/assets/app.js static/zonaorientale/assets/css/mobile-suite-v168.css docs/zonaorientale/REFACTOR_V181.md
git commit -m "V181 fix mobile deploy reports and cache busters"
```
