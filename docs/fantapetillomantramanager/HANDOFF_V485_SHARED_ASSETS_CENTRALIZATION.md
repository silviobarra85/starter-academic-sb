# Handoff V485 - Shared assets centralization

## Contesto

Il progetto multi-lega usa `static/fanta-engine` come motore comune. La V484 aveva dimostrato che 42 file di listone/calciomercato erano identici tra ZonaOrientale e FantaMantraManager. La V485 centralizza prudentemente questi file copiandoli nel motore comune, senza eliminare le copie locali.

## Modifica effettuata

Nuovo path centrale:

```text
static/fanta-engine/data/shared-assets/v485/
```

Nuovo manifest:

```text
static/fanta-engine/data/shared-assets-centralization-v485.json
```

Nuovi audit:

```text
static/fanta-engine/tools/audit-shared-assets-centralization-v485.mjs
static/fanta-engine/tools/audit-multileague-contamination-v485.mjs
```

## Runtime

Le config principali delle due leghe puntano a:

```text
../fanta-engine/data/shared-assets/v485/assets/listoni/
../fanta-engine/data/shared-assets/v485/assets/calciomercato/
```

con fallback locali:

```text
./assets/listoni/
./assets/calciomercato/
```

I fallback sono stati implementati in:

```text
static/<lega>/assets/js/data/static-files-service.js
static/<lega>/assets/app.js
```

## Guardrail

- Non cancellare copie locali listoni/calciomercato.
- Non modificare Firebase, EmailJS, Admin, Dashboard Presidente, Area Squadra.
- Non toccare `FUNZIONALITA'.md` salvo richiesta esplicita.
- La copia annidata `static/zonaorientale/static` resta su path locali.

## Test automatici

Da `static`:

```bash
node fanta-engine/tools/audit-shared-assets-centralization-v485.mjs
node fanta-engine/tools/audit-multileague-contamination-v485.mjs
```

## Test manuali

Verificare su entrambe le leghe:

- Listone caricato;
- scheda giocatore aperta da listone;
- Calciomercato senza errori 404;
- footer V485;
- nessuna contaminazione di branding tra le due leghe.

## Prossimo step consigliato

Non cancellare ancora i path locali. Prima raccogliere esito test manuali. Solo poi valutare centralizzazione HTML/CSS/JS o riduzione duplicazioni.
