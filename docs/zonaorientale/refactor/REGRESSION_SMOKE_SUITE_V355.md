# REGRESSION_SMOKE_SUITE_V355

## Obiettivo

La V355 aggiunge una suite di controllo post-refactor. Non cambia comportamento utente e non rimuove file.

## File aggiunto

```bash
static/zonaorientale/tools/audit-regression-smoke-v355.mjs
```

## Marker runtime

```js
window.ZonaOrientaleRegressionSmokeSuiteV355
```

Il marker espone:

- versione V355;
- aree manuali da testare;
- controlli statici attesi;
- `runSmokeTest()`.

## Perche serve

Dopo il ciclo V333-V354 sono stati spostati moduli, rimossi file legacy e aggiunti wrapper di compatibilita. Prima di continuare con refactor o rimozioni, e necessario avere un punto di verifica stabile.

## Regole per il prossimo assistente

- Non cancellare file solo perche segnalati come legacy.
- Non modificare `docs/zonaorientale/FUNZIONALITA'.md` senza richiesta esplicita.
- Ogni nuova release deve aggiornare footer, cache-buster, `DEPLOY_EXPECTED_VERSION_V181`, changelog, handoff e `FUNZIONALITAVxxx.md`.
- Ogni modifica deve dichiarare le funzionalita a rischio e come vengono preservate.
- Prima di riprendere cleanup, completare `docs/zonaorientale/test/TEST_MANUALE_COMPLETO_V355.md`.

