# Merge checklist V495 - FantaMantraManager

## Prima del merge

- Applicare overlay V495.
- Eseguire `git rm -r static/zonaorientale/static`.
- Eseguire audit V495 da `static`:

```bash
node fanta-engine/tools/audit-zona-nested-static-cleanup-v495.mjs
node fanta-engine/tools/audit-runtime-regression-v495.mjs
node fanta-engine/tools/audit-multileague-contamination-v495.mjs
node fanta-engine/tools/audit-merge-readiness-v495.mjs
```

## Verifica manuale FantaMantraManager

- Home, competition, player, news, bilanci senza errori console.
- Footer V495.
- Logo e nome FantaMantraManager corretti.
- Dashboard Presidente nascosta quando entra Admin.
- Card Svincola Giocatori e Comunicato Avvenuto Scambio presenti per i presidenti.
- Listone e Calciomercato continuano a funzionare.
- Nessun riferimento visibile a ZonaOrientale.
