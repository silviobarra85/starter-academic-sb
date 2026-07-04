# AI Assistant Handoff V503 - Browser smoke tests Playwright

## Stato corrente

Il progetto contiene due leghe attive e un motore comune progressivamente centralizzato:

- `static/zonaorientale` per ZonaOrientale Salerno;
- `static/fantapetillomantramanager` per FantaMantraManager;
- `static/fanta-engine` come motore comune;
- `static/_league-template` come base controllata per nuove leghe.

Restano assenti e non devono ricomparire:

- `static/zonaorientale/static`;
- `static/static`.

## Fatto fino a V503

- V480: registry sezioni comune.
- V481: presentation engine comune.
- V482-V483: audit anti-contaminazione e docs consolidate.
- V484-V485: asset comuni listoni/calciomercato copiati nel motore con fallback locali.
- V486-V491: inventari e centralizzazione prudente CSS/JS sicuri.
- V492-V493: audit runtime e merge readiness.
- V494: piano pulizia duplicati locali.
- V495: rimozione copia annidata `static/zonaorientale/static`.
- V496: UI components engine comune.
- V497: feature/card registry comune.
- V498: EmailJS adapter comune.
- V499: Firebase adapter comune senza migrazione dati.
- V500: dashboard cards engine observe-first.
- V501: tool engine comune per Sorteggio giornate.
- V502: template nuova lega.
- V503: browser smoke tests Playwright.

## Cosa aggiunge V503

V503 aggiunge test browser reali ma non cambia le funzionalita runtime delle leghe. I nuovi file principali sono:

- `static/fanta-engine/tools/playwright-smoke-v503.mjs`;
- `static/fanta-engine/tools/audit-browser-smoke-tests-v503.mjs`;
- `static/fanta-engine/data/browser-smoke-tests-v503.json`.

Lo smoke test apre le pagine pubbliche principali, verifica errori console, request fallite, HTTP >= 400, titolo pagina, brand e footer V503. Non fa login, non invia EmailJS e non scrive Firebase.

## Comandi V503

Audit statici:

```bash
cd static
node fanta-engine/tools/audit-browser-smoke-tests-v503.mjs
node fanta-engine/tools/audit-runtime-regression-v503.mjs
node fanta-engine/tools/audit-multileague-contamination-v503.mjs
```

Smoke browser con server locale avviato dalla cartella parent come da workflow utente:

```bash
FANTA_BASE_URL=http://127.0.0.1:1313 FANTA_SITE_PREFIX=/starter-academic-sb/static node static/fanta-engine/tools/playwright-smoke-v503.mjs
```

Se si serve direttamente la cartella `static`, usare:

```bash
FANTA_BASE_URL=http://127.0.0.1:1313 node static/fanta-engine/tools/playwright-smoke-v503.mjs
```

## Guardrail obbligatori

- Non modificare `docs/zonaorientale/FUNZIONALITA'.md` salvo richiesta esplicita.
- Non rinominare lo slug `fantapetillomantramanager`.
- Non migrare Firebase a `/leagues/{leagueId}/...` senza backup/rules/test.
- Non cancellare fallback locali centralizzati senza patch dedicata.
- Non trasformare V503 in test con credenziali o write reali.

## Roadmap dopo V503

1. V504 - Dashboard engine enforce opzionale, solo dopo test browser verdi.
2. V505 - Migrazione graduale renderer dashboard comuni.
3. V506 - Validator comuni per form/tool.
4. V507 - League template hardening.
5. Fase futura - eventuale modello Firebase multi-lega con path `/leagues/{leagueId}/...`.
