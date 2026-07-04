# Dashboard cards safe-enforce V504 - ZonaOrientale

V504 introduce un motore dashboard comune piu' operativo, ma ancora prudente.

## File principali

- `static/fanta-engine/js/ui/dashboard-cards-engine-v504.js`
- `static/fanta-engine/data/dashboard-engine-enforce-v504.json`
- `static/fanta-engine/tools/audit-dashboard-engine-enforce-v504.mjs`

## Modalita'

- `observe-first`: marca le card, non forza visibilita'.
- `safe-enforce`: applica `hidden` e `aria-hidden` solo alle card role-gated admin/presidente/authenticated governate dal registry.
- `enforce`: modalita' completa, da usare solo dopo test reali.

In V504 le due leghe usano `safe-enforce`.

## Cosa resta locale

- Renderer Admin e Presidente.
- Logiche specifiche FantaMantraManager come Svincola, Comunicato scambio e Proposte regolamento.
- Firebase, EmailJS, dati, rules, news, regolamenti, bilanci.

## Perche' e' sicura

Il motore non cancella elementi e non tocca dati. Aggiunge solo attributi `data-*`, classi diagnostiche, `hidden` e `aria-hidden` quando la card e' role-gated e non abilitata per il contesto corrente.
