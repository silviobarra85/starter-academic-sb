# Audit V481 — Motore comune presentazione

V481 aggiunge `static/fanta-engine/js/core/league-presentation-v481.js` e fa usare il motore comune ai loader di ZonaOrientale e FantaMantraManager.

## Controlli

- Engine comune presente in `static/fanta-engine`.
- Entrambi i loader lega-specifici usano il motore comune con fallback locale.
- Footer aggiornati a V481.
- Cache-buster HTML aggiornati a `v=481`.
- Config delle due leghe aggiornate a `currentVersion: 481`.
- Nessuna modifica a `FUNZIONALITA'.md`.

## Verifica manuale

Aprire entrambe le home e controllare footer, titolo dashboard, menu mobile “Altro”, navigazione verso Competizioni/Listone/Regolamento e login Admin.
