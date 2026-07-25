# Roadmap overlay

- V789 / ioSudo V779: dati Excel V166, rinnovo Vergara, Quintero, mercato aggiornato e deduplica Akarakiri.
- Prossimo listone: import in `assets/listoni`, rematching completo degli ID e badge `FUORI LISTONE` per i giocatori ancora nelle rose ma assenti dal listone corrente.


## Aggiornamento V780 / overlay V790

- Sorgente: `v167_2026-07-25_fantacalcio_serie_a_2026_27_iosudo_v780_aggiornato_1805.xlsx`, cutoff 25/07/2026 18:05 CEST.
- Header, asset applicativi, manifest e cache PWA sincronizzati a V780.
- Rumor runtime preservati: 176 righe visibili nei bucket entrata, uscita e altro.
- Pubblicato Celtic-Milan 2-2 con 23 prestazioni; totale 33 tabellini e 687 prestazioni.
- Aggiunto Gila al monitoraggio SOS; totale 57 segnalazioni attive/monitorate.
- Bennacer rimosso dalla rosa Milan; aggiunti Vladimirov e Vos come profili da tabellino.
- Controllo duplicati obbligatorio su catalogo, rose, listone e flussi informativi.

## Aggiornamento V781 / overlay V791

- Sorgente: `v168_2026-07-25_fantacalcio_serie_a_2026_27_iosudo_v781_aggiornato_1845.xlsx`, cutoff 25/07/2026 18:45 CEST.
- Header, asset applicativi, manifest e cache PWA sincronizzati a V781.
- Pubblicate 158 uscite ufficiali nelle schede delle 20 squadre di origine, incluse destinazioni estere, Serie B, U23 e svincolati.
- I giocatori ceduti sono rimossi soltanto dalla rosa attiva e restano nel catalogo storico e nella sottosezione `Mercato → UFFICIALITÀ IN USCITA`.
- Rumor e tabellini preservati: 176 trattative, 33 dettagli partita e 687 prestazioni.
- Audit bloccante su completezza delle uscite, duplicati, header e dati preservati.
