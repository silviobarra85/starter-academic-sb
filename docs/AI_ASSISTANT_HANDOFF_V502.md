# AI Assistant Handoff V502 - Template nuova lega

## Stato corrente

Il progetto multi-lega contiene due leghe attive:

- `static/zonaorientale` per ZonaOrientale Salerno;
- `static/fantapetillomantramanager` per FantaMantraManager;
- `static/fanta-engine` come motore comune progressivamente centralizzato.

La copia annidata `static/zonaorientale/static` e la cartella accidentale `static/static` devono restare assenti. Se riappaiono, sono segnali di applicazione overlay errata o regressione di cleanup.

## Cosa e' stato fatto prima di V502

- V480: registro sezioni unificato.
- V481: presentation engine comune.
- V482: audit anti-contaminazione multi-lega.
- V483: consolidamento documentazione FantaMantraManager.
- V484-V485: inventario e centralizzazione prudente asset listone/calciomercato con fallback locali.
- V486-V491: inventario e centralizzazione selettiva CSS/JS comuni.
- V492-V493: audit runtime e merge readiness.
- V494: piano pulizia duplicati locali senza cancellazioni.
- V495: rimozione copia annidata `static/zonaorientale/static`.
- V496: UI components comuni.
- V497: registry unico card/funzionalita'.
- V498: adapter EmailJS comune.
- V499: adapter Firebase comune, senza migrazione dati.
- V500: dashboard cards engine in modalita' observe-first.
- V501: tool engine comune per Sorteggio giornate.

## Cosa aggiunge V502

V502 aggiunge un template per creare nuove leghe senza duplicare manualmente le due leghe esistenti:

- `static/_league-template/`
- `static/fanta-engine/tools/create-league-v502.mjs`
- `static/fanta-engine/data/league-template-v502.json`

Il template non crea automaticamente Firebase, EmailJS, redirect Netlify o dati reali. Serve solo come base controllata.

## Guardrail obbligatori

- Non modificare `docs/zonaorientale/FUNZIONALITA'.md` salvo richiesta esplicita.
- Non rinominare lo slug `fantapetillomantramanager`.
- Non spostare dati specifici di lega dentro `fanta-engine`.
- Non cancellare fallback locali centralizzati senza patch dedicata.
- Non migrare Firebase a `/leagues/{leagueId}/...` senza backup, rules e test browser.
- Non fare merge su `master` se gli audit V502 non passano.

## Roadmap dopo V502

1. V503 - Test browser Playwright.
2. V504 - Dashboard engine enforce opzionale, solo dopo test reali.
3. V505 - Migrazione graduale renderer dashboard comuni.
4. V506 - Validator comuni per form/tool.
5. Fase futura - eventuale modello Firebase multi-lega con path `/leagues/{leagueId}/...`.
