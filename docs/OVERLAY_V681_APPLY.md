# Overlay V681 - Listone mobile badge modifica

Overlay solo sito.

- Riparte dalla logica stabile V676/V680 del Listone mobile fuori dalla tabella.
- Corregge il badge `Modifica` in basso a destra evitando le regole legacy V664/V680 che lo riducevano a un pallino.
- Il badge mostra:
  - `INVARIATO` se non risultano variazioni rispetto al listone precedente;
  - `NUOVO` se il giocatore non era presente nel listone precedente;
  - i nomi delle box cambiate, separati da trattino, ad esempio `QT.A - SQUADRA`.
- Mantiene desktop invariato.
- Non modifica ioSudo, dati, rose JSON o listoni JSON.
