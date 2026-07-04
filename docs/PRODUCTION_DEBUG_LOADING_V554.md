# V554 - Production debug loading

## Obiettivo

Ridurre il peso runtime in produzione dopo gli overlay di consolidamento/performance.

I moduli nati come diagnostica o osservazione durante la migrazione non devono piu' essere caricati sempre. Restano disponibili, ma solo quando si apre il sito in modalita debug.

## Debug flag supportati

Uno qualunque di questi abilita i moduli diagnostici:

```text
?debug=1
?fantaDebug=1
sessionStorage.fantaEngineDebug=1
localStorage.fantaEngineDebug=1
```

## Moduli resi debug-only

```text
dashboard-renderer-extraction-v529.js
dashboard-summary-extraction-v531.js
quick-navigation-smoke-v532.js
dashboard-section-status-extraction-v533.js
```

## Moduli che restano sempre attivi

```text
navigation-active-singleton-v534.js
navigation-fluidity-v535.js
navigation-performance-guard-v536.js
performance-profiler-lazy-render-v552.js
application-cache-chunked-tables-v553.js
```

## Rischio regressione

Basso, perche' i moduli spostati in debug-only sono observer/report additive-only. Non sostituiscono router, renderer, Firebase, EmailJS, Admin o Presidente.

## Verifica

```bash
node static/fanta-engine/tools/audit-production-debug-loading-v554.mjs
```

## Checklist manuale

- ZonaOrientale apre senza errori console.
- FantaPetilloMantraManager apre senza errori console.
- Footer mostra V554.
- Dashboard, Rose, Listone, Calciomercato e Bilanci funzionano.
- La navigazione su ZonaOrientale non peggiora rispetto a V553.
- Aprendo con `?debug=1`, in console esiste `window.FantaEngineProductionDebugLoadingRuntimeV554.debugEnabled === true`.
