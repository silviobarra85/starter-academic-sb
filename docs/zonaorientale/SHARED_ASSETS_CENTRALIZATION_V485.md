# V485 - Centralizzazione prudente asset listone/calciomercato

Aggiornato al **24/06/2026**.

## Scopo

La V485 copia nel motore comune i 42 asset listone/calciomercato risultati identici in V484. ZonaOrientale mantiene comunque le copie locali: non viene cancellato nulla.

Path centrale:

```text
static/fanta-engine/data/shared-assets/v485/
```

Fallback locale ZonaOrientale:

```text
static/zonaorientale/assets/listoni/
static/zonaorientale/assets/calciomercato/
```

La copia annidata `static/zonaorientale/static` resta volutamente su path locali per evitare regressioni di path relativi.

## File principali

```text
static/fanta-engine/data/shared-assets-centralization-v485.json
static/fanta-engine/tools/audit-shared-assets-centralization-v485.mjs
static/fanta-engine/tools/audit-multileague-contamination-v485.mjs
```

## Cosa non cambia

- Firebase non cambia.
- Admin non cambia.
- EmailJS non cambia.
- News, regolamento, bilanci, rose e competizioni non cambiano.
- `FUNZIONALITA'.md` non viene modificato.

## Audit

```bash
cd static
node fanta-engine/tools/audit-shared-assets-centralization-v485.mjs
node fanta-engine/tools/audit-multileague-contamination-v485.mjs
```

## Verifica manuale

- Home ZonaOrientale senza errori console.
- Footer V485.
- Listone caricato.
- Scheda giocatore aperta da Listone.
- Calciomercato/Fantamercato senza errori.
- Nessun riferimento visibile a FantaMantraManager.
