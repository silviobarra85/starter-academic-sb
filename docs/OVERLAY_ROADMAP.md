# Overlay Roadmap

## Stato corrente

- Current ioSudo: V709
- Ultimo input Excel: `fantacalcio_serie_a_2026_27_aggiornato_2026-07-17_aggiornamento_globale_v63-1.xlsx`
- Focus V709: Gosens ufficiale allo Schalke, Cuenca fonte ufficiale Como, fonti Lega rafforzate, rumor individuali post-ufficialità chiusi.

## Prossimi controlli consigliati

- Continuare a verificare nuove amichevoli giocate e tabellini giocatori.
- Quando un rumor diventa ufficiale, rimuoverlo dalle trattative attive e mantenerlo solo negli audit/storico.
- Non duplicare giocatori, ufficialità o amichevoli già presenti: aggiornare fonte/stato invece di aggiungere righe parallele.

---

# Overlay Roadmap

## Stato corrente

- Current ioSudo: V708
- Ultimo input Excel: `fantacalcio_serie_a_2026_27_aggiornato_2026-07-17_aggiornamento_globale_v62.xlsx`
- Focus V708: amichevoli Roma, fonti ufficiali specifiche, anti-duplicati, conferma ufficialità prevalente sui rumor.

## Prossimi controlli consigliati

- Continuare a verificare nuove amichevoli giocate e tabellini giocatori.
- Quando un rumor diventa ufficiale, rimuoverlo dalle trattative attive e mantenerlo solo negli audit/storico.
- Non duplicare gare già presenti: aggiornare fonte, sede, orario e denominazione.

---

# Overlay roadmap

## V707

Patch solo ioSudo:

- aggiorna il dataset da Excel v61;
- applica la regola `Ufficialita` prevalente: nessun giocatore ufficiale resta nei rumor/trattative attive;
- archivia i rumor chiusi/superati in `officialTalksFilteredV707` e `transfermarktRumorsFilteredV707`;
- mantiene la deduplica conservativa su giocatori, trattative, infortuni storici/superati e ID;
- mantiene le schede amichevole cliccabili introdotte in V706;
- conserva il tabellino Sassuolo-Alta Anaunia 22-1 del 16/07/2026.

## V706

Patch solo ioSudo:

- aggiorna il dataset da Excel v57;
- mantiene deduplica conservativa su giocatori, trattative e righe storiche/superate;
- aggiunge schede amichevole cliccabili dalla vista globale `AMICHEVOLI` e dalla sottosezione squadra `Amichevoli`;
- mostra nel riepilogo amichevole i badge per minuti, titolarita/subentro, gol, autogol e infortunio gara;
- include il tabellino ufficiale Sassuolo-Alta Anaunia 22-1 del 16/07/2026.

## V705

Patch dati ioSudo precedente basata su Excel v55.

## V658

Patch solo ioSudo:

- preserva la posizione scroll dopo `Mostra altre voci`;
- allinea card `Giocatori` al conteggio della vista GIOCATORI;
- allinea card `Amichevoli` al conteggio filtrato/deduplicato della vista AMICHEVOLI;
- mantiene dati e sito invariati.


