# AI Assistant handoff V532

Baseline: V532 - Smoke interazioni rapide Dashboard/Listone/Calciomercato.

## Stato corrente

- V522: Listoni e Calciomercato caricabili una sola volta in `fanta-engine/data/shared-assets/current`.
- V523: navigazione Listone/Calciomercato stabilizzata contro timer tardivi.
- V524: configuratore guidato nuova lega.
- V525: fast reload bootstrap.
- V526: adapter dati multi-season metadata-first.
- V527: bridge dashboard verso `fanta-engine`.
- V528: dashboard enforce guard.
- V529: prima micro-estrazione dashboard.
- V530: smoke strutturale Dashboard/Admin/Presidente.
- V531: seconda micro-estrazione dashboard, summary pubblico additive-only.
- V532: smoke/observer interazioni rapide Dashboard/Listone/Calciomercato.

## Overlay rimanenti consigliati: 4

1. **V533 - Terza micro-estrazione dashboard**  
   Estrarre solo un helper pubblico non critico. Non toccare Admin/Presidente.

2. **V534 - Multi-season path resolver activation**  
   Attivare l'adapter V526 come risolutore path per-stagione, senza migrazione fisica dei dati.

3. **V535 - Shared assets fallback cleanup readiness**  
   Preparare manifest/audit per sapere quali fallback locali sono duplicati del centrale. Non cancellare file senza richiesta esplicita.

4. **V536 - Merge readiness / release candidate**  
   Audit finale whole-site, documentazione consolidata, checklist regressioni e handoff finale.

## Guardrail obbligatori per ogni overlay futuro

- Overlay sempre whole-site con radici `static/` e `docs/`.
- Zip con soli file realmente modificati.
- Aggiornare sempre documentazione pertinente e handoff versione.
- Aggiornare `docs/OVERLAY_ROADMAP.md` quando la roadmap avanza.
- Non modificare `FUNZIONALITA'.md` salvo richiesta esplicita.
- Non cancellare fallback locali Listoni/Calciomercato.
- Non centralizzare `renderDashboard`, Admin o Presidente in blocco unico.
- Una sola micro-estrazione funzionale per overlay.
- Verificare sempre che `replacesLocalRenderers` resti `false` finche la migrazione non e esplicitamente approvata.

## Verifica obbligatoria

```bash
node static/fanta-engine/tools/audit-quick-navigation-smoke-v532.mjs
```

## Note per il prossimo overlay

Procedere con V533 solo se V532 passa anche nel test manuale rapido Dashboard -> Listone -> Calciomercato su entrambe le leghe.
