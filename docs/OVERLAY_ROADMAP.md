# Overlay Roadmap

## V620 - ioSudo viste rapide globali

- Sostituiti i vecchi filtri sotto la ricerca con viste globali: SQUADRE, SOS, RUMOR, UFFICIALITÀ, AMICHEVOLI.
- SOS, rumors e ufficialità sono ordinati in modo decrescente per data.
- Amichevoli ordinate in modo crescente per data.
- La ricerca filtra la vista rapida attiva.
- Dati Sudatori V619 e live rosters V618 mantenuti.

## V618 - Sudatori/ioSudo live rosters

- Per i SUDATORI legge a runtime le rose fantacalcio dalla stessa fonte della sezione Rose.
- ioSudo legge a runtime le stesse rose della lega.
- Il JSON Sudatori resta la fonte per mercato, ufficialità, rumors, infortuni, probabili XI e amichevoli.
- Le modifiche future ai file `assets/rose` aggiornano anche Per i SUDATORI e ioSudo senza rigenerare il dataset Sudatori.
- ioSudo differenzia le card squadra con pattern individuali anche per squadre con gli stessi colori.

## V617 - Sudatori/ioSudo mercato fonti extra v2

- Aggiornati i dati condivisi da Per i SUDATORI e ioSudo con il nuovo Excel.
- Aggiunte fonti extra, nuove trattative e fonti di controllo ritiri/amichevoli senza duplicare le card giocatore.

## V619 - Sudatori/ioSudo mercato fonti extra v3
- Aggiornamento dati da Excel 12/07 v3.
- Fonti/trattative extra aggregate senza duplicare card.
- Live roster runtime confermato.
