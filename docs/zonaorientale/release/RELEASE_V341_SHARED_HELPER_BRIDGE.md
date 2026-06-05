# Release V341 - Shared helper bridge

Data: 05/06/2026

## Tipo modifica

Refactor protetto helper puri.

## File modificati principali

```text
static/zonaorientale/assets/app.js
static/zonaorientale/assets/js/utils/shared-helper-bridge-v341.js
static/zonaorientale/tools/check-zonaorientale.sh
static/zonaorientale/index.html
static/zonaorientale/competition.html
static/zonaorientale/player.html
docs/zonaorientale/CHANGELOG_CONSOLIDATO.md
docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_CURRENT.md
docs/zonaorientale/FUNZIONALITAV341.md
docs/zonaorientale/handoff/HANDOFF_NUOVO_ASSISTENTE_V341.md
docs/zonaorientale/refactor/SHARED_HELPER_BRIDGE_V341.md
```

## Dettagli

- Aggiunto `shared-helper-bridge-v341.js`.
- Ricollegati helper CSV/normalizzazione mantenendo i wrapper storici.
- Aggiornati cache-buster, footer e `DEPLOY_EXPECTED_VERSION_V181` a V341.
- Aggiornato `check-zonaorientale.sh` con controlli V341.

## Funzionalita preservate

- Listone, filtro Modifiche, export CSV solo Admin.
- Diagnostica dati Admin.
- Calciomercato feed, filtri, card, timeline giocatore e archivio.
- Rose, Fantamercato interno, Dashboard Presidente, Admin, Firebase/Auth/EmailJS.

## Note

Non modificato `docs/zonaorientale/FUNZIONALITA'.md`.
