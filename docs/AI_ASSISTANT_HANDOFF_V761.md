# AI Assistant Handoff V761

## Problema risolto

La home restava bloccata e la Console Chrome non eseguiva i comandi. Il thread principale era intrappolato in un loop di `MutationObserver` nel correttivo V755 accodato a `admin-card-visibility-v456.js`.

## Causa

`decorate()` assegnava sempre il testo dell'eyebrow. L'observer osservava `document.documentElement` con `childList: true, subtree: true` e richiamava direttamente `decorate`. La scrittura del testo generava una nuova mutazione e quindi una catena infinita di microtask.

## Contratto V761

- Non usare observer globali che richiamano direttamente funzioni che mutano il DOM osservato.
- Le decorazioni devono essere idempotenti.
- Preferire una classe CSS sul contenitore invece di aggiornare inline tutti i discendenti.
- Gli observer devono filtrare gli `addedNodes` e reagire solo al componente interessato.
- Non registrare sia `pointerup` sia `click` per la stessa azione senza deduplicazione.
- La copia condivisa FantaEngine e i fallback locali devono essere identici.
- Il bootstrap static-first resta V760; V761 è una release runtime correttiva sopra quel contratto.

## File principali

- `static/fanta-engine/js/shared/v489/assets/js/core/admin-card-visibility-v456.js`
- `static/fanta-engine/css/shared/v487/assets/css/refactor/admin-card-visibility-v456.css`
- `static/zonaorientale/assets/js/core/admin-card-visibility-v456.js`
- `static/zonaorientale/assets/css/refactor/admin-card-visibility-v456.css`
- `static/fantapetillomantramanager/assets/js/core/admin-card-visibility-v456.js`
- `static/fantapetillomantramanager/assets/css/refactor/admin-card-visibility-v456.css`
- `static/zonaorientale/tools/audit-admin-card-loop-v761.mjs`
- `static/zonaorientale/tools/check-live-v761.mjs`

## Verifiche obbligatorie

```bash
node --check static/zonaorientale/assets/app.js
node --check static/fanta-engine/js/shared/v489/assets/js/core/admin-card-visibility-v456.js
node static/zonaorientale/tools/audit-static-first-v760.mjs .
node static/zonaorientale/tools/audit-admin-card-loop-v761.mjs .
node static/zonaorientale/tools/check-live-v761.mjs https://silviobarra.com
```

## Diagnostica browser

```js
window.LeagueAdminCardCheckboxHardfixV761
window.ZonaOrientaleModuleEntryV760
window.ZonaOrientaleBootstrapV760
```

## Prossime priorità

1. Aggiungere un E2E browser nel CI che fallisca se il main thread non torna libero entro pochi secondi.
2. Ridurre gli script classici caricati direttamente da `index.html`.
3. Migrare i correttivi condivisi storici a moduli con lifecycle esplicito `mount/unmount`.
4. Eliminare progressivamente le copie versionate duplicate nel FantaEngine mantenendo un manifest di compatibilità.
