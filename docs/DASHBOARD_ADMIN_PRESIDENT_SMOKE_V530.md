# Dashboard/Admin/Presidente smoke baseline V530

La V530 aggiunge una baseline di smoke strutturale per le aree piu rischiose dopo la migrazione progressiva verso `fanta-engine`:

- Dashboard pubblica
- Area Admin
- flussi Presidente
- Listone e Calciomercato su asset comuni

## Scopo

Prima di estrarre un secondo blocco dashboard, la V530 verifica che i flussi gia funzionanti siano ancora agganciati correttamente su entrambe le leghe.

Lo script principale e:

```bash
node static/fanta-engine/tools/smoke-dashboard-admin-president-v530.mjs
```

E disponibile anche l'alias:

```bash
node static/fanta-engine/tools/audit-dashboard-role-smoke-v530.mjs
```

## Cosa verifica

Per `zonaorientale` e `fantapetillomantramanager` controlla:

- `index.html` carica `app.js?v=530`;
- gli entrypoint non hanno residui `?v=512` o `?v=529`;
- le sezioni `dashboard`, `admin`, `listone`, `calciomercato` esistono;
- le voci nav principali sono ancora collegate;
- gli elementi dashboard principali sono presenti;
- gli elementi Admin principali sono presenti;
- i flussi Presidente restano nel runtime locale;
- `dashboard-renderer-extraction-v529` e `dashboard-enforce-v528` restano preservati;
- gli asset comuni Listoni/Calciomercato restano su `shared-assets/current`.

## Cosa non fa

- Non sostituisce `renderDashboard`.
- Non modifica Firebase.
- Non modifica EmailJS.
- Non sposta dati.
- Non cancella fallback locali.
- Non modifica `FUNZIONALITA'.md`.

## Interpretazione

V530 e una baseline di controllo. Se passa e i test manuali sono ok, il prossimo overlay puo fare una seconda micro-estrazione dashboard oppure introdurre uno smoke browser reale con Playwright, se si vuole validare interazioni DOM piu profonde.
