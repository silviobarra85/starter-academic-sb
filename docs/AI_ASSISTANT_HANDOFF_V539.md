# AI Assistant handoff - V539

## Overlay

`overlay_v539_merge_readiness_release_candidate_whole_site.zip`

## Scopo

V539 e' la release candidate / merge readiness del lavoro V521-V538. Non aggiunge una nuova migrazione funzionale: consolida stato, audit, documentazione, cache-buster e guardrail.

## File principali

- `static/fanta-engine/data/release-candidates/release-candidate-v539.json`
- `static/fanta-engine/tools/audit-merge-readiness-release-candidate-v539.mjs`
- `docs/MERGE_READINESS_RELEASE_CANDIDATE_V539.md`
- `docs/AI_ASSISTANT_HANDOFF_V539.md`
- `docs/OVERLAY_ROADMAP.md`
- `docs/CENTRALIZATION_STATUS_V521.md`

## Baseline da preservare

- `static/fanta-engine/data/shared-assets/current/` resta il path primario per Listoni e Calciomercato.
- I fallback locali delle due leghe restano presenti.
- `season-data-adapter-v526.js` e `season-path-resolver-v537.js` restano attivi.
- `navigation-performance-guard-v536.js` resta attivo per non peggiorare ZonaOrientale.
- I renderer locali restano primari: dashboard/Admin/Presidente non vanno sostituiti.
- Firebase ed EmailJS non vanno toccati salvo richiesta esplicita.
- `docs/zonaorientale/FUNZIONALITA'.md` non va modificato salvo richiesta esplicita.

## Verifica

```bash
node static/fanta-engine/tools/audit-merge-readiness-release-candidate-v539.mjs
```

## Dopo V539

La roadmap consigliata V521-V539 e' chiusa. Prossimi passi possibili solo dopo test manuale:

1. chiudere la release candidate e continuare solo con bugfix;
2. creare un overlay separato per rimuovere fallback locali Listoni/Calciomercato, solo con approvazione esplicita;
3. proseguire con nuove estrazioni dashboard, ma solo una micro-estrazione per volta.

## Regole operative da mantenere

- Overlay unico whole-site.
- Zip con soli file modificati.
- Applicazione con una sola copia `static/*` e `docs/*`.
- Aggiornare sempre docs e handoff per ogni overlay futuro.
- Aggiornare `docs/OVERLAY_ROADMAP.md` quando la roadmap cambia o avanza.
