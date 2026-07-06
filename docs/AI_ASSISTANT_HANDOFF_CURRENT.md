# AI Assistant Handoff corrente

Versione corrente: V577 - Tabelle giocatori mobile override Area/Rose
Data: 06/07/2026

## Stato

Baseline operativa con Calciomercato disattivato, Svincola Giocatori attivo su ZonaOrientale e tabelle giocatori mobile gestite dal layer V577.

## Correzione V577

- Area Squadra / pagina squadra viene riconosciuta prima delle classi legacy `listone-table`.
- Lo stile mobile viene applicato anche tramite classi runtime e fallback inline `!important`, per battere le regole legacy di `mobile-suite-v168.css` e skin storiche.
- La colonna Giocatore di Rose e Area Squadra viene ridotta rispetto alla V576.
- Listone mantiene la larghezza precedente, perché visivamente risultava corretta.

## Nota critica

Non reintrodurre il resize tabelle V570/V571. Per modifiche future usare `player-tables-mobile-v577.css` e `player-tables-mobile-v577.js`, mantenendo separati i target `teamarea`, `rose` e `listone`.
