# AI Assistant handoff V515 - Runtime boot whole-site fix

## Obiettivo

Risolvere in modo definitivo il boot rotto del runtime su tutte le leghe pubblicate, con overlay unico applicabile una sola volta.

## Problema corretto

Chrome mostrava ancora:

```text
league-config-v443.js?v=512:225 Uncaught ReferenceError: formValidatorsV506 is not defined
```

La causa era la shorthand property `formValidatorsV506` non definita dentro `publishConfigV443()`.

## Modifica

- Sostituita la shorthand con `formValidatorsV506: true` in entrambe le leghe.
- Riallineati i cache-buster runtime a `?v=515`.
- Aggiornato `assets/league-config.json` a `currentVersion: 515`.
- Aggiornati footer e pagine standalone dove necessario.
- Aggiunto audit whole-site: `static/fanta-engine/tools/audit-runtime-boot-whole-site-v515.mjs`.

## Applicazione

Applicare solo da radice `static/` e `docs/`, non per singola lega.

```bash
cp -R ~/Downloads/overlay_v515_runtime_boot_whole_site/static/* static/
cp -R ~/Downloads/overlay_v515_runtime_boot_whole_site/docs/* docs/
```

## Verifica

```bash
node static/fanta-engine/tools/audit-runtime-boot-whole-site-v515.mjs
```

Non devono più comparire riferimenti runtime a `league-config-v443.js?v=512` né la shorthand `formValidatorsV506, leagueTemplateHardeningV507`.
