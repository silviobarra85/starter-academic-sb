# AI Assistant Handoff - Current

Versione corrente: V593.

V593 aggiorna la sezione standalone **Per i SUDATORI** con:
- campetto grafico della probabile formazione sotto la rosa selezionata;
- matching listone più robusto tra nomi Serie A e ultimo listone `2026-07-04.json`;
- correzione casi con suffissi/iniziali, ad esempio `Milinkovic-Savic` ↔ `Milinkovic-Savic V.`;
- conferma che la colonna `Rosa fantacalcio` deriva dal listone/fantasyRoster, non dalla squadra Serie A.

La sezione resta standalone: non scrive su Firebase, non modifica `rosterEntries`, non modifica Rose ufficiali, non modifica Listone operativo.

Guardrail correnti:
- Calciomercato resta disattivato.
- Svincola Giocatori ZonaOrientale resta attivo.
- Rose GitHub sono fonte primaria da V588.
- Listone/Rosa fantacalcio è centralizzato in `fanta-engine` da V590.
- Tabelle giocatori mobile consolidate in V584.
- La sezione Sudatori si rimuove eliminando CSS/JS/dati dedicati e i riferimenti HTML.
