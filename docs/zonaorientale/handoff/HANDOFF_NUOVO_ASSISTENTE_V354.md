# Handoff nuovo assistente AI - V354

Versione corrente: V354.

## Stato

La V354 e un consolidamento finale del ciclo cleanup/refactor V333-V353. Non cambia comportamento utente e non rimuove file.

Runtime atteso:

```js
DEPLOY_EXPECTED_VERSION_V181 = "354"
```

Marker runtime:

```js
window.ZonaOrientaleRefactorConsolidationV354
```

Tool principale:

```bash
static/zonaorientale/tools/audit-refactor-consolidation-v354.mjs
```

## Vincoli permanenti

- Preservare tutte le funzionalita esistenti.
- Non modificare `docs/zonaorientale/FUNZIONALITA'.md` senza richiesta esplicita.
- Consegnare un solo zip con `zonaorientale/` e `docs/`.
- Quando lo zip viene applicato dall'utente, parte da Download gia decompresso.
- Aggiornare sempre footer, cache-buster, `DEPLOY_EXPECTED_VERSION_V181`, handoff e release docs.
- Per ogni rimozione futura usare `git rm` nelle istruzioni, perche `cp -R` non cancella file esistenti.

## Aree da testare prima del merge master

1. Calciomercato: feed, archivio statico, card, filtri, tag giocatore, modal timeline, Solo Admin.
2. Admin: Diagnostica dati, timestamp Aggiorna Diagnostica, Stato Firebase/JSON, preflight.
3. Listone: filtro Modifiche, export CSV, layout mobile.
4. Rose e Dashboard Presidente.
5. Fantamercato interno e notifiche trattative.
6. Simulatore console `ZonaOrientaleTradeSimulatorV255`.
7. Mobile navigation e menu Altro.
8. `competition.html` e `player.html`.

## Prossimi step consigliati

Dopo test manuale, valutare in versioni separate:

- cleanup `assets/js/domain/competitions.js`;
- cleanup `assets/css/refactor/theme-light-suspended.css`;
- cleanup `assets/js/refactor/admin-publication-workflow-v213.js`.

Non fare queste tre rimozioni insieme.
