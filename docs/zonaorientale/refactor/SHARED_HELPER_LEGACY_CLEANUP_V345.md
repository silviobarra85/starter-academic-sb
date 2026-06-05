# Refactor V345 - Cleanup helper legacy condivisi

## Contesto

`assets/js/utils/shared-helpers-v294.js` era stato introdotto come primo modulo helper puro. Successivamente V295 ha introdotto `shared-helpers-v295.js` e V341 ha aggiunto `shared-helper-bridge-v341.js`, centralizzando i call-site realmente usati.

## Decisione V345

Il file V294 viene rimosso perche:

- non e' importato da `assets/app.js`;
- non e' collegato dagli HTML;
- i wrapper storici usano V295/V341;
- il check V345 verifica che non ci siano riferimenti runtime.

## Preservazione compatibilita

Non vengono rimossi o rinominati i wrapper storici in `app.js`. Questo evita regressioni su export CSV, filtri, diagnostica e Calciomercato.

## Tool introdotto

`static/zonaorientale/tools/audit-shared-helpers-v345.mjs` controlla:

- assenza di `shared-helpers-v294.js`;
- assenza di riferimenti runtime al file V294;
- presenza di `shared-helpers-v295.js`;
- presenza di `shared-helper-bridge-v341.js`;
- wiring di import e wrapper principali in `app.js`.

## Cosa non fare

- Non cancellare `shared-helpers-v295.js`.
- Non cancellare `shared-helper-bridge-v341.js`.
- Non rinominare wrapper storici senza test dedicati.
- Non modificare `FUNZIONALITA'.md` senza richiesta esplicita.
