# AI Assistant Handoff V496 - Progetto Fantacalcio multi-lega

## Stato attuale

Il progetto contiene due leghe statiche:

```text
static/zonaorientale/
static/fantapetillomantramanager/
```

e un motore comune incrementale:

```text
static/fanta-engine/
```

L'obiettivo dichiarato dall'utente e' costruire un motore comune che consenta di creare in futuro una nuova lega con operazioni minime. Regola fondamentale: **non cancellare funzionalita' esistenti**, a meno di richiesta esplicita dell'utente. Gli overlay devono contenere solo file effettivamente modificati e includere sempre docs/handoff e checklist di verifica manuale.

## Cose importanti da ricordare

- ZonaOrientale e FantaMantraManager devono restare separati come brand, dati, news, regolamenti, EmailJS, Firebase e dashboard specifiche.
- `FUNZIONALITA'.md` di ZonaOrientale non va modificato se non richiesto esplicitamente.
- Gli overlay vengono scaricati gia' decompressi in `/Users/admin/Downloads`.
- L'utente lavora sul branch corrente e vuole i comandi `cp -R` per applicare overlay, piu' comandi Git.
- Ogni overlay deve riportare cosa verificare manualmente per individuare regressioni.

## Lavoro fatto prima del ciclo motore comune

- V472: footer da `league-config.json` e news FantaPetillo isolate.
- V473: tool sorteggio giornate con seed riproducibile.
- V474: regolamento FantaMantraManager 2026-2027.
- V475: rename pubblico in FantaMantraManager, logo e favicon.
- V476: rimosso banner bootstrap e sbloccata Area Squadra FantaMantraManager.
- V477: dashboard presidente nascosta all'Admin e card non previste temporaneamente nascoste.
- V478: riattivate card Svincola e Comunicato Scambio con EmailJS FantaMantraManager.
- V479: proposta regole in Firebase (`ruleProposals`), preservata nel codice ma la visibilita' UI va eventualmente rifinita se l'utente lo richiede.

## Ciclo motore comune V480-V496

- V480: registro sezioni unificato in `fanta-engine/js/core/unified-section-registry-v480.js`.
- V481: presentation engine comune per metadata, branding, footer e menu mobile Altro.
- V482: audit anti-contaminazione multi-lega.
- V483: docs canoniche FantaMantraManager.
- V484: inventario asset comuni listone/calciomercato.
- V485: centralizzazione prudente listoni/calciomercato in `fanta-engine/data/shared-assets/v485/`, con fallback locale.
- V486: inventario runtime CSS/JS comuni.
- V487: centralizzazione CSS comuni, con fallback locale.
- V488: inventario dipendenze JS comuni.
- V489: centralizzazione dei soli JS classici/autonomi comuni.
- V490: data path adapter comune `fanta-engine/js/core/data-paths-v490.js`.
- V491: centralizzazione selettiva moduli JS comuni sicuri.
- V492: audit regressione runtime esteso.
- V493: merge readiness.
- V494: piano per pulizia duplicati locali, senza cancellazioni.
- V495: cleanup della copia annidata `static/zonaorientale/static`, con redirect Netlify di sicurezza. La rimozione fisica si fa con `git rm -r static/zonaorientale/static` dopo overlay V495.
- V496: primo UI components engine comune in `fanta-engine/js/ui/components-v496.js`, usato dal presentation engine.

## Stato V496

La V496 aggiunge un modulo UI comune e generico, senza riferimenti hardcoded a una lega:

```text
static/fanta-engine/js/ui/components-v496.js
```

Il modulo espone helper per:

- query DOM sicure;
- set testo/HTML su selector;
- meta/canonical;
- template formatting;
- normalizzazione icone;
- hash/href resolution;
- visibilita' elementi;
- toast comuni;
- installazione `window.FantaEngineUIV496`.

Il presentation engine (`league-presentation-v481.js`) importa e usa questi helper, ma mantiene le API storiche V481/V445 per non rompere i loader esistenti.

## Roadmap consigliata dopo V496

1. **V497 - registry unico card/funzionalita'**: centralizzare definizione card dashboard/admin/presidente per decidere visibilita' via config.
2. **V498 - EmailJS adapter comune**: centralizzare init/invio/errori, lasciando service/template/recipient per lega in config.
3. **V499 - Firebase adapter comune senza migrazione dati**: unificare accesso a leagueId, seasonId, ruolo utente, collection e query.
4. **V500 - dashboard cards engine**: rendering comune dashboard Admin/Presidente guidato da feature registry.
5. **V501 - tool engine comune**: spostare tool Sorteggio e utility form/seed/export JSON nel motore centrale.
6. **V502 - template nuova lega**: creare `_league-template` e script `create-league.mjs`.
7. **V503 - test browser Playwright**: aprire pagine reali e intercettare console error/404.

## Cose da non fare senza consenso esplicito

- Non cancellare fallback locali ancora usati per rollback.
- Non migrare Firebase a `/leagues/{leagueId}/...` senza piano dati e rules.
- Non centralizzare `app.js` intero.
- Non modificare `FUNZIONALITA'.md` senza richiesta esplicita.
- Non mischiare news/regolamenti/EmailJS tra le due leghe.

## Audit principali

Dal path `static`:

```bash
node fanta-engine/tools/audit-ui-components-v496.mjs
node fanta-engine/tools/audit-runtime-regression-v496.mjs
node fanta-engine/tools/audit-multileague-contamination-v496.mjs
```

## Verifica manuale minima

Su entrambe le leghe aprire home, competition e player; verificare footer V496, menu mobile, Listone, Calciomercato, assenza errori console e assenza riferimenti incrociati tra le leghe. Su FantaMantraManager verificare anche Admin/Presidente, EmailJS card e Dashboard Presidente nascosta quando entra Admin.


## Aggiornamento successivo V497

Aggiunto `static/fanta-engine/js/core/feature-card-registry-v497.js` come registry metadata-first per card/funzionalita'. Vedi `docs/AI_ASSISTANT_HANDOFF_V497.md`.
