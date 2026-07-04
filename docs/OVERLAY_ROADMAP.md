# Overlay roadmap

## Stato corrente

V560 - Boot preloader interactive-ready completato.

## Ultima decisione

La V559 ha introdotto il preloader multi-lega, ma poteva chiudersi quando i tasti non erano ancora pronti. La V560 sposta la chiusura su un readiness piu' tardivo: render app, `window.load`, controlli DOM essenziali e quiet frame del main thread. Ruota solo l'anello della rotellina, non il numero.

## Overlay previsti

0 overlay previsti.

Da qui procedere solo con bugfix mirati o nuova roadmap esplicita.

## Guardrail permanenti

- Overlay unico whole-site.
- Solo file modificati.
- Aggiornare docs e handoff a ogni overlay.
- Non modificare FUNZIONALITA'.md senza richiesta esplicita.
- Preservare Firebase, EmailJS, Admin, Presidente.
- Preservare asset condivisi Listoni/Calciomercato in fanta-engine.
- Non reintrodurre i layer runtime pesanti rimossi/disattivati in V558 senza prova misurata.

## V561 - Calciomercato disattivato e feed articoli bloccato

Stato: completato.

- Rimossa la sezione Calciomercato dalle due leghe.
- Bloccato il recupero articoli live/statico e resa no-op la Netlify Function `calciomercato-feed`.
- Preservati News/comunicati interni, Admin, Presidente, Listone, Rose, Fantamercato e preloader V560.
- Audit: `node static/fanta-engine/tools/audit-calciomercato-disabled-v561.mjs`.

