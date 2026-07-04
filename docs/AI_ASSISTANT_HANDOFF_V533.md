# AI Assistant handoff V533

Baseline: V533 - Terza micro-estrazione dashboard.

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
- V533: terza micro-estrazione dashboard, section status read-only.

## Overlay rimanenti consigliati: 3

1. **V534 - Multi-season path resolver activation**  
   Usare l'adapter V526 come risolutore path per-stagione. Non spostare file fisici.

2. **V535 - Shared assets fallback cleanup readiness**  
   Preparare manifest/audit per sapere quali fallback locali sono duplicati del centrale. Non cancellare file senza richiesta esplicita.

3. **V536 - Merge readiness / release candidate**  
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
node static/fanta-engine/tools/audit-dashboard-section-status-extraction-v533.mjs
```

## Note per il prossimo overlay

Procedere con V534 come attivazione conservativa del path resolver multi-season. Non migrare fisicamente i dati e non cambiare Firebase/EmailJS.
