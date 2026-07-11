# Sezione Per i SUDATORI - V601

V601 aggiorna la sezione sulla base del file Excel del 2026-07-11.

## Cosa cambia

- raduni, ritiri e amichevoli rigenerati dal foglio `Ritiri_Amichevoli`;
- card squadra aggiornate con luogo/date ritiro e nuovo conteggio amichevoli;
- card `Trattative in corso` aggiornata dal foglio `Trattative_Squadre_11_07`;
- rumors Transfermarkt inseriti nel blocco trattative squadra, con data rumor e probabilita utenti quando disponibili;
- mantenute le correzioni UI V598/V600: sinistra/destra del campetto, badge fisico solo su segnalazione, niente badge `Probabile XI` nella colonna Mercato;
- infortunati SOS Fanta mantenuti.

## KPI V601

- squadre: 20
- giocatori: 724
- amichevoli: 89
- trattative/rumors squadra: 132
- rumors Transfermarkt: 25
- infortunati/SOS: 6

## Note operative

La sezione continua a leggere i dati statici da `static/fanta-engine/data/sudatori/current/`. Le informazioni non sono duplicate per lega: sia `zonaorientale` sia `fantapetillomantramanager` usano lo stesso motore e lo stesso JSON corrente.
