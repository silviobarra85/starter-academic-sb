# Handoff V506 - Tool/form validators comuni

Overlay V506 per FantaMantraManager.

- Aggiornato footer/cache-buster/config a V506.
- Aggiunti validatori comuni `fanta-engine/js/core/form-validators-v506.js`.
- Sorteggio giornate collegato al motore V506 con fallback locale V473.
- Dashboard Presidente, Svincola Giocatori, Comunicato Avvenuto Scambio e Proposte regolamento sono preservati.
- Nessuna modifica a Firebase, EmailJS, dati, rules, news, regolamenti, bilanci, listoni/calciomercato.

Audit:

```bash
cd static
node fanta-engine/tools/audit-form-validators-v506.mjs
node fanta-engine/tools/audit-runtime-regression-v506.mjs
node fanta-engine/tools/audit-multileague-contamination-v506.mjs
```
