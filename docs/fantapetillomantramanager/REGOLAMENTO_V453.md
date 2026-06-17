# V453 - Regolamento FantaPetilloMantraManager 2026-2027

La V453 struttura la sezione `Regolamento` del clone `FantaPetilloMantraManager` usando il PDF ufficiale caricato per la stagione 2026-2027.

## File pubblici

```text
static/fantapetillomantramanager/assets/regolamento/regolamento-fantapetillo-mantra-manager-2026-2027.pdf
static/fantapetillomantramanager/assets/js/sections/regolamento-section-v402.js
```

La sezione pubblica `/#regolamento` ora contiene:

- titolo dedicato `Fantacalcio MANTRA® Manageriale 2026-2027`;
- pulsante `Scarica PDF`;
- pulsante `Apri PDF`;
- box di riepilogo con parametri principali;
- indice navigabile;
- articoli strutturati per organico, rose, calcolo, modificatori, mercato, svincoli, scambi, finanze, stadio, calendario, competizioni, quote e penalizzazioni.

## Scope funzionale

La patch non modifica Firebase, Admin, rules, snapshot, Area Squadra o dati reali. L'Area Squadra resta protetta finche non vengono creati dati e `teamUsers` reali.

## Audit

```bash
cd static/fantapetillomantramanager
bash tools/check-fantapetillomantramanager.sh
```

Il check include `tools/audit-regolamento-v453.mjs`, che verifica PDF, link di download, marker runtime e cache-buster V453.
