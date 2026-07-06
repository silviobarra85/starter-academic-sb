# Overlay roadmap

## Corrente
- V583 - Tabelle giocatori mobile: colonne Stato/Rosa/Modifica e colori coerenti.

## Note operative
- Mantenere separati i target runtime per Area Squadra, Rose e Listone, ma usare la stessa palette/font mobile.
- Non reintrodurre resize colonne V570/V571.
- Per ulteriori ritocchi mobile, intervenire su `player-tables-mobile-v583.css` e `player-tables-mobile-v583.js` senza toccare dati, Firebase o snapshot.
- Le sovrapposizioni note da considerare sono `assets/styles.css`, `mobile-suite-v168.css`, `rosters-tables.css` e `roster-listone-table-unification-v551.css`.

## V583
- Forza font e testo bianco sulle tre tabelle giocatori mobile.
- Normalizza badge Stato, righe ruolo e prima colonna sticky/opaca.
- Area Squadra: Stato `8rem`.
- Rose: Stato `4.75rem`.
- Listone: Stato `5.25rem`, Rosa `6.25rem`, Modifica `6.25rem`.
- Evidenzia `Svincolati`/`Non presente` in ambra nella colonna Rosa del Listone.
