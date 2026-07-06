# Overlay Roadmap

## Stato corrente
- V577: Tabelle giocatori mobile override Area/Rose.

## Prossimi controlli manuali
- Da smartphone, verificare Area Squadra / pagina squadra: colori ruolo e prima colonna opaca/sticky.
- Da smartphone, verificare Rose: colonna Giocatore piu compatta rispetto a V576.
- Da smartphone, verificare Listone: stile invariato.

## V577 - Tabelle giocatori mobile override Area/Rose

- Stato: completato.
- Corregge la mancata applicazione dello stile in Area Squadra dovuta a classi legacy e regole `!important`.
- Riduce la colonna Giocatore solo per Rose e Area Squadra.
- Mantiene il Listone invariato.
- Non reintroduce il resize V570/V571.

## V576 - Tabelle giocatori mobile specificity fix

- Stato: superato da V577.
- Primo tentativo di correggere la specificita degli stili legacy.
