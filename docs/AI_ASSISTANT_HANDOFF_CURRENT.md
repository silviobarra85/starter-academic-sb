# AI Assistant Handoff V658

V658 e una patch solo ioSudo sopra V656/V657. Non modifica i dati, non riattiva la sezione pubblica Per i SUDATORI e non tocca il sito.

## Obiettivo

1. Correggere il comportamento del pulsante "Mostra altre voci": dopo il click la pagina non deve tornare in alto, ma deve mantenere la posizione di scroll.
2. Allineare le card di riepilogo ai conteggi realmente mostrati dalle viste rapide.

## Correzioni

- `Giocatori` nella card ora usa lo stesso conteggio della vista globale GIOCATORI, quindi include rose Serie A + listone + rose fantasy deduplicate.
- `Amichevoli` nella card ora usa il conteggio filtrato/deduplicato delle partite effettive, lo stesso mostrato nella vista AMICHEVOLI.
- Il click su `Mostra altre voci` preserva `window.scrollY` durante il re-render progressivo.
- Cache-buster ioSudo aggiornato a V658.

## File modificati

- `static/iosudo/index.html`
- `static/iosudo/sw.js`
- `static/fanta-engine/js/apps/iosudo-app-v658.js`
- `static/fanta-engine/css/iosudo-app-v658.css`
- `static/fanta-engine/tools/audit-iosudo-v658.mjs`
- `docs/IOSUDO_APP_V658.md`
- `docs/OVERLAY_V658_APPLY.md`
- `docs/AI_ASSISTANT_HANDOFF_V658.md`
- `docs/AI_ASSISTANT_HANDOFF_CURRENT.md`
- `docs/OVERLAY_ROADMAP.md`
