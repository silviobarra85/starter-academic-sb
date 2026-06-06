# Handoff nuovo assistente V382

Stato corrente: V382 Soccer Data FBref batch-10.

## Stato mapping

- Listone attivo: `2026-06-04`.
- Solo `statusCode: IN_LISTONE`.
- Giocatori attivi: 532.
- Asteriscati esclusi: 131.
- Mapping confermati: 500.
- Mapping rimanenti: 32.
- Ultimo batch completato: `batch-10`.

## Regole operative

- Non modificare `docs/zonaorientale/FUNZIONALITA'.md` salvo richiesta esplicita.
- Non fare scraping live dal browser verso FBref.
- Non scrivere su Firebase per Soccer Data.
- Ogni nuovo mapping deve essere verificato e motivato in `notes` quando ambiguo.
- Preservare tutte le funzionalita esistenti del sito.

## Prossimo passo

V383: batch finale `batch-11`, 32 mapping rimanenti. Diversi sono portieri/giovani con profili meno completi: meglio completare solo quelli solidi e lasciare eventuali casi dubbi come `needs-review`.
