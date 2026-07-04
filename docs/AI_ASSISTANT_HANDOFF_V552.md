# AI Assistant Handoff V552

## Overlay

V552 - Performance profiler + lazy render guard.

## Scopo

Migliorare la fluidita percepita di ZonaOrientale, che e piu pesante di FantaPetilloMantraManager perche contiene piu dati reali/storici.

## Modifiche principali

- Nuovo modulo comune `static/fanta-engine/js/ui/performance-profiler-lazy-render-v552.js`.
- Nuovo audit `static/fanta-engine/tools/audit-performance-optimization-v552.mjs`.
- Import/install V552 negli `app.js` di entrambe le leghe.
- Cache-buster e footer portati a V552.
- Docs e roadmap aggiornati.

## Guardrail

- Non toccare Firebase.
- Non toccare EmailJS.
- Non modificare Admin/Presidente.
- Non modificare `FUNZIONALITA'.md`.
- Non ripristinare fallback locali Listoni/Calciomercato.
- Non sostituire router o renderer locali.

## Verifica manuale

- ZonaOrientale apre senza errori console.
- FantaPetilloMantraManager apre senza errori console.
- Footer mostra V552.
- Navigazione Dashboard -> Rose -> Listone -> Calciomercato piu reattiva su ZonaOrientale.
- Listone e Calciomercato funzionano ancora dagli asset comuni.
- Console: `window.FantaEnginePerformanceOptimizationLastReportV552` esiste.

## Prossimi overlay consigliati

- V553: cache applicativa e render tabelle in blocchi, solo se V552 non basta.
- V554: modalita produzione per ridurre moduli diagnostici non necessari.
