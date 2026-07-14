# Overlay Roadmap

## Stato corrente

- V647: sezione pubblica Per i SUDATORI disattivata nel sito, dati mantenuti per ioSudo.
- V648: correzione vista giocatori dentro schede squadra e date seriali Excel.
- V649: aggiornamento dati ioSudo da Excel V23, filtro amichevoli effettive, prime ottimizzazioni navigazione.
- V650: ottimizzazione performance generale ioSudo senza cambio dati.
- V651: ottimizzazione mirata delle liste pesanti `GIOCATORI`, `RUMOR` e `UFFICIALITA`.
- V652: ottimizzazione apertura dettaglio giocatore con cache e matching mercato diretto.

## Prossimo step se necessario

Se la PWA resta lenta su smartphone datati:

1. separazione dei dataset per sezione;
2. indice precompilato lato build per giocatori/mercato;
3. virtualizzazione reale viewport-only;
4. compressione JSON e riduzione campi duplicati lato app.
