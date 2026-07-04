# AI handoff V526 - Adapter dati multi-season

Overlay whole-site applicabile con un solo giro di comandi.

## Scope

V526 introduce un adapter metadata-first per normalizzare stagioni diverse tra le leghe e distinguere dati condivisi da dati stagionali. Non esegue ancora migrazioni fisiche.

## Guardrail

- Non modificare `FUNZIONALITA'.md`.
- Non cancellare fallback locali.
- Non cambiare Firebase, EmailJS, ruoli admin o presidente.
- Listoni e Calciomercato restano asset condivisi in `static/fanta-engine/data/shared-assets/current/`.
- Overlay unico `static/` + `docs/`, solo file modificati.

## Prossimo overlay

V527 - Migrazione graduale renderer dashboard successiva.
