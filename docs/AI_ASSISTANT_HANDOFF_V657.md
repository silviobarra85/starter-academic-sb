# AI Assistant Handoff V657

V657 è un overlay solo sito per alleggerire la navigazione mobile/desktop delle due leghe.

Punti importanti:

- Non toccare ioSudo in questa patch.
- Non riattivare la sezione pubblica Per i SUDATORI.
- Il dataset Sudatori/ioSudo resta quello già presente nel repository.
- Il runtime nuovo è `window.FantaSitePerformanceV657`.
- Il principio è active-page rendering: le sezioni pesanti non vengono ricostruite mentre l'utente naviga altrove.
- In caso di regressioni, il rollback è limitato a `index.html`, `assets/app.js`, `site-performance-v657.css` e audit/docs V657.
