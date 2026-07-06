# AI Assistant Handoff V577 - Tabelle giocatori mobile override Area/Rose

Data: 06/07/2026

## Obiettivo

Correggere due problemi mobile dopo V576:

1. lo stile non si applicava alla tabella rosa in Area Squadra / pagina squadra;
2. nella sezione Rose la colonna Giocatore era troppo larga.

## Causa individuata

La tabella dell'Area Squadra viene renderizzata dinamicamente come `team-profile-roster-table`, ma riceve anche classi legacy del Listone tramite V415/V168. Alcune regole storiche di `mobile-suite-v168.css` e delle skin rose/listone usano selettori specifici e `!important`, quindi la sola regola CSS non bastava sempre.

## Intervento

- Sostituito il caricamento V576 con V577.
- Nuovo CSS: `static/fanta-engine/css/player-tables-mobile-v577.css`.
- Nuovo JS: `static/fanta-engine/js/ui/player-tables-mobile-v577.js`.
- Il JS classifica la tabella Team Area prima di Listone.
- Il JS marca i target con `data-player-table-v577="teamarea|rose|listone"`.
- Il JS applica anche stili mobile inline con priorita `important` come guardrail contro gli override legacy.
- Rose e Area Squadra usano colonna Giocatore compatta.
- Listone mantiene la larghezza precedente.

## Preservato

- Link giocatore a Fantagazzetta/Fantacalcio.
- Colori ruolo P/D/C/A.
- Prima colonna sticky/opaca.
- Header sticky/opaco.
- Calciomercato disattivato.
- Svincola Giocatori attivo.
- Nessun resize V570/V571 reintrodotto.
