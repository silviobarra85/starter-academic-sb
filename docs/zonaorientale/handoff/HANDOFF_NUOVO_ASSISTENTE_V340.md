# Handoff nuovo assistente AI - V340

## Stato versione

Versione corrente: V340  
Data: 05/06/2026  
Branch di lavoro tipico: `refactor/260528-zonaorientale-next`  
Obiettivo: refactor progressivo e protetto senza perdere funzionalita.

## Modifica V340

La V340 completa due interventi mirati:

1. Estrae il rendering del pannello `Solo Admin` dell'archivio Calciomercato in `assets/js/calciomercato/calciomercato-admin-v340.js`.
2. Aggiorna il matching giocatore con `assets/js/calciomercato/calciomercato-players-v340.js`, evitando falsi positivi quando un nome giocatore coincide con una parola minuscola comune, ad esempio `giovane`.

## Architettura Calciomercato aggiornata

Moduli attivi:

```text
assets/js/calciomercato/calciomercato-images-v334.js
assets/js/calciomercato/calciomercato-players-v340.js
assets/js/calciomercato/calciomercato-render-v338.js
assets/js/calciomercato/calciomercato-filters-v339.js
assets/js/calciomercato/calciomercato-admin-v340.js
```

`assets/app.js` resta il file orchestratore e mantiene wrapper storici per compatibilita.

## Wrapper da preservare in app.js

```text
renderCalciomercatoArticleCardV306()
getCalciomercatoFilteredArticlesV306()
renderCalciomercatoSelectOptionsV306()
renderCalciomercatoTeamSelectOptionsV314()
renderCalciomercatoSourceSelectOptionsV314()
setupCalciomercatoControlsV306()
renderCalciomercatoArchiveAdminToolsV323()
setCalciomercatoArchiveAdminExpandedV327()
getCalciomercatoArticlePlayerMatchesV335()
renderCalciomercatoPlayerTagsV335()
openCalciomercatoPlayerTimelineModalV336()
```

Non rimuoverli in modo diretto: sono agganciati da patch storiche, diagnostiche o UI.

## Diagnostiche runtime

```js
window.ZonaOrientaleCalciomercatoArchiveAdminV340
window.ZonaOrientaleCalciomercatoPlayerMatchingV340
```

Smoke test matching:

```js
window.ZonaOrientaleCalciomercatoPlayerMatchingV340.runSmokeTest()
```

Lo smoke test deve confermare che `Giovane` capitalizzato viene riconosciuto e `giovane` minuscolo come aggettivo non viene associato al giocatore.

## Funzionalita da preservare

- Feed RSS/HTML Calciomercato.
- Fonti TMW squadra e parser HTML TMW.
- Archivio statico giornaliero e manifest.
- Download Admin giorno/intervallo.
- Diagnostica archivio V324.
- Toggle Solo Admin V327.
- Card compatte V332.
- Fallback immagini V334/V330/V328.
- Tag giocatore, matching e modal timeline V335-V340.
- Filtri V339.
- Listone, filtro Modifiche, export CSV Admin.
- Rose, Fantamercato interno, Dashboard Presidente, Admin.
- Firebase/Auth/EmailJS.
- Mobile navigation e menu Altro.

## Prossima modifica consigliata

Proseguire con una V341 di pulizia helper duplicati sicuri, ma solo dopo grep e test. Non cancellare ancora moduli legacy V335/V337 o CSS candidati orfani senza task dedicato.

## Comandi test

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/js/calciomercato/calciomercato-admin-v340.js
node --check static/zonaorientale/assets/js/calciomercato/calciomercato-players-v340.js
static/zonaorientale/tools/check-zonaorientale.sh
static/zonaorientale/tools/audit-assets-v298.sh
static/zonaorientale/tools/audit-css-v300.sh
```
