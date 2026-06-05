# Handoff nuovo assistente AI - V344

## Stato corrente

Versione runtime: V344.

La V344 fa cleanup controllato dei moduli JS legacy del Calciomercato player matching. Il modulo attivo resta:

```text
static/zonaorientale/assets/js/calciomercato/calciomercato-players-v340.js
```

Sono stati rimossi dal pacchetto/runtime:

```text
static/zonaorientale/assets/js/calciomercato/calciomercato-players-v335.js
static/zonaorientale/assets/js/calciomercato/calciomercato-players-v337.js
```

## Attenzione importante

In `assets/app.js` restano intenzionalmente nomi con suffisso V335/V337, per compatibilita:

```text
renderCalciomercatoPlayerTagsV335
activateCalciomercatoPlayerTimelineFromHashV335
normalizeCalciomercatoPlayerMatchValueV337
```

Non sono file legacy: sono wrapper ancora usati. Non rinominarli automaticamente.

## Diagnostiche

Browser:

```js
window.ZonaOrientaleJsLegacyCleanupV344.runSmokeTest()
window.ZonaOrientaleCalciomercatoPlayerMatchingV340.runSmokeTest()
window.ZonaOrientaleCalciomercatoPlayersV335.runSmokeTest()
```

CLI:

```bash
static/zonaorientale/tools/audit-js-legacy-v344.mjs
static/zonaorientale/tools/check-zonaorientale.sh
```

## Funzionalita da preservare

- tag giocatore sulle card Calciomercato;
- timeline giocatore in modal V336;
- matching conservativo V340, inclusa disambiguazione di `Giovane` minuscolo/aggettivo;
- renderer card V338;
- filtri V339;
- pannello Solo Admin/archivio V340;
- fallback immagini V334/V330/V328;
- Listone, Rose, Fantamercato interno, Dashboard Presidente, Admin, Firebase/Auth/EmailJS, Netlify Functions.

## Prossimo passo consigliato

V345: audit mirato di `assets/js/utils/shared-helpers-v294.js` e confronto con `shared-helpers-v295.js` + `shared-helper-bridge-v341.js`. Prima solo audit; eventuale rimozione solo se nessun riferimento runtime/documentale operativo lo richiede.
