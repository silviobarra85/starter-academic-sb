# AI Assistant handoff - V538

## Overlay

`overlay_v538_shared_assets_fallback_readiness_whole_site.zip`

## Scopo

V538 prepara il cleanup dei fallback locali duplicati per Listoni e Calciomercato. Non cancella nulla: produce manifest, audit e documentazione per decidere in sicurezza dopo la release candidate.

## File principali

- `static/fanta-engine/data/shared-assets/current/fallback-readiness-v538.json`
- `static/fanta-engine/tools/audit-shared-assets-fallback-readiness-v538.mjs`
- `docs/SHARED_ASSETS_FALLBACK_CLEANUP_READINESS_V538.md`
- `docs/AI_ASSISTANT_HANDOFF_V538.md`
- `docs/OVERLAY_ROADMAP.md`
- `docs/CENTRALIZATION_STATUS_V521.md`

## Guardrail

- Overlay unico whole-site.
- Solo file modificati nello zip.
- Docs e handoff aggiornati.
- Nessuna modifica a `docs/zonaorientale/FUNZIONALITA'.md`.
- Nessuna cancellazione fallback locali.
- Nessuna modifica a Firebase, EmailJS, Admin o Presidente.
- Listoni e Calciomercato restano primari su `shared-assets/current`.

## Verifica

```bash
node static/fanta-engine/tools/audit-shared-assets-fallback-readiness-v538.mjs
```

## Roadmap dopo V538

Resta 1 overlay consigliato:

- V539 Merge readiness / release candidate.

Dopo V539, eventuale rimozione dei fallback locali deve essere un overlay separato e solo con approvazione esplicita.
