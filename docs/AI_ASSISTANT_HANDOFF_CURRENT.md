# AI Assistant Handoff Current

## Stato corrente
V583 - Tabelle giocatori mobile: colonne Stato/Rosa/Modifica e colori coerenti.

## Baseline funzionale
- ZonaOrientale: Calciomercato disattivato, Svincola Giocatori attivo, logo account presidente coerente con stagione.
- FantaPetilloMantraManager: Calciomercato disattivato.
- Tabelle giocatori mobile gestite da `player-tables-mobile-v583`.

## Nota per modifiche future
Le tabelle giocatori mobile sono normalizzate da un runtime/CSS dedicato che batte gli stili legacy con `important` inline. Prima di modificare Area Squadra, Rose o Listone verificare che non vengano reintrodotti conflitti da:

- `assets/styles.css` / `body.is-mobile-ux`;
- `mobile-suite-v168.css`;
- `rosters-tables.css`;
- `roster-listone-table-unification-v551.css`;
- badge `.status`, `.status-ok`, `.status-warning`, `.status-danger`, `.status-badge`.

## Verifica prioritaria
Da mobile: Listone, Rose espansa, Area Squadra / Dashboard Presidente.
