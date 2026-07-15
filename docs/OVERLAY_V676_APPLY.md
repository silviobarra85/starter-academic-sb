# Overlay V676 - Listone mobile fuori dalla tabella

Questo overlay interviene solo sul sito pubblico.

## Obiettivo

Su desktop il Listone resta una tabella. Su mobile il Listone viene renderizzato in un contenitore separato `section/div`, come la pagina Rose, senza usare `tr`, `td` o `td.fpt-v584-col-player`.

## Motivazione

Le patch precedenti provavano a trasformare la tabella in card via CSS, ma le card continuavano a ereditare larghezze, sfondi e regole legacy della cella `td.fpt-v584-col-player`. V676 nasconde la tabella su mobile e costruisce una lista card separata.

## Controlli

```bash
node static/fanta-engine/tools/audit-site-mobile-cards-v676.mjs
node --check static/zonaorientale/assets/app.js
node --check static/fantapetillomantramanager/assets/app.js
```
