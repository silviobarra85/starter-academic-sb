# Handoff nuovo assistente V376

## Stato

La V376 aggiunge il batch-04 del mapping Soccer Data verso FBref.

## Regole da preservare

- Non rimuovere funzionalita esistenti.
- Non modificare `docs/zonaorientale/FUNZIONALITA'.md` se non richiesto esplicitamente.
- Soccer Data deve mostrare solo giocatori `IN_LISTONE`.
- Gli asteriscati non devono entrare nel mapping operativo.
- Non fare scraping live dal browser verso FBref.
- Non scrivere su Firebase per Soccer Data.

## Numeri V376

- 532 giocatori attivi nel listone.
- 131 asteriscati esclusi.
- 200 mapping FBref confermati.
- 332 mapping rimanenti.

## Prossimo passo consigliato

V377 batch-05, altri 50 mapping confermati, sempre con verifica manuale e fallback `needs-review` per casi ambigui.
