# V514 - Runtime boot whole-site fix

## Problema

FantaMantraManager caricava ancora `league-config-v443.js?v=512` e quindi manteneva il runtime con `ReferenceError: formValidatorsV506 is not defined`.

## Correzione

- Overlay unico con radici `static/` e `docs/`, applicabile una sola volta a tutto il sito.
- Correzione applicata a entrambe le leghe pubbliche: `zonaorientale` e `fantapetillomantramanager`.
- `formValidatorsV506` convertito da shorthand non definito a flag esplicito `formValidatorsV506: true`.
- Cache-buster/entrypoint runtime riallineati a `?v=514` nei file modificati.
- `assets/league-config.json` portato a `currentVersion: 514` per entrambe le leghe.

## File statici modificati

Per ogni lega:

- `index.html`
- `competition.html`
- `player.html`
- `assets/app.js`
- `assets/league-config.json`
- `assets/js/core/league-config-v443.js`
- `assets/js/core/ui.js`
- `assets/js/data/static-files-service.js`
- `assets/js/sections/bilanci-snapshot-section-v435.js`
- `tools/audit-runtime-boot-whole-site-v514.mjs`

Solo per FantaMantraManager sono stati aggiornati anche `bilanci.html` e `news.html` per i cache-buster favicon ancora a V512.

## Verifica manuale

1. Aprire `/fantapetillomantramanager/` e verificare in console che non compaia `formValidatorsV506 is not defined`.
2. In Network controllare che `league-config-v443.js` venga caricato con `?v=514`.
3. Ripetere su `/zonaorientale/`.
4. Verificare cambio sezione da home a rose/coppe/listone/bilanci.
5. Verificare footer V514.

## Funzionalita preservate

La patch non rimuove funzioni, dati, Firebase, EmailJS, pagine standalone o asset condivisi. Cambia solo boot/runtime config, cache-buster e documentazione correlata.
