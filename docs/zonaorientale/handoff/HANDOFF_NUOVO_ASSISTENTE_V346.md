# Handoff nuovo assistente - V346

## Stato corrente

La versione corrente e' V346. La release e' audit-only: classifica candidati legacy minori rimasti dopo V343-V345 e non rimuove file.

## File principali V346

- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/tools/audit-minor-legacy-v346.mjs`
- `static/zonaorientale/tools/check-zonaorientale.sh`
- `docs/zonaorientale/FUNZIONALITAV346.md`
- `docs/zonaorientale/audit/MINOR_LEGACY_CANDIDATES_V346.md`
- `docs/zonaorientale/refactor/MINOR_LEGACY_AUDIT_V346.md`
- `docs/zonaorientale/release/RELEASE_V346_MINOR_LEGACY_AUDIT.md`

## Regola importante

Non modificare `docs/zonaorientale/FUNZIONALITA'.md` senza richiesta esplicita dell'utente.

## Candidati rimasti

- `assets/js/dev/trade-notification-simulator-v254.js`
- `assets/js/trade-notification-simulator-v255.js`
- `assets/js/refactor/admin-publication-workflow-v213.js`
- `assets/css/mobile-hotfix-v166.css`
- `assets/css/mobile-hotfix-v167.css`
- `assets/css/refactor/theme-light-suspended.css`
- `assets/js/domain/competitions.js`

## Non cancellare automaticamente

Questi file sono candidati, non file gia autorizzati alla rimozione. Ogni rimozione futura deve avere una V dedicata, con test mirati e istruzioni `git rm` se necessario.

## Funzionalita da preservare

- Calciomercato completo: feed, archivi, TMW squadra, fallback immagini, card, tag giocatore, timeline modal, filtri, pannello Solo Admin.
- Listone: ricerca, ruoli, filtro Modifiche, export CSV Admin, usciti storici.
- Admin: Diagnostica dati, timestamp refresh V343, richieste presidenti, convertitore listone.
- Rose, pagina squadra, pagina giocatore, Dashboard Presidente e Fantamercato interno.
- Firebase/Auth/EmailJS, Netlify Functions, share News/WhatsApp e mobile navigation.

## Verifiche

```bash
static/zonaorientale/tools/audit-minor-legacy-v346.mjs
static/zonaorientale/tools/check-zonaorientale.sh
```

## Prossimo passo consigliato

V347: eventuale rimozione controllata del solo duplicato top-level `assets/js/trade-notification-simulator-v255.js`, senza toccare la copia attiva in `assets/js/dev/`.
