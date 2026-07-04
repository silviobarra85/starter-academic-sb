# Handoff V510 - Navigation actions fix

## Sintesi

La V510 corregge la navigazione dei pulsanti/link verso le sezioni tramite un motore comune in `fanta-engine`.

## File principali

- `static/fanta-engine/js/ui/navigation-actions-v510.js`
- `static/fanta-engine/data/navigation-actions-v510.json`
- `static/fanta-engine/tools/audit-navigation-actions-v510.mjs`
- `docs/NAVIGATION_ACTIONS_ENGINE_V510.md`
- `docs/OVERLAY_ROADMAP.md`

## Cosa verificare

- I pulsanti dashboard/home mobile portano alla sezione corretta.
- Menu desktop/mobile funzionano.
- Footer V510.
- Nessuna contaminazione tra leghe.
- Admin/Presidente invariati.

## Guardrail

Non sono stati toccati Firebase, EmailJS, dati, rules, regolamenti, listoni, calciomercato o `FUNZIONALITA'.md`.
