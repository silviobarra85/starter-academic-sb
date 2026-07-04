# AI Assistant handoff V527

Baseline: V527 - Dashboard renderer bridge whole-site.

## Stato

- `fanta-engine` contiene un nuovo bridge dashboard V527.
- `zonaorientale` e `fantapetillomantramanager` installano il bridge.
- I renderer locali restano attivi e sono il percorso primario.
- Il bridge comune agisce solo dopo il render e aggiunge metadata/report.

## Guardrail futuri

- Non cancellare funzioni locali dashboard senza audit e test browser.
- Non toccare Firebase/EmailJS durante la migrazione renderer.
- Non modificare `FUNZIONALITA'.md` salvo richiesta esplicita.
- Ogni overlay resta whole-site, con solo file modificati e applicazione tramite `static/*` + `docs/*`.

## Prossimo overlay consigliato

V528 - Hardening dashboard enforce, solo dopo test manuali reali su Admin e Presidente.
