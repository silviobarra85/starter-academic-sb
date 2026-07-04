# AI Assistant Handoff V504 - Dashboard cards safe-enforce

## Stato corrente

Il branch multi-lega contiene due siti statici di produzione:

- `static/zonaorientale`
- `static/fantapetillomantramanager`

Il motore comune e' in `static/fanta-engine`. La cartella annidata `static/zonaorientale/static` e la cartella accidentale `static/static` devono restare assenti.

## Fatto fino a V504

- V480: registry sezioni comune.
- V481: presentation engine comune.
- V482: audit anti-contaminazione multi-lega.
- V483: consolidamento docs FantaMantraManager.
- V484-V485: inventario e centralizzazione prudente dati comuni listone/calciomercato, con fallback locali.
- V486-V491: inventario e centralizzazione selettiva CSS/JS comuni.
- V492-V493: audit regressione runtime e merge readiness.
- V494: piano cleanup duplicati locali, senza cancellazioni automatiche.
- V495: dismissione `static/zonaorientale/static` con `git rm` esplicito e redirect di sicurezza Netlify.
- V496: UI components comuni.
- V497: feature/card registry metadata-first.
- V498: EmailJS adapter comune, service/template restano per lega.
- V499: Firebase adapter comune, senza migrazione dati/rules/path.
- V500: dashboard cards engine observe-first.
- V501: tool engine comune per Sorteggio giornate.
- V502: template nuova lega + `create-league-v502.mjs`.
- V503: browser smoke tests Playwright.
- V504: dashboard cards engine `safe-enforce` opzionale.

## Cosa cambia in V504

V504 aggiunge `static/fanta-engine/js/ui/dashboard-cards-engine-v504.js` e il manifest `static/fanta-engine/data/dashboard-engine-enforce-v504.json`.

Il motore V504 usa il registry V497 per applicare `hidden` e `aria-hidden` alle card dashboard role-gated, in modo prudente:

- non forza card pubbliche;
- non cancella DOM;
- non migra renderer locali;
- mantiene alias runtime `FantaEngineDashboardCardsRuntimeV500` per diagnostica legacy;
- non tocca Firebase, EmailJS, Firestore rules o dati.

Le due app importano V504, ma le funzionalita' concrete restano nei rispettivi `assets/app.js`.

## Guardrail obbligatori

- Non modificare `docs/zonaorientale/FUNZIONALITA'.md` senza richiesta esplicita.
- Non ripristinare `static/zonaorientale/static`.
- Non ripristinare `static/static`.
- Non cancellare fallback locali senza richiesta esplicita.
- Non centralizzare `assets/app.js` intero.
- Non migrare Firebase a `/leagues/{leagueId}/...` senza backup, rules dedicate e test browser.
- FantaMantraManager deve restare su path `fantapetillomantramanager` anche se il brand e' FantaMantraManager.
- ZonaOrientale e FantaMantraManager non devono contaminarsi in brand, news, EmailJS, Firebase o regolamenti.

## Prossimi overlay previsti

1. V505 - Migrazione graduale renderer dashboard: spostare un renderer comune alla volta fuori dagli app.js locali.
2. V506 - Tool/form validators comuni: date, range, squadre, competizioni, input numerici.
3. V507 - League template hardening: validator config, checklist pre-go-live, controlli Netlify/docs.
4. V508 - Playwright hardening: suite mobile/desktop, report, controlli su menu/listone/calciomercato.
5. Fase futura opzionale: migrazione Firebase a path league-scoped solo dopo backup e rules.

## Audit V504

Da `static`:

```bash
node fanta-engine/tools/audit-dashboard-engine-enforce-v504.mjs
node fanta-engine/tools/audit-runtime-regression-v504.mjs
node fanta-engine/tools/audit-multileague-contamination-v504.mjs
```
