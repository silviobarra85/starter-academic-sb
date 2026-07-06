# Overlay Roadmap

## Stato corrente
- V578: Colonna Giocatore mobile dimezzata nelle tabelle giocatori.

## Prossimi controlli manuali
- Da smartphone, verificare Area Squadra / pagina squadra: colonna Giocatore più stretta, colori ruolo e prima colonna opaca/sticky.
- Da smartphone, verificare Rose: colonna Giocatore più stretta rispetto a V577.
- Da smartphone, verificare Listone: colonna Giocatore dimezzata rispetto a V577, nomi ancora leggibili con wrap.

## V578 - Colonna Giocatore mobile dimezzata

- Stato: completato.
- Mantiene lo stile mobile comune introdotto con V577.
- Dimezza la colonna Giocatore su Listone.
- Riduce ulteriormente la colonna Giocatore su Area Squadra e Rose.
- Non reintroduce il resize V570/V571.

## V577 - Tabelle giocatori mobile override Area/Rose

- Stato: superato da V578.
- Correggeva la mancata applicazione dello stile in Area Squadra dovuta a classi legacy e regole `!important`.
