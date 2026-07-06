# Overlay roadmap

## Corrente
- V585 - Dashboard Presidente mobile compatta.

## Note operative
- Mantenere `player-tables-mobile-v584` come unico asset consolidato per le tabelle giocatori mobile.
- Non reintrodurre resize colonne V570/V571.
- Mantenere `president-teamarea-mobile-v585` come layer mobile dedicato alla Dashboard Presidente.
- Se si modifica la Dashboard Presidente, preservare: Firebase, EmailJS, Svincola Giocatori, Comunicati, Scambio e Trattative.
- Le sovrapposizioni CSS storiche da considerare restano `assets/styles.css`, `mobile-suite-v168.css`, `rosters-tables.css` e `roster-listone-table-unification-v551.css`.

## V584 - Cleanup tabelle giocatori mobile
- Consolidati gli asset mobile delle tabelle giocatori in `player-tables-mobile-v584`.
- Rimossi dal runtime gli asset sperimentali V567-V583 e resize V570/V571.
- Preservata la documentazione storica.

## V585 - Dashboard Presidente mobile compatta
- Spostate le azioni operative duplicate dalla card Dashboard Presidente al quick hub compatto.
- Quick hub ricostruito con azioni canoniche e funzionanti.
- Pannelli operativi con tasto `Apri/Riduci` a destra.
- Pannelli operativi chiusi di default.
- `Proponi svincolo` rinominato in `Proponi trattativa`.
- Aggiunto cleanup per residui resize V570/V571.
