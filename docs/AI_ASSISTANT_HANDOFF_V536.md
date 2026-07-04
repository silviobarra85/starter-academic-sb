# AI Assistant handoff - V536

## Overlay

`overlay_v536_navigation_performance_guard_whole_site.zip`

## Contesto

L'utente ha provato la V536 precedente di ripristino navigazione nativa, ma non andava bene ed e' tornato alla V535. Ha poi notato che FantaPetilloMantraManager e' molto piu' fluido di ZonaOrientale.

La diagnosi corretta e': V535 non e' sbagliata in assoluto; su ZonaOrientale pesa di piu' perche' la lega ha molti piu' dati reali/storici. Il problema sono warm-up e refresh duplicati durante la navigazione, non il router visivo.

## Modifica principale

Aggiunto:

```text
static/fanta-engine/js/ui/navigation-performance-guard-v536.js
```

Il guard:

- mantiene `navigation-fluidity-v535.js` attivo;
- patcha `FantaEnginePublicDataAutoloadRuntimeV526` quando disponibile;
- patcha `FantaEngineNavigationDataRefreshRuntimeV511` quando disponibile;
- sopprime solo i render duplicati legati a `navigation-fluidity-v535` quando i dati sono gia' renderizzabili;
- non cambia hash, non chiama `setAppPage`, non renderizza dati direttamente.

## File runtime toccati

- `static/fanta-engine/js/ui/navigation-performance-guard-v536.js`
- `static/fanta-engine/tools/audit-navigation-performance-guard-v536.mjs`
- `static/zonaorientale/assets/app.js`
- `static/fantapetillomantramanager/assets/app.js`
- entrypoint HTML/config/static-files-service delle due leghe aggiornati a `?v=536`.

## Guardrail

- Overlay unico whole-site.
- Solo file modificati nello zip.
- Docs e handoff aggiornati.
- Nessuna modifica a Firebase/EmailJS.
- Nessuna modifica a dati, Listoni, Calciomercato o fallback locali.
- Nessuna modifica a `docs/zonaorientale/FUNZIONALITA'.md`.
- Admin e Presidente non modificati.

## Verifica

```bash
node static/fanta-engine/tools/audit-navigation-performance-guard-v536.mjs
```

## Roadmap dopo V536

Restano 3 overlay consigliati, con numerazione spostata:

- V537 Multi-season path resolver activation;
- V538 Shared assets fallback cleanup readiness;
- V539 Merge readiness / release candidate.
