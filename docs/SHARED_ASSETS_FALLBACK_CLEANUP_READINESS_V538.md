# V538 - Shared assets fallback cleanup readiness

## Obiettivo

Preparare il cleanup dei fallback locali di Listoni e Calciomercato dopo la centralizzazione V522, senza cancellare file automaticamente.

Gli asset primari restano:

```text
static/fanta-engine/data/shared-assets/current/assets/listoni/
static/fanta-engine/data/shared-assets/current/assets/calciomercato/
```

Le copie locali restano presenti come fallback:

```text
static/zonaorientale/assets/listoni/
static/zonaorientale/assets/calciomercato/
static/fantapetillomantramanager/assets/listoni/
static/fantapetillomantramanager/assets/calciomercato/
```

## Manifest aggiunto

```text
static/fanta-engine/data/shared-assets/current/fallback-readiness-v538.json
```

Il manifest certifica che:

- i file centrali esistono;
- i fallback locali esistono;
- i fallback locali sono identici al centrale;
- il cleanup e' pronto solo come operazione manuale futura;
- non vengono cancellati file in V538.

## Stato rilevato

```text
Listoni centrali: 4 file
Calciomercato centrale: 26 file
Fallback locali: 60 file totali, cioe' 30 per lega
File fallback identici al centrale: 60
File differenti/mancanti/extra: 0
```

## Guardrail

- Nessuna cancellazione automatica.
- Nessuno spostamento file.
- Fallback locali preservati fino ad approvazione manuale.
- Firebase invariato.
- EmailJS invariato.
- Admin e Presidente invariati.
- `FUNZIONALITA'.md` non modificato.

## Verifica

```bash
node static/fanta-engine/tools/audit-shared-assets-fallback-readiness-v538.mjs
```

## Prossimo passo

V539 deve essere una release candidate / merge readiness. Solo dopo una RC pulita si potra' decidere se rimuovere i fallback locali duplicati in un overlay separato e approvato esplicitamente.
