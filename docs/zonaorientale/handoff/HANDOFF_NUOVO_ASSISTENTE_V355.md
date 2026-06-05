# HANDOFF_NUOVO_ASSISTENTE_V355

## Stato corrente

Runtime atteso: V355.  
La V355 e una release di verifica/regressione post cleanup. Non introduce cambi funzionali e non rimuove file.

## Cosa e stato fatto

- Aggiunto audit statico `audit-regression-smoke-v355.mjs`.
- Aggiunto marker runtime `window.ZonaOrientaleRegressionSmokeSuiteV355`.
- Aggiunta checklist manuale completa.
- Aggiornati footer, cache-buster, expected version e documentazione.

## Vincoli obbligatori

- Preservare tutte le funzionalita esistenti.
- Non modificare `docs/zonaorientale/FUNZIONALITA'.md` senza richiesta esplicita.
- Ogni zip deve contenere `zonaorientale/` e `docs/`.
- Le istruzioni devono considerare che lo zip viene scaricato in Download gia decompresso.
- Ogni release deve avere `FUNZIONALITAVxxx.md`, handoff, release note e altri documenti utili.
- Ogni modifica deve aggiornare versione footer, cache-buster e `DEPLOY_EXPECTED_VERSION_V181`.

## Prima di procedere oltre

Eseguire:

```bash
static/zonaorientale/tools/audit-regression-smoke-v355.mjs
static/zonaorientale/tools/check-zonaorientale.sh
```

Poi completare:

```text
docs/zonaorientale/test/TEST_MANUALE_COMPLETO_V355.md
```

## File da non rimuovere automaticamente

- `assets/js/refactor/admin-publication-workflow-v213.js`
- `assets/css/refactor/theme-light-suspended.css`
- `assets/js/domain/competitions.js`

## Prossimo step consigliato

Dopo test manuale completo, scegliere una sola direzione:

1. piccola correzione funzionale mirata se emergono bug;
2. V356 documentale con esito test manuale;
3. eventuale cleanup mirato solo con conferma esplicita.

