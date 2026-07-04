# AI Assistant Handoff V546

## Versione

V546 - Calciomercato central URL resolver

## Stato

Bugfix mirato dopo V543/V545. La pagina Calciomercato mostrava ancora un warning di fonti non complete perché il frontend non sempre risolveva correttamente il path centrale `fanta-engine` dopo la rimozione dei fallback locali.

## Modifiche principali

- Aggiornati gli `assets/app.js` di entrambe le leghe.
- Aggiunto resolver `getFantaEngineSharedAssetUrlCandidatesV546` basato su `import.meta.url`.
- Mantenuto alias compatibile V545.
- Aggiornato `calciomercato-feed` a `?v=546`.
- Corretto l'uso di `.map(withLeagueCacheBusterV446)` con callback esplicita.
- Aggiornati `league-config`, entrypoint HTML, docs e handoff.
- Aggiunto audit `audit-calciomercato-central-url-resolver-v546.mjs`.

## Guardrail preservati

- Nessun fallback locale Listoni/Calciomercato ripristinato.
- Asset centrali restano in `static/fanta-engine/data/shared-assets/current/`.
- Firebase invariato.
- EmailJS invariato.
- Admin e Presidente invariati.
- `FUNZIONALITA'.md` non modificato.

## Verifica richiesta

```bash
node static/fanta-engine/tools/audit-calciomercato-central-url-resolver-v546.mjs
```

Test manuale:

- ZonaOrientale: aprire Calciomercato.
- FantaPetilloMantraManager: aprire Calciomercato.
- Verificare che non compaia più il warning V545.
- Verificare che il footer mostri V546.

## Overlay previsti

0 overlay pianificati. Da qui in avanti procedere solo con bugfix mirati o nuova roadmap esplicita.
