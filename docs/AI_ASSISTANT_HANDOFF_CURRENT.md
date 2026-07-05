# AI Assistant Handoff corrente

Versione corrente: V576 - Tabelle giocatori mobile specificity fix
Data: 05/07/2026

## Stato

Baseline operativa con Calciomercato disattivato, Svincola Giocatori attivo su ZonaOrientale e tabelle giocatori mobile forzate tramite layer V576.

## Nota critica

Gli stili mobile per Area Squadra, Rose e Listone devono restare separati. Le tabelle Area/Rose ereditano classi storiche del Listone e molte regole legacy usano `!important`; per modifiche future intervenire su `player-tables-mobile-v576.css` e non reintrodurre il resize V570/V571.
