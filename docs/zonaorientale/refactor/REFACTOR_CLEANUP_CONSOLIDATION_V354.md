# Refactor cleanup consolidation V354

La V354 consolida il ciclo V333-V353. Non introduce cambi funzionali e non rimuove file.

## Perche questa versione

Dopo molte versioni di refactor protetto e cleanup controllato, serve un punto stabile che dica:

- quali moduli sono ora canonici;
- quali file sono stati rimossi;
- quali file restano candidati ma non vanno ancora cancellati;
- quali test manuali fare prima di nuove modifiche.

## Moduli canonici dopo il ciclo

- `assets/js/calciomercato/calciomercato-images-v334.js`
- `assets/js/calciomercato/calciomercato-players-v340.js`
- `assets/js/calciomercato/calciomercato-render-v338.js`
- `assets/js/calciomercato/calciomercato-filters-v339.js`
- `assets/js/calciomercato/calciomercato-admin-v340.js`
- `assets/js/utils/shared-helpers-v295.js`
- `assets/js/utils/shared-helper-bridge-v341.js`
- `assets/js/dev/trade-notification-simulator-v255.js`

## File rimossi nel ciclo

- CSS refactor legacy V291/V292.
- `assets/js/calciomercato/calciomercato-players-v335.js`.
- `assets/js/calciomercato/calciomercato-players-v337.js`.
- `assets/js/utils/shared-helpers-v294.js`.
- `assets/js/trade-notification-simulator-v255.js` duplicato top-level.
- `assets/js/dev/trade-notification-simulator-v254.js`.
- `assets/css/mobile-hotfix-v166.css`.
- `assets/css/mobile-hotfix-v167.css`.

## File ancora conservati

- `assets/js/refactor/admin-publication-workflow-v213.js`.
- `assets/css/refactor/theme-light-suspended.css`.
- `assets/js/domain/competitions.js`.

## Regola per il futuro

Non procedere a rimozioni multiple nella stessa versione. Ogni rimozione futura deve avere:

1. audit dedicato;
2. documento dedicato;
3. check in `check-zonaorientale.sh`;
4. test manuale della funzionalita potenzialmente impattata;
5. zip unico con `zonaorientale/` e `docs/`.
