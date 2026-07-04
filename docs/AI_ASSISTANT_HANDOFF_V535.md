# AI Assistant handoff - V535

## Overlay

`overlay_v535_navigation_fluidity_whole_site.zip`

## Motivo

L'utente ha confermato che V534 corregge il problema del vecchio pulsante attivo, ma ha segnalato che il passaggio tra pagine e' ancora lento e deve essere piu' fluido.

## Modifica principale

Aggiunto il modulo comune:

```text
static/fanta-engine/js/ui/navigation-fluidity-v535.js
```

Il modulo migliora la fluidita' percepita del cambio pagina senza sostituire il router:

- feedback nav anticipato su `pointerdown`/`click`;
- warm-up autoload dati pubblici;
- refresh dati dopo il primo paint;
- conversione temporanea dello smooth scroll in scroll istantaneo durante la navigazione;
- singleton V534 in modalita' event/frame al posto di MutationObserver ampio.

## File runtime toccati

- `static/fanta-engine/js/ui/navigation-fluidity-v535.js`
- `static/fanta-engine/tools/audit-navigation-fluidity-v535.mjs`
- `static/zonaorientale/assets/app.js`
- `static/fantapetillomantramanager/assets/app.js`
- entrypoint HTML/config/static-files-service delle due leghe aggiornati a `?v=535`.

## Guardrail

- Overlay unico whole-site.
- Solo file modificati nello zip.
- Docs e handoff aggiornati.
- Nessuna modifica a Firebase/EmailJS.
- Nessuna modifica a dati, Listoni, Calciomercato o fallback locali.
- Nessuna modifica a `docs/zonaorientale/FUNZIONALITA'.md`.
- Admin e Presidente non modificati.

## Comandi verifica

```bash
node static/fanta-engine/tools/audit-navigation-fluidity-v535.mjs
```

## Stato roadmap

V535 diventa una patch di performance/UX navigazione. Gli overlay rimanenti consigliati restano 3, con numerazione spostata:

- V536 Multi-season path resolver activation;
- V537 Shared assets fallback cleanup readiness;
- V538 Merge readiness / release candidate.
