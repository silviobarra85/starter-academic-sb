# Handoff nuovo assistente - V360

Versione corrente: V360.

## Ultimo intervento

Migliorata la Checklist QA Admin: ogni test ora ha una `i` informativa che spiega cosa controllare. La modifica e' solo UI/QA, visibile agli admin, senza impatto sui flussi core.

## File principali modificati

- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/tools/audit-manual-qa-info-v360.mjs`
- `static/zonaorientale/tools/check-zonaorientale.sh`
- `static/zonaorientale/index.html`
- `static/zonaorientale/competition.html`
- `static/zonaorientale/player.html`
- documentazione V360 in `docs/zonaorientale/`

## Stato funzionale

Preservare tutte le funzionalita' esistenti. La V360 non modifica:

- Calciomercato feed/archivio/TMW;
- matching e diagnostica giocatori V359;
- filtri Calciomercato V339;
- pannello Solo Admin V340;
- Listone;
- Rose;
- Competizioni;
- Fantamercato e simulatore trade;
- Admin Diagnostica;
- Firebase/Auth/EmailJS;
- Netlify Functions;
- mobile navigation.

## QA Admin

Il pannello resta esposto come:

```js
window.ZonaOrientaleManualQaPanelV358
```

ma la versione interna e' V360. Lo storage resta compatibile con V356:

```text
zonaorientale.manualQa.v356
```

Nuovo controllo:

```bash
static/zonaorientale/tools/audit-manual-qa-info-v360.mjs
```

## Regole importanti

- Non modificare `docs/zonaorientale/FUNZIONALITA'.md` salvo richiesta esplicita.
- Non cancellare altri file legacy senza audit mirato.
- Ogni futura release deve aggiornare footer, cache-buster, `DEPLOY_EXPECTED_VERSION_V181`, handoff e docs Vxxx.
