# Handoff nuovo assistente - V356

## Stato

Il sito e a V356. La V356 aggiunge un tracker console per QA manuale post-refactor. Non rimuove file e non cambia funzionalita utente.

## Vincoli obbligatori

- Preservare tutte le funzionalita esistenti.
- Non modificare `docs/zonaorientale/FUNZIONALITA'.md` salvo richiesta esplicita.
- Consegnare zip con radici `zonaorientale/` e `docs/`.
- Aggiornare sempre footer, cache-buster e `DEPLOY_EXPECTED_VERSION_V181`.
- Ogni nuova versione deve avere handoff, FUNZIONALITAVxxx.md e documenti utili in `docs/zonaorientale`.

## Novita V356

Marker runtime:

```js
window.ZonaOrientaleManualQaTrackerV356
```

Comandi principali:

```js
ZonaOrientaleManualQaTrackerV356.print()
ZonaOrientaleManualQaTrackerV356.mark('mobile-nav', 'ok', 'testato da smartphone')
ZonaOrientaleManualQaTrackerV356.summary()
ZonaOrientaleManualQaTrackerV356.exportMarkdown()
ZonaOrientaleManualQaTrackerV356.reset()
```

## Prossimo passo consigliato

Eseguire una sessione di test manuale reale usando il tracker V356. Solo dopo valutare nuove rimozioni, in particolare `admin-publication-workflow-v213.js`, `theme-light-suspended.css` o `domain/competitions.js`.
