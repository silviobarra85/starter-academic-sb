# V517 - Recovery cache-buster FantaPetilloMantraManager whole-site

## Problema

Dopo V516 ZonaOrientale risultava corretta, ma FantaPetilloMantraManager continuava a mostrare in console:

```text
league-config-v443.js?v=512:225 Uncaught ReferenceError: formValidatorsV506 is not defined
```

Questo significa che FantaPetilloMantraManager stava ancora caricando il runtime/cache-buster V512, cioe il file precedente con lo shorthand non definito `formValidatorsV506`.

## Intervento

- Riallineati gli entrypoint di entrambe le leghe a `?v=517`.
- Mantenuta la correzione `formValidatorsV506: true` in `league-config-v443.js`.
- Aggiunto alias `installPublicDataAutoloadV517` nel modulo condiviso `static/fanta-engine/js/core/public-data-autoload-v512.js`.
- Mantenuti gli alias precedenti V515/V516 e l'export originale V512.
- Aggiunto audit `static/fanta-engine/tools/audit-runtime-boot-whole-site-v517.mjs`.

## File non toccati

`docs/zonaorientale/FUNZIONALITA'.md` non e stato modificato.
