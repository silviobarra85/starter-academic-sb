# AUDIT SORTeggio giornate V473

Data: 19/06/2026

## Obiettivo
Aggiungere a ZonaOrientale e FantaPetilloMantraManager un tool pubblico per sorteggiare giornate senza alterare dati, Firebase, Admin, snapshot o funzionalita esistenti.

## Cosa controllare
- `index.html` contiene la pagina `data-page="sorteggio"` e un link `data-page-link="sorteggio"`.
- Il tool usa `assets/js/sections/matchday-draw-tool-v473.js` e `assets/css/matchday-draw-tool-v473.css`.
- Il range e limitato a 1-38 tramite slider min/max.
- Le esclusioni accettano numeri singoli e range, esempio `3, 7, 18-20`.
- Il risultato include seed e JSON per riproducibilita.
- Nessuna scrittura su Firebase e nessuna modifica a dati sportivi/listoni/rose/competizioni.

## Esito atteso audit
Da ciascuna cartella sito:

```bash
node tools/audit-matchday-draw-tool-v473.mjs
```

Output atteso: `Audit sorteggio V473 OK`.
