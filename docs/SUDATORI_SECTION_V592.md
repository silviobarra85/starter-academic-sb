# V592 - Sudatori listone/mercato/formazioni

Aggiorna la sezione standalone **Per i SUDATORI**.

## Correzioni

- Usa come riferimento il listone `2026-07-04.json` con `663` giocatori.
- I parametri listone vengono incorporati anche nel JSON Sudatori, con fallback al fetch live da `shared-assets/current/assets/listoni`.
- Corretto il caso di giocatori come Meret: se presenti nel listone non devono risultare `Non nel listone`.
- La colonna `Squadra` nella tabella rosa diventa `Rosa fantacalcio`, derivata dal campo `fantasyRoster` del listone.
- Inserite informazioni da `Mercato_Giocatori` e `Probabili_Formazioni` nelle schede giocatore.

## Dati generati

- Squadre Serie A: 20
- Giocatori: 725
- Amichevoli: 84
- Note mercato: 47
- Match listone: 374
- Non abbinati al listone: 351

La sezione resta standalone e non modifica Firebase, rosterEntries, Rose ufficiali o Listone operativo.
