# Per i SUDATORI V627

Aggiornamento basato sull'Excel `fonti_articoli_v7` del 13/07/2026.

La sezione mantiene i dati V626 ma sostituisce i link generici con link puntuali agli articoli/pagine specifiche quando presenti nel foglio Excel.

## Regola fonti
Priorita link:
1. `Articolo preciso / URL fonte puntuale`
2. `URL`/`Fonte` originale solo se il campo puntuale e assente
3. nessun fallback a homepage generica nel caso sia disponibile un URL articolo.

## Audit
`node static/fanta-engine/tools/audit-sudatori-section-v627.mjs`


Nota V627: 335 occorrenze con fonte generica/homepage marcata DA VERIFICARE sono state lasciate non cliccabili per evitare link a fonti generiche al posto dell'articolo puntuale.
