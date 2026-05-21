# V164 - Mobile competizioni: podio e layout standardizzato

Data: 2026-05-21
Branch: feature/zonaorientale-competizioni-statiche

## Obiettivo

Rifinire la vista mobile delle singole competizioni senza modificare la vista desktop.

## Modifiche

- Per competizioni tipo Coppa Italia, Champions League e Playoff, da mobile non viene mostrata la classifica completa: viene mostrato un riquadro con `Vincitore` e `Secondo posto`.
- La tabella desktop della classifica resta disponibile da desktop.
- Nelle tabelle partite mobile la colonna `Partita` viene ridotta leggermente, lasciando piu spazio a `Data` e `Ris.`.
- In `competition.html` i contenitori di titolo, classifica/podio e partite sono standardizzati sulla stessa larghezza mobile.
- Aggiunto CSS dedicato `assets/css/mobile-hotfix-v164.css`.

## Note 404

Se DevTools mostra ancora `Failed to load resource: 404`, aprire il tab Network e verificare il nome esatto del file mancante. In V164 il nuovo asset CSS referenziato e incluso nell'overlay.
