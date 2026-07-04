# AI Assistant Handoff V505 - Multi-lega / fanta-engine

Aggiornato al 24/06/2026. Questo documento serve al prossimo assistente AI prima di qualunque nuova patch.

## Stato attuale

La repo contiene due leghe statiche operative:

- `static/zonaorientale`
- `static/fantapetillomantramanager`

Il motore comune e' in:

- `static/fanta-engine`

La cartella accidentale `static/static` deve restare assente. La vecchia copia annidata `static/zonaorientale/static` e' stata rimossa con V495 e non deve essere ricreata.

## Cosa e' stato centralizzato

- V480: registry sezioni unico.
- V481: presentation engine comune.
- V485: asset dati listone/calciomercato centralizzati con fallback locali.
- V487: CSS comuni centralizzati con fallback locali.
- V489: JS classici/autonomi centralizzati.
- V490: data path adapter comune.
- V491: moduli JS comuni sicuri centralizzati.
- V496: UI components helpers comuni.
- V497: feature/card registry comune.
- V498: EmailJS adapter comune, con service/template ancora specifici per lega.
- V499: Firebase adapter comune, senza migrazione dati/path/rules.
- V500/V504: dashboard cards engine, da observe-first a safe-enforce.
- V501: tool engine per Sorteggio giornate.
- V502: template nuova lega.
- V503: browser smoke tests Playwright.
- V505: dashboard renderer helpers comuni; `renderAdminPanel` ora delega a `renderCollapsiblePanelV505` in entrambe le leghe.

## V505 in dettaglio

Nuovi file principali:

- `static/fanta-engine/js/ui/dashboard-renderer-helpers-v505.js`
- `static/fanta-engine/data/dashboard-renderer-helpers-v505.json`
- `static/fanta-engine/tools/audit-dashboard-renderer-helpers-v505.mjs`

La V505 sposta nel motore comune la shell HTML dei pannelli Admin collassabili. Le funzioni locali `renderAdminPanel(...)` restano negli `app.js`, ma ora delegano a `renderCollapsiblePanelV505(...)`. Questo e' volutamente graduale: form, handler, dati, Firebase, EmailJS e logiche specifiche restano locali.

## Guardrail obbligatori

- Non modificare `docs/zonaorientale/FUNZIONALITA'.md` se l'utente non lo chiede esplicitamente.
- Non cancellare fallback locali senza richiesta esplicita.
- Non ripristinare `static/zonaorientale/static`.
- Non ripristinare `static/static`.
- Non rinominare lo slug `fantapetillomantramanager`.
- Non mischiare dati, news, Firebase o EmailJS tra le due leghe.
- Non migrare Firebase a `/leagues/{leagueId}/...` senza backup, rules dedicate e test browser.
- Preservare Dashboard Presidente FantaMantraManager: nascosta quando entra Admin, strumenti Svincola/Comunicato presenti per presidente, Proposte Regolamento preservata.

## Audit correnti

Da `static`:

```bash
node fanta-engine/tools/audit-dashboard-renderer-helpers-v505.mjs
node fanta-engine/tools/audit-runtime-regression-v505.mjs
node fanta-engine/tools/audit-multileague-contamination-v505.mjs
```

## Roadmap proposta dopo V505

- V506: tool/form validators comuni.
- V507: hardening template nuova lega.
- V508: hardening Playwright smoke tests.
- V509: migrazione graduale di altri renderer Dashboard Presidente/Admin.
- V510: report centralizzazione fanta-engine e checklist pre-merge.

## Note operative per overlay

Gli overlay devono contenere solo file modificati. L'utente li applica da `~/Downloads` con `cp -R`. Ogni consegna deve includere comandi Git, audit e checklist manuale.
