# Overlay Roadmap

## V625 - ioSudo click dettaglio GIOCATORI

- La vista GIOCATORI esegue il binding dei click dopo il rendering globale.
- Le card giocatore aprono sempre il dettaglio, sia per giocatori reali sia per giocatori virtuali generati dal mercato.
- Il dettaglio mantiene fonti/link, trattative, ufficialita, SOS e informazioni di listone/fantasy roster.
- Nessuna modifica ai dati Sudatori/Excel: correzione runtime dell'app.

## V623 - ioSudo GIOCATORI con voci mercato

- La vista GIOCATORI include anche giocatori presenti in trattative/ufficialita.
- Le card sono cliccabili e aprono il dettaglio.

## V622 - Sudatori/ioSudo mercato Udinese amichevoli + vista GIOCATORI

- Aggiornati Sudatori/ioSudo da Excel 13/07/2026 v5.
- Aggiunte fonti Udinese/Bwin e amichevoli Udinese da confermare.
- Aggiunte nuove trattative aggregate.
- ioSudo introduce la vista rapida GIOCATORI con badge, squadra fantasy live, ultimo aggiornamento e presenza nel listone piu recente.

## V621 - Sudatori/ioSudo mercato fonti extra v4

- Aggiornati dati Sudatori/ioSudo da Excel 13/07/2026, mantenendo live rosters e viste globali ioSudo.

## V620 - ioSudo viste rapide globali

- Sostituiti i vecchi filtri sotto la ricerca con viste globali: SQUADRE, SOS, RUMOR, UFFICIALITA, AMICHEVOLI.
- SOS, rumors e ufficialita sono ordinati in modo decrescente per data.
- Amichevoli ordinate in modo crescente per data.
- La ricerca filtra la vista rapida attiva.

## V618 - Sudatori/ioSudo live rosters

- Per i SUDATORI legge a runtime le rose fantacalcio dalla stessa fonte della sezione Rose.
- ioSudo legge a runtime le stesse rose della lega.
- Le modifiche future ai file `assets/rose` aggiornano anche Per i SUDATORI e ioSudo senza rigenerare il dataset Sudatori.
