# V547 - Calciomercato archive visibility

## Obiettivo

Dopo il cleanup V543 dei fallback locali, il Calciomercato deve leggere solo dagli asset centrali:

```text
static/fanta-engine/data/shared-assets/current/assets/calciomercato/
```

V546 ha risolto i warning di path centrale non raggiungibile, ma in alcuni casi gli articoli dell'archivio centrale venivano caricati e poi esclusi dai filtri data perché il range predefinito puntava alla giornata corrente, mentre l'archivio disponibile arrivava agli ultimi giorni salvati.

## Modifica

V547 aggiunge una guardia nel loader Calciomercato:

- se il range predefinito non mostra articoli;
- se l'archivio centrale ha comunque caricato giorni disponibili;
- se l'utente non ha impostato manualmente il range;

allora il range visibile viene allineato agli ultimi giorni archiviati caricati.

Esempio:

```text
range automatico corrente: oggi ultime 12 ore
archivio centrale disponibile: 2026-06-22, 2026-06-23, 2026-06-24
risultato V547: range visuale 2026-06-22T00:00 - 2026-06-24T23:59
```

## Cosa non cambia

- Nessun fallback locale viene ripristinato.
- Nessun dato viene spostato.
- Firebase non viene toccato.
- EmailJS non viene toccato.
- Admin e Presidente non vengono modificati.
- Listoni restano centralizzati in `fanta-engine`.

## Verifica

```bash
node static/fanta-engine/tools/audit-calciomercato-archive-visibility-v547.mjs
```

Poi verificare manualmente Calciomercato su entrambe le leghe.
