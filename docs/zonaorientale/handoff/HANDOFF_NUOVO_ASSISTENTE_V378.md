# Handoff nuovo assistente V378

## Stato

La V378 aggiunge il batch-06 del mapping Soccer Data verso FBref.

## Regole da preservare

- Non rimuovere funzionalita esistenti.
- Non modificare `docs/zonaorientale/FUNZIONALITA'.md` se non richiesto esplicitamente.
- Soccer Data deve mostrare solo giocatori `IN_LISTONE`.
- Gli asteriscati non devono entrare nel mapping operativo.
- Non fare scraping live dal browser verso FBref.
- Non scrivere su Firebase per Soccer Data.

## Numeri V378

- 532 giocatori attivi nel listone.
- 131 asteriscati esclusi.
- 300 mapping FBref confermati.
- 232 mapping rimanenti.

## Prossimo passo consigliato

V379 batch-07, altri 50 mapping confermati, sempre con verifica manuale e fallback `needs-review` per casi ambigui.
