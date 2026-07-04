# Merge branch checklist V494

Checklist finale aggiornata dopo V494 per il ciclo V480-V494.

## Audit obbligatori

```bash
cd static
node fanta-engine/tools/audit-local-duplicate-cleanup-readiness-v494.mjs
node fanta-engine/tools/audit-runtime-regression-v494.mjs
node fanta-engine/tools/audit-multileague-contamination-v494.mjs
node fanta-engine/tools/audit-merge-readiness-v494.mjs
```

## Test manuale minimo

### ZonaOrientale

- home, competition e player senza errori console;
- footer V494;
- menu desktop/mobile;
- Listone e Player da Listone;
- Calciomercato/Fantamercato;
- Admin e Area Squadra;
- nessun riferimento visibile a FantaMantraManager.

### FantaMantraManager

- home, competition, player, news e bilanci senza errori console;
- footer V494;
- logo e nome corretti;
- Dashboard Presidente nascosta quando entra Admin;
- card Svincola Giocatori e Comunicato Avvenuto Scambio presenti per i presidenti;
- Listone e Calciomercato;
- nessun riferimento visibile a ZonaOrientale.

## Nota duplicati locali

La V494 non cancella copie locali. Sono ancora fallback/rollback. La pulizia fisica e' rimandata a una futura patch esplicita.
