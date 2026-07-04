# V519 - Public autoload export compatibility fix

## Problema

Dopo V518 il browser bloccava entrambe le leghe con:

```text
Uncaught SyntaxError: Export 'installPublicDataAutoloadV517' is not defined in module
```

Il modulo condiviso `static/fanta-engine/js/core/public-data-autoload-v512.js` esportava `installPublicDataAutoloadV517` senza avere un binding omonimo definito.

## Correzione

- Definiti esplicitamente gli alias V515, V516, V517, V518 e V519.
- Aggiornati gli `app.js` principali di ZonaOrientale e FantaPetilloMantraManager a `installPublicDataAutoloadV519`.
- Aggiornati gli `index.html` principali a `app.js?v=519`.
- Mantenuto il fix `formValidatorsV506: true`.
- Non modificato `docs/zonaorientale/FUNZIONALITA'.md`.

## Audit

Eseguire dalla root della repo:

```bash
node static/fanta-engine/tools/audit-runtime-boot-whole-site-v519.mjs
```

Esito atteso:

```text
Audit V519 superato: export public-data-autoload definiti e runtime whole-site a ?v=519.
```
