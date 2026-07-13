# Overlay Roadmap

## V624 - ioSudo GIOCATORI deduplicati

- La vista GIOCATORI mostra ogni giocatore una sola volta.
- Le voci mercato di giocatori gia presenti nel dataset vengono agganciate alla scheda reale del giocatore, anche se la trattativa e registrata sotto un'altra squadra.
- Esempio guida: Muharemovic deve comparire una sola volta, come Sassuolo, con rumors/trattative collegati nel dettaglio.
- Le card mostrano nome, ruolo, squadra reale attuale, squadra fantasy, badge, ultimo aggiornamento e presenza nel listone piu recente.
- Il dettaglio giocatore mantiene le fonti/links relativi al giocatore.

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
