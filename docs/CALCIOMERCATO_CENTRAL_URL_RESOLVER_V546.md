# V546 - Calciomercato central URL resolver

## Obiettivo

Risolvere la regressione post-cleanup V543/V545 in cui la pagina Calciomercato restava configurata ma mostrava il warning:

> Fonti non complete. Fonti automatiche e archivio centrale temporaneamente non raggiungibili...

## Causa

Dopo la rimozione dei fallback locali, Calciomercato deve leggere solo da:

- `static/fanta-engine/data/shared-assets/current/assets/calciomercato/links.json`
- `static/fanta-engine/data/shared-assets/current/assets/calciomercato/archive/manifest.json`
- `static/fanta-engine/data/shared-assets/current/assets/calciomercato/archive/*.json`

Il resolver V545 usava candidati basati soprattutto su `window.location.pathname`. In alcuni contesti di pubblicazione o sviluppo locale il documento corrente non è sufficiente per ricostruire il path giusto, anche se il modulo `assets/app.js` è servito dal percorso corretto.

## Soluzione V546

V546 aggiunge un resolver URL più robusto basato prima sull'URL reale del modulo `assets/app.js` tramite `import.meta.url`, poi sui candidati precedenti:

- deploy Netlify/Hugo: `/zonaorientale/assets/app.js` -> `/fanta-engine/...`
- sviluppo locale da repo parent: `/starter-academic-sb/static/zonaorientale/assets/app.js` -> `/starter-academic-sb/static/fanta-engine/...`
- prefissi progetto tipo GitHub Pages: `/starter-academic-sb/zonaorientale/assets/app.js` -> `/starter-academic-sb/fanta-engine/...`

Corregge anche il callback `.map(withLeagueCacheBusterV446)`, che passava involontariamente l'indice array come versione cache-buster.

## Guardrail

- Non ripristina fallback locali.
- Non sposta asset.
- Non modifica Firebase.
- Non modifica EmailJS.
- Non modifica Admin o Presidente.
- Non modifica `FUNZIONALITA'.md`.
- Mantiene Listoni e Calciomercato come asset comuni in `fanta-engine`.

## Verifica

```bash
node static/fanta-engine/tools/audit-calciomercato-central-url-resolver-v546.mjs
```

Dopo il deploy, la pagina Calciomercato non deve mostrare il warning V545 e deve caricare fonti/archivio dal path centrale.
