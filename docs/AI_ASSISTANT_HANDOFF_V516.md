# AI Assistant handoff V516 - Runtime boot export compatibility whole-site

## Obiettivo

Ripristinare il boot del runtime su tutte le leghe pubblicate con un overlay unico applicabile una sola volta da radice `static/` e `docs/`.

## Problema corretto

Dopo V515 Chrome mostrava:

```text
Uncaught SyntaxError: The requested module '../../fanta-engine/js/core/public-data-autoload-v512.js?v=515' does not provide an export named 'installPublicDataAutoloadV515'
```

La causa era un disallineamento fra `app.js`, che richiedeva un export rinominato V515, e il modulo condiviso `public-data-autoload-v512.js`, che esportava solo il nome storico V512.

## Modifica

- Aggiunti alias compatibili `installPublicDataAutoloadV515` e `installPublicDataAutoloadV516` nel modulo condiviso `public-data-autoload-v512.js`.
- Aggiornati gli `app.js` di ZonaOrientale e FantaPetilloMantraManager per usare `installPublicDataAutoloadV516` con cache-buster `?v=516`.
- Mantenuta la correzione `formValidatorsV506: true` in entrambe le leghe.
- Riallineati i cache-buster runtime e `currentVersion` a V516.
- Aggiunto audit whole-site: `static/fanta-engine/tools/audit-runtime-boot-whole-site-v516.mjs`.

## Applicazione

Applicare solo da radice `static/` e `docs/`, non per singola lega.

```bash
cp -R ~/Downloads/overlay_v516_runtime_boot_whole_site/static/* static/
cp -R ~/Downloads/overlay_v516_runtime_boot_whole_site/docs/* docs/
```

## Verifica

```bash
node static/fanta-engine/tools/audit-runtime-boot-whole-site-v516.mjs
```

Dopo il deploy, in Chrome devono comparire `assets/app.js?v=516` e `public-data-autoload-v512.js?v=516` su entrambe le leghe. Non deve comparire l'errore sull'export mancante `installPublicDataAutoloadV515`.
