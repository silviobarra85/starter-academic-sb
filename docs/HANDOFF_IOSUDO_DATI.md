# Handoff ioSudo e dati

## Versione corrente

- ioSudo: V754.
- Overlay complessivo: V765.
- Sorgente dati mercato: Excel V140, cutoff 22/07/2026 14:30 CEST.
- Sorgente ruoli: ultimo listone disponibile, `2026-07-04.json`.
- Payload runtime: `static/fanta-engine/data/sudatori/current/sudatori-runtime.json`.
- Archivio tecnico: `static/fanta-engine/data/sudatori/current/sudatori-data.json`.

## Regola ruoli

1. Se il giocatore è associato con certezza al listone più recente, `classicRole` del listone è autorevole.
2. Il ruolo Excel/Rose è usato solo quando il giocatore non è presente o non è associabile con certezza al listone.
3. Il match listone non deve dipendere dal ruolo precedente, perché proprio il ruolo può essere errato.
4. Si usano ID Fantacalcio, nome/alias, squadra corrente e squadre collegate da ufficialità.
5. Omonimie protette e associazioni non univoche non devono essere fuse automaticamente.

## V754

- 1.035 giocatori finali.
- 612 giocatori collegati al listone con ruolo e sorgente `LISTONE`.
- 30 ruoli corretti rispetto alla V753.
- 18 righe `EXTRA_LISTONE` duplicate assorbite nella scheda principale.
- Zero associazioni ruolo ambigue applicate.
- Esempio verificato: Rowe, Bologna, ruolo `C`.

## Sorgente del nome

Ogni identità mostrata dall'app espone un badge:

- `SORGENTE: LISTONE`
- `SORGENTE: ROSA`
- `SORGENTE: TRATTATIVA`
- `SORGENTE: UFFICIALITÀ`
- `SORGENTE: SOS`
- `SORGENTE: FORMAZIONE`
- `SORGENTE: AMICHEVOLE`

Il badge ruolo P/D/C/A è sempre a sinistra del nome. Tutti i nomi dei giocatori sono renderizzati in maiuscolo. La dicitura `Listone recente` è stata rimossa dal dettaglio.

## Duplicati non risolti automaticamente

Restano distinti, in attesa di conferma utente:

- Gabriele Calvani, Genoa: una riga P e una riga D.
- Francesco Dell'Aquila, Torino: una riga C attiva e una riga A storica/cessione.
