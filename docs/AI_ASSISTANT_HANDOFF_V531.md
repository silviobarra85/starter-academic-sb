# AI Assistant handoff V531

Baseline: V531 - seconda micro-estrazione dashboard.

## Stato corrente

- V522: Listoni e Calciomercato caricabili una sola volta in `fanta-engine/data/shared-assets/current`.
- V523: navigazione Listone/Calciomercato stabilizzata.
- V524: configuratore guidato nuova lega.
- V525: fast reload bootstrap.
- V526: adapter dati multi-season metadata-first.
- V527: bridge dashboard verso `fanta-engine`.
- V528: dashboard enforce guard.
- V529: prima micro-estrazione dashboard, sync metadati metriche pubbliche.
- V530: smoke strutturale Dashboard/Admin/Presidente.
- V531: seconda micro-estrazione, summary dashboard pubblico additive-only.

## Guardrail obbligatori per il prossimo assistente

- Overlay sempre whole-site con radici `static/` e `docs/`.
- Zip con soli file realmente modificati.
- Non modificare `FUNZIONALITA'.md` salvo richiesta esplicita.
- Non cancellare fallback locali Listoni/Calciomercato.
- Non centralizzare `renderDashboard`, Admin o Presidente in blocco unico.
- Una sola micro-estrazione funzionale per overlay.
- Verificare sempre che `replacesLocalRenderers` resti `false` finche la migrazione non e esplicitamente approvata.

## Verifica obbligatoria

```bash
node static/fanta-engine/tools/audit-dashboard-summary-extraction-v531.mjs
```

## Prossimo step consigliato

V532 - consolidamento dashboard public summary oppure smoke browser interazione rapida Dashboard/Listone/Calciomercato. Procedere con ulteriore estrazione solo se V531 passa nei test manuali su entrambe le leghe.
