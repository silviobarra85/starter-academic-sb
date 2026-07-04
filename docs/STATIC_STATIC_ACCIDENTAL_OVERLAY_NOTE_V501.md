# Nota V501 - Cartella accidentale static/static

Durante la verifica dopo V500 e stata segnalata una ulteriore cartella `static/static` dentro la root `static`.

## Esito verifica

La cartella non fa parte dell'architettura corretta. Dai file caricati risultava contenere solo pochi file V496 del motore comune copiati nel punto sbagliato:

```text
static/static/tools/audit-multileague-contamination-v496.mjs
static/static/tools/audit-ui-components-v496.mjs
static/static/tools/audit-runtime-regression-v496.mjs
static/static/js/ui/components-v496.js
static/static/js/core/league-presentation-v481.js
```

Questo e compatibile con una applicazione accidentale di overlay o con un comando eseguito dalla directory sbagliata. La struttura corretta resta:

```text
static/fanta-engine
static/zonaorientale
static/fantapetillomantramanager
static/media
```

## Azione richiesta

Prima degli audit V501, rimuovere la cartella accidentale con:

```bash
git rm -r static/static 2>/dev/null || rm -rf static/static
```

Poi eseguire gli audit V501.
