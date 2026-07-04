# AI assistant handoff V524

Overlay: V524 - Configuratore guidato nuova lega.

## Stato

Baseline precedente: V523 stabile su navigazione Listone/Calciomercato.
V524 aggiunge il wizard `static/fanta-engine/tools/create-league-wizard-v524.mjs` e l'audit `static/fanta-engine/tools/audit-league-configurator-v524.mjs`.

## Guardrail

- Overlay whole-site.
- Solo file modificati.
- Non modificare `docs/zonaorientale/FUNZIONALITA'.md` senza richiesta esplicita.
- Non creare nuove leghe automaticamente.
- Non modificare Firebase, EmailJS o Netlify automaticamente.
- Listoni e Calciomercato devono rimanere primari su `fanta-engine/data/shared-assets/current`.

## Prossimo passo

V525 - Adapter dati multi-season.
