# Handoff V506 - Tool/form validators comuni

Overlay V506 per ZonaOrientale.

- Aggiornato footer/cache-buster/config a V506.
- Aggiunti validatori comuni `fanta-engine/js/core/form-validators-v506.js`.
- Sorteggio giornate collegato al motore V506 con fallback locale V473.
- Nessuna modifica a Firebase, EmailJS, Admin, Area Squadra, dati, listoni/calciomercato.
- `FUNZIONALITA'.md` non modificato.

Audit:

```bash
cd static
node fanta-engine/tools/audit-form-validators-v506.mjs
node fanta-engine/tools/audit-runtime-regression-v506.mjs
node fanta-engine/tools/audit-multileague-contamination-v506.mjs
```
