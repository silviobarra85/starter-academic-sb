# Handoff V489 - JS classici comuni

La V489 centralizza in `static/fanta-engine/js/shared/v489/` i soli script classici e autonomi risultati identici tra le due leghe: `admin-card-visibility-v454.js`, `admin-card-visibility-v455.js` e `admin-card-visibility-v456.js`. Le pagine `index.html` caricano ora il runtime V456 dal motore comune con fallback locale tramite `data-local-fallback`; le copie locali non vengono cancellate. Restano fuori `app.js`, Firebase, EmailJS, `league-config`, section registry e tutti i moduli ES con import relativi.

## Stato

La versione corrente e' V489. La centralizzazione e' prudente: solo runtime classici, con fallback locale. Non procedere alla rimozione delle copie locali senza richiesta esplicita.

## Prossimo passo consigliato

V490: creare un adapter comune per config/data paths prima di centralizzare loader o moduli con import relativi.
