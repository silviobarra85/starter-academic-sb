# Overlay V671 - Fix assoluto card Listone mobile

Corregge il layout mobile del Listone quando le card restavano strette per eredita della vecchia tabella `player-tables-mobile-v584`.

- forza le righe-card del Listone a uscire dalla prima colonna sticky legacy;
- rimuove runtime classi/attributi che applicavano il verde alla cella (`fpt-v584-col-player`, `data-fpt-v584-role`);
- rende la card larga quasi tutto lo schermo;
- mantiene card colorata per ruolo, box interni, filtri e Mostra altre voci;
- aggiorna footer e cache-buster sito a V671;
- non tocca ioSudo e non tocca dati.
