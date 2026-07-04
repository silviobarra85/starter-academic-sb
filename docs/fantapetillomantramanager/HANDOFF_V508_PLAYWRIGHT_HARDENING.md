# Handoff V508 - Playwright hardening

La V508 aggiunge il test browser Playwright rafforzato per controllare anche la lega `fantapetillomantramanager`.

## Cosa cambia

- Nuovo script comune `static/fanta-engine/tools/playwright-smoke-v508.mjs`.
- Manifest `static/fanta-engine/data/playwright-hardening-v508.json`.
- Audit statico `audit-playwright-hardening-v508.mjs`.
- Footer/cache-buster/config aggiornati a V508.

## Cosa non cambia

- Nessuna modifica a Firebase, EmailJS, dati, Admin, Presidente, news, regolamenti, bilanci, listoni o calciomercato.
- Nessuna modifica a `docs/zonaorientale/FUNZIONALITA'.md`.
- Nessun ripristino delle cartelle accidentali `static/static` o `static/zonaorientale/static`.

## Verifiche

Eseguire audit statici e, quando Playwright e' installato localmente, il test browser V508 su server locale o branch deploy.
