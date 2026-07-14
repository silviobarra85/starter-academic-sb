# V644 - Aggiornamento v21 Per i SUDATORI e ioSudo

Overlay generato dal file `fantacalcio_serie_a_2026_27_aggiornato_2026-07-14_schede_squadra_ripristinate_v21(1).xlsx`.

## Dati aggiornati

- Giocatori base Sudatori: 714
- Amichevoli/eventi: 120
- Trattative/rumor aggregati: 384
- Ufficialità in entrata: 140
- Ufficialità in uscita: 152
- Ufficialità totali: 292
- Fonti tracciate: 206
- SOS/infortunati: 8
- Articoli mancanti di link puntuale: 0
- Movimento ufficiale fuori perimetro 20 squadre conservato in `officialMovesOutOfScopeV644`: 1 (Verona/Leali)

## Interventi principali

- Integrato il workbook v21 del 14/07/2026 con schede squadra ripristinate.
- Aggiornato il dataset centrale `static/fanta-engine/data/sudatori/current/sudatori-data.json`, preservando i campi tecnici già presenti per ioSudo: listone, rosa fantacalcio, dettagli giocatore, fix GIOCATORI e SOS.
- Aggiornate ufficialità, trattative, rumor Transfermarkt, ritiri/amichevoli, probabili formazioni e infortunati dalle schede cumulative dell'Excel.
- Aggiunto `friendliesMatchLogsByTeam`: resta vuoto finché non vengono compilati i tabellini delle amichevoli nelle schede squadra, ma la struttura è pronta per minuti, gol e assist.
- Corretto il disallineamento `data-iosudo-version="642"`: la shell ioSudo ora usa V644 e cache-buster V644.
- Corretto il riferimento della sezione Per i SUDATORI nelle due leghe: da `sudatori-section-v629?v=628` a `sudatori-section-v644?v=644`.

## Nota prudenziale

Non sono state rimosse informazioni storiche dal JSON: le nuove sezioni V644 si aggiungono alle precedenti e le chiavi operative vengono riallineate al workbook v21.
