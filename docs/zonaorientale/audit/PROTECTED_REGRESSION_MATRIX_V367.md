# Matrice audit V367 - Protected regression

## Scopo

La matrice V367 definisce i controlli minimi anti-regressione da eseguire prima di una consegna.

## Controlli automatici

| Area | Controllo | Esito atteso |
| --- | --- | --- |
| Versione | `DEPLOY_EXPECTED_VERSION_V181` | `367` |
| HTML | footer/cache-buster | `V367` e `v=367` |
| Asset locali | link CSS/JS/JSON/manifest | file presenti |
| JS | `node --check` su asset JS | nessun errore sintattico |
| Import JS | import relativi | file esistenti |
| JSON | parse dei JSON in `assets` | JSON validi |
| Marker runtime | V358-V367 | presenti |
| Trade | simulatori local-only | marker preservati |
| Calciomercato | diagnostica player V359 | marker e modulo presenti |
| Docs | documenti V367 | presenti |
| Documento protetto | `FUNZIONALITA'.md` | presente e non modificato in questa release |

## File principali protetti

- `assets/app.js`
- `assets/js/market/transfer-market.js`
- `assets/js/dev/trade-notification-simulator-v255.js`
- `assets/js/calciomercato/calciomercato-players-v359.js`
- `assets/js/utils/shared-helper-bridge-v341.js`
- `assets/css/mobile-suite-v168.css`
- `assets/css/refactor/listone.css`
- `assets/css/refactor/calciomercato.css`
- `assets/competitions/manifest.json`
- `assets/calciomercato/links.json`
- `assets/calciomercato/archive/manifest.json`

## Note operative

Gli audit storici V358-V362 non devono richiedere una versione esatta ormai superata. Devono verificare che il runtime sia almeno pari alla release che proteggono e che i marker/funzioni siano ancora presenti.
