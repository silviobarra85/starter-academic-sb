# Handoff V485 - Shared assets centralization ZonaOrientale

La V485 introduce una centralizzazione prudente degli asset comuni listone/calciomercato nel motore `static/fanta-engine`, mantenendo le copie locali di ZonaOrientale come fallback.

## File chiave

```text
static/fanta-engine/data/shared-assets/v485/
static/fanta-engine/data/shared-assets-centralization-v485.json
static/fanta-engine/tools/audit-shared-assets-centralization-v485.mjs
static/fanta-engine/tools/audit-multileague-contamination-v485.mjs
```

## Guardrail

- Non cancellare `static/zonaorientale/assets/listoni`.
- Non cancellare `static/zonaorientale/assets/calciomercato`.
- Non modificare `docs/zonaorientale/FUNZIONALITA'.md` senza richiesta esplicita.
- La copia annidata `static/zonaorientale/static` resta locale.

## Verifica

Da `static`:

```bash
node fanta-engine/tools/audit-shared-assets-centralization-v485.mjs
node fanta-engine/tools/audit-multileague-contamination-v485.mjs
```

Poi test manuale Listone, Player, Calciomercato e footer V485.
