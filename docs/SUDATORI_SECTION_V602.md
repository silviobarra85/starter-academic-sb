# Sezione Per i SUDATORI - V602

V602 e una patch UI costruita sui dati V601 del 2026-07-11.

## Cosa cambia

- la colonna **Mercato** nella tabella rosa ora mostra le segnalazioni mercato provenienti da `marketNotesByPlayer`;
- i rumor Transfermarkt sono visibili anche nella riga del giocatore, con badge `TM`;
- se il giocatore non ha segnalazioni, la colonna resta neutra con `In rosa`;
- se ci sono piu segnalazioni, vengono mostrati piu badge compatti;
- restano invariati i dati V601: rose, probabili formazioni, raduni, amichevoli, trattative squadra e infortunati.

## KPI dati mantenuti

- squadre: 20
- giocatori: 724
- amichevoli: 89
- trattative/rumors squadra: 132
- rumors Transfermarkt: 25
- infortunati/SOS: 6

## Note operative

La sezione continua a leggere i dati statici da `static/fanta-engine/data/sudatori/current/`. La patch non duplica dati e non richiede modifiche per singola lega: `zonaorientale` e `fantapetillomantramanager` puntano allo stesso motore V602.
