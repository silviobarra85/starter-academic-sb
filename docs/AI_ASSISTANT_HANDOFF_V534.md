# AI Assistant handoff - V534

## Overlay

`overlay_v534_navigation_active_singleton_whole_site.zip`

## Motivo

L'utente ha segnalato che, cliccando una sezione, la pagina cambia ma il pulsante precedente resta acceso. Lo screenshot mostra `Dashboard` ancora attiva mentre e' visibile la pagina `Sorteggio giornate`.

## Modifica principale

Aggiunto il modulo comune:

```text
static/fanta-engine/js/ui/navigation-active-singleton-v534.js
```

Il modulo normalizza le classi `.active` dei link `[data-page-link]` dopo click, hashchange, pageshow e mutazioni classe delle sezioni. Non cambia pagina e non sostituisce il router storico.

## File runtime toccati

- `static/fanta-engine/js/ui/navigation-active-singleton-v534.js`
- `static/fanta-engine/tools/audit-navigation-active-singleton-v534.mjs`
- `static/zonaorientale/assets/app.js`
- `static/fantapetillomantramanager/assets/app.js`
- entrypoint HTML e config delle due leghe aggiornati a `?v=534`.

## Guardrail

- Whole-site overlay.
- Solo file modificati nello zip.
- Nessuna modifica a Firebase/EmailJS.
- Nessuna modifica a dati, Listoni, Calciomercato o fallback locali.
- Nessuna modifica a `docs/zonaorientale/FUNZIONALITA'.md`.
- Admin e Presidente non modificati.

## Comandi verifica

```bash
node static/fanta-engine/tools/audit-navigation-active-singleton-v534.mjs
```

## Stato roadmap

V534 diventa una patch di stabilita' navigazione. Gli overlay rimanenti consigliati sono 3:

- V535 Multi-season path resolver activation;
- V536 Shared assets fallback cleanup readiness;
- V537 Merge readiness / release candidate.
