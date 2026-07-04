# V555 - Eager data preload / warm cache

## Obiettivo

Ridurre la lentezza percepita di ZonaOrientale nei passaggi successivi tra pagine caricando in background i dati statici principali.

## Perche' non bloccare tutto all'inizio

Caricare davvero tutto prima di mostrare la pagina renderebbe l'apertura iniziale piu' lenta, soprattutto su ZonaOrientale. V555 usa quindi una strategia piu' equilibrata:

1. mostra subito l'interfaccia;
2. aspetta il primo paint/window load;
3. usa idle/background fetch con concorrenza limitata;
4. scalda la cache V553/sessione;
5. rende piu' rapidi i cambi pagina successivi.

## Dati pre-caricati

- `assets/public/config.json`
- `assets/league-config.json`
- `assets/snapshots/honor.json`
- `assets/snapshots/seasons/manifest.json` e relativi snapshot
- `assets/rose/manifest.json` e relativi file rose
- `assets/competitions/manifest.json` e relativi file competizioni
- `fanta-engine/data/shared-assets/current/assets/listoni/manifest.json` e relativi listoni
- `fanta-engine/data/shared-assets/current/assets/calciomercato/links.json`
- `fanta-engine/data/shared-assets/current/assets/calciomercato/archive/manifest.json` e relativi giorni d'archivio

## Guardrail

- Non cambia hash.
- Non sostituisce router.
- Non renderizza dati.
- Non scrive Firebase.
- Non modifica EmailJS.
- Non ripristina fallback locali Listoni/Calciomercato.
- Non modifica `FUNZIONALITA'.md`.

## Debug runtime

In console:

```js
window.FantaEngineEagerDataPreloadLastReportV555
```

oppure:

```js
window.FantaEngineEagerDataPreloadRuntimeV555.getReport()
```
