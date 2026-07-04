# AI Assistant Handoff V506 - Fanta multi-lega / fanta-engine

Questo documento e' il punto di passaggio per il prossimo assistente AI. Deve essere letto prima di proporre o generare altri overlay.

## Stato attuale

I siti statici attivi sono:

- `static/zonaorientale`
- `static/fantapetillomantramanager`
- `static/fanta-engine` come motore comune
- `static/_league-template` come template nuova lega

Le cartelle accidentali `static/zonaorientale/static` e `static/static` devono restare assenti. Se ricompaiono, trattarle come errore di applicazione overlay.

## Guardrail obbligatori

- Non modificare `docs/zonaorientale/FUNZIONALITA'.md` senza richiesta esplicita.
- Non cancellare fallback locali: servono per rollback e resilienza.
- Non rinominare lo slug `fantapetillomantramanager`.
- Non migrare Firebase a `/leagues/{leagueId}/...` senza piano dedicato, backup, rules e test browser.
- Non mischiare dati, EmailJS, Firebase o brand tra le due leghe.
- Ogni overlay deve contenere solo file modificati, docs, audit e checklist manuale.

## Cosa e' stato centralizzato

- V480 registro sezioni unico.
- V481 presentation engine.
- V485 asset listoni/calciomercato condivisi con fallback locali.
- V487 CSS comuni condivisi con fallback locali.
- V489 JS classici autonomi.
- V490 adapter path dati.
- V491 moduli JS comuni sicuri.
- V496 UI components comuni.
- V497 registry card/funzionalita'.
- V498 EmailJS adapter comune, service/template restano specifici per lega.
- V499 Firebase adapter comune, senza migrazione dati.
- V500/V504 dashboard cards engine in safe-enforce.
- V505 helper renderer dashboard per pannelli admin collassabili.
- V506 validatori comuni form/tool e Sorteggio giornate su engine V506.

## V506

La V506 aggiunge:

- `static/fanta-engine/js/core/form-validators-v506.js`
- `static/fanta-engine/data/form-validators-v506.json`
- `static/fanta-engine/js/tools/matchday-draw-engine-v506.js`
- audit V506 dedicati

Il Sorteggio giornate usa ora il motore V506 e i validatori comuni V506, ma i wrapper locali `matchday-draw-tool-v473.js` mantengono fallback locale V473.

## Roadmap prossima

- V507 League template hardening: validatore config, checklist pre-go-live, controlli docs/Netlify.
- V508 Playwright hardening: mobile/desktop, report, menu, listone, calciomercato.
- V509 migrazione graduale renderer Dashboard Presidente/Admin.
- V510 report centralizzazione fanta-engine e checklist pre-merge.
- Fase futura opzionale: migrazione Firebase multi-tenant solo dopo backup/rules/test.
