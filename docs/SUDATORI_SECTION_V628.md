# Per i SUDATORI V628

Aggiornamento basato sull'Excel `fonti_articoli_v8` del 13/07/2026.

La sezione mantiene i dati V626 ma sostituisce i link generici con link puntuali agli articoli/pagine specifiche quando presenti nel foglio Excel.

## Regola fonti
Priorita link:
1. `Articolo preciso / URL fonte puntuale`
2. `URL`/`Fonte` originale solo se il campo puntuale e assente
3. nessun fallback a homepage generica nel caso sia disponibile un URL articolo.

## Audit
`node static/fanta-engine/tools/audit-sudatori-section-v628.mjs`


## Audit fonti V628
- Righe recupero fonti: 50
- Recuperi OK: 23
- Da verificare nel recupero: 27
- Righe ancora senza articolo preciso nel file: 43
- Occorrenze rese non cliccabili nel JSON: 256
