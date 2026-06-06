# Handoff nuovo assistente V375

Stato corrente: V375.

La sezione Soccer Data e read-only e continua a mostrare solo giocatori `IN_LISTONE` del listone 2026-06-04.

Mapping confermati:

- V373 batch-01: 50
- V374 batch-02: 50
- V375 batch-03: 50
- Totale confermato: 150
- Residui: 382

Vincoli da mantenere:

- Non modificare `docs/zonaorientale/FUNZIONALITA'.md` salvo richiesta esplicita.
- Non aggiungere scraping live da browser verso FBref.
- Non scrivere su Firebase per Soccer Data.
- Non includere asteriscati/non-`IN_LISTONE`.
- Ogni batch successivo deve essere verificabile con audit dedicato.
