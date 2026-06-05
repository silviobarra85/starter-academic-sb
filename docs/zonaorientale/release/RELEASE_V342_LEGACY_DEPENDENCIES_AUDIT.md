# Release V342 - Audit dipendenze legacy protetto

Data: 05/06/2026

## Tipo modifica

Refactor/audit protetto. Nessuna rimozione file.

## File modificati principali

```text
static/zonaorientale/assets/app.js
static/zonaorientale/tools/audit-legacy-dependencies-v342.mjs
static/zonaorientale/tools/check-zonaorientale.sh
static/zonaorientale/index.html
static/zonaorientale/competition.html
static/zonaorientale/player.html
docs/zonaorientale/CHANGELOG_CONSOLIDATO.md
docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_CURRENT.md
docs/zonaorientale/FUNZIONALITAV342.md
docs/zonaorientale/audit/LEGACY_DEPENDENCIES_MATRIX_V342.md
docs/zonaorientale/handoff/HANDOFF_NUOVO_ASSISTENTE_V342.md
docs/zonaorientale/refactor/LEGACY_DEPENDENCIES_AUDIT_V342.md
```

## Dettagli

- Aggiunto `audit-legacy-dependencies-v342.mjs`.
- Aggiunta diagnostica runtime `window.ZonaOrientaleLegacyDependencyAuditV342`.
- Aggiornato `check-zonaorientale.sh` con controlli V342.
- Aggiornati cache-buster, footer e `DEPLOY_EXPECTED_VERSION_V181` a V342.
- Documentata la matrice dei candidati legacy.

## Funzionalita preservate

- Calciomercato feed, filtri, renderer, card, timeline giocatore e archivio.
- Listone, filtro Modifiche, export CSV solo Admin.
- Rose, Fantamercato interno, Dashboard Presidente, Admin, Firebase/Auth/EmailJS.
- Netlify Functions e dati statici.
- Mobile navigation e pagine standalone.

## Note

Non modificato `docs/zonaorientale/FUNZIONALITA'.md`.
