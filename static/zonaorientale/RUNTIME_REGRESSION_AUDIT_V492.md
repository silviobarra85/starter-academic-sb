# V492 - Audit regressione runtime esteso

La V492 aggiunge un audit statico piu' ampio per intercettare regressioni dopo la centralizzazione progressiva del motore comune.

## Obiettivo

Verificare in un unico punto:

- versioni runtime e footer V492;
- asset HTML risolti e fallback locali presenti;
- separazione branding ZonaOrientale/FantaMantraManager;
- registry sezioni comune;
- motore presentazione comune;
- centralizzazione prudente di listoni/calciomercato, CSS e JS;
- path dati con fallback locale;
- EmailJS separati;
- preservazione Dashboard Presidente, card presidente e Proposte regolamento FantaMantraManager.

## Comandi

```bash
cd static
node fanta-engine/tools/audit-runtime-regression-v492.mjs
node fanta-engine/tools/audit-multileague-contamination-v492.mjs
```

## Guardrail

La V492 non cancella file locali e non sposta nuovi runtime. E' una patch di controllo/stabilizzazione: Firebase, EmailJS, Admin, Dashboard Presidente, Area Squadra, news, regolamenti, bilanci, listoni e calciomercato non cambiano logica funzionale.
