# Overlay V675 - Card Listone mobile allineate alle Rose

Overlay solo sito.

## Cosa cambia

- Non tocca ioSudo.
- Non tocca dati, rose JSON, listoni JSON o Sudatori.
- Le card mobile del Listone usano la stessa griglia e gli stessi campi base delle card Rose V668.
- Lo stato del Listone resta badge in alto a destra:
  - verde per In listone;
  - giallo per Asteriscato.
- La card Listone mantiene le classi di stile condivise con le Rose: `site-mobile-card-grid-v659`, `v662`, `v663`, `v664`, `v668`.
- Il footer/cache-buster del sito viene aggiornato a V675.

## Controlli

```bash
node static/fanta-engine/tools/audit-site-mobile-cards-v675.mjs
node --check static/zonaorientale/assets/app.js
node --check static/fantapetillomantramanager/assets/app.js
```
