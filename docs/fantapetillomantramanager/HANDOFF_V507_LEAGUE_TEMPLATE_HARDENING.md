# Handoff V507 - League template hardening (FantaMantraManager)

La V507 aggiorna il motore comune per il template nuova lega.

Impatto runtime su FantaMantraManager: nessuna funzionalita' di business modificata.

Cambiamenti rilevanti:

- footer/cache-buster/config aggiornati a V507;
- `leagueTemplateEngine` punta al generatore V507 e al validatore V507;
- aggiunti audit V507;
- non sono stati toccati Firebase, EmailJS, Admin, Dashboard Presidente, Area Squadra, dati, news, regolamenti, bilanci, listoni o calciomercato;
- `static/static` e `static/zonaorientale/static` devono restare assenti.

Audit da eseguire:

```bash
cd static
node fanta-engine/tools/audit-league-template-hardening-v507.mjs
node fanta-engine/tools/audit-runtime-regression-v507.mjs
node fanta-engine/tools/audit-multileague-contamination-v507.mjs
```
