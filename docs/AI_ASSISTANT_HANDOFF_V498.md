# AI Assistant Handoff V497 - Feature card registry e roadmap motore comune

## Stato generale

Il progetto contiene due leghe:

```text
static/zonaorientale/
static/fantapetillomantramanager/
```

e un motore comune incrementale:

```text
static/fanta-engine/
```

La regola fondamentale resta: **mai cancellare funzionalita' esistenti**, salvo richiesta esplicita dell'utente. Gli overlay devono contenere solo file modificati, aggiornare docs/handoff e includere una checklist manuale anti-regressione.

## Cosa e' gia' stato fatto

- V472-V479: isolamento FantaMantraManager, regolamento, logo, EmailJS dedicato, card presidente, proposte regolamento Firebase.
- V480: registro sezioni unificato.
- V481: presentation engine comune.
- V482: audit anti-contaminazione.
- V483: docs canoniche FantaMantraManager.
- V484-V485: inventario e centralizzazione prudente listone/calciomercato in `fanta-engine/data/shared-assets/v485/` con fallback locale.
- V486-V487: inventario e centralizzazione CSS comuni.
- V488-V491: inventario JS, JS classici comuni, data-path adapter e moduli JS comuni sicuri.
- V492-V494: audit runtime/merge/cleanup readiness.
- V495: rimozione prevista della copia annidata `static/zonaorientale/static` con `git rm -r`.
- V496: UI components comuni in `fanta-engine/js/ui/components-v496.js`.
- V497: feature/card registry comune in `fanta-engine/js/core/feature-card-registry-v497.js`.

## Cosa introduce V497

La V497 centralizza la definizione metadata-first di card e funzionalita':

```text
static/fanta-engine/js/core/feature-card-registry-v497.js
static/fanta-engine/data/feature-card-registry-v497.json
```

Il registry permette di descrivere card/funzionalita' con:

```text
id
title
category
visibility: public / authenticated / president / admin
featureKey
leagues
enabled
hiddenForAdmin
order
```

In V497 il registry e' installato in `assets/app.js` di entrambe le leghe come layer metadata-first. Non forza ancora il rendering delle dashboard: serve a preparare la V500, evitando regressioni.

## Stato FantaMantraManager da preservare

- Nome pubblico: FantaMantraManager.
- URL/cartella ancora `fantapetillomantramanager`.
- EmailJS service: `service_ttjf7js`.
- Template scambio: `template_svkkhlr`.
- Template generico svincolo: `template_e1o7z5e`.
- Destinatario: `barra.silvio@gmail.com`.
- Dashboard Presidente nascosta quando entra Admin.
- Card presidente Svincola Giocatori e Comunicato avvenuto scambio presenti per i presidenti.
- Proposte regolamento preservate nel codice/Firebase.

## Stato ZonaOrientale da preservare

- Nessun riferimento visibile a FantaMantraManager.
- Dati, news, footer, EmailJS e Firebase separati.
- `FUNZIONALITA'.md` non va modificato salvo richiesta esplicita.
- La copia annidata `static/zonaorientale/static` deve restare rimossa dopo V495.

## Roadmap prevista dopo V497

1. **V498 - EmailJS adapter comune**: centralizzare init/invio/errori/fallback mailto, lasciando service/template/recipient in config lega.
2. **V499 - Firebase adapter comune, senza migrazione dati**: helper per leagueId, seasonId, ruolo utente e collection, senza cambiare rules o dati.
3. **V500 - dashboard cards engine**: usare il feature-card registry per renderizzare/filtrare card Admin/Presidente da configurazione.
4. **V501 - tool engine comune**: centralizzare Sorteggio giornate e utility seed/export/validazione.
5. **V502 - template nuova lega**: `_league-template` e script `create-league.mjs`.
6. **V503 - test browser Playwright**: controllare console error, 404 reali, footer/menu/listone/calciomercato.

## Audit V497

Dal path `static`:

```bash
node fanta-engine/tools/audit-feature-card-registry-v497.mjs
node fanta-engine/tools/audit-runtime-regression-v497.mjs
node fanta-engine/tools/audit-multileague-contamination-v497.mjs
```


---

## Aggiornamento V498 - EmailJS adapter comune

La V498 introduce `static/fanta-engine/js/email/emailjs-adapter-v498.js` come layer condiviso per EmailJS. Il motore comune ora centralizza:

- validazione public key / service ID / template ID;
- normalizzazione parametri speciali `__service_id`, `__template_id`, `__emailjs_flow`;
- costruzione body API EmailJS;
- invio tramite endpoint EmailJS;
- fallback `mailto:`;
- factory `createEmailJsSenderV498` usata dai wrapper lega-specifici.

Restano lega-specifici e non vanno spostati nel motore:

- `static/zonaorientale/assets/emailjs.js` con `service_trz4dxe`;
- `static/fantapetillomantramanager/assets/emailjs.js` con `service_ttjf7js`, `template_svkkhlr` e `barra.silvio@gmail.com`;
- eventuali template/recipients per nuove leghe.

Gli import pubblici `sendTransferEmail()` e `isEmailJsConfigured()` sono preservati, quindi `assets/app.js` continua a funzionare senza riscrittura dei flussi operativi.

Roadmap aggiornata dopo V498:

1. V499 - Firebase adapter comune senza migrazione dati.
2. V500 - Dashboard cards engine basato sul registry V497.
3. V501 - Tool engine comune, partendo da Sorteggio giornate.
4. V502 - Template nuova lega.
5. V503 - Test browser Playwright.

Guardrail: non centralizzare `assets/firebase.js`, non cambiare rules Firestore, non cambiare Dashboard Presidente/Admin in V498.
