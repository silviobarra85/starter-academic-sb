# V576 - Tabelle giocatori mobile: fix specificità stili

## Obiettivo

Rendere effettivi gli stili mobile delle tre tabelle giocatori:

- Area Squadra / Dashboard Presidente
- Rose
- Listone

## Diagnosi

V574/V575 caricavano nuovi CSS e classi runtime, ma alcune regole storiche mobile avevano selettori più specifici e `!important`, in particolare da:

- `mobile-suite-v168.css`
- `rosters-tables.css`
- `roster-listone-table-unification-v551.css`

In più, le tabelle di Area Squadra e Rose possono avere già classi `listone-table` / `roster-listone-skin-*`, quindi il riconoscimento generico non bastava per applicare gli stili dedicati.

## Soluzione

V576 aggiunge:

- `static/fanta-engine/css/player-tables-mobile-v576.css`
- `static/fanta-engine/js/ui/player-tables-mobile-v576.js`
- `static/fanta-engine/tools/audit-player-tables-mobile-v576.mjs`

La nuova patch:

- marca le tabelle con classi dedicate V576 dopo ogni render dinamico;
- distingue Listone, Rose e Area Squadra tramite contesto DOM, non solo tramite classi già esistenti;
- applica CSS mobile con specificità più alta delle regole legacy;
- mantiene le tre famiglie separate per modifiche future indipendenti;
- preserva i link giocatore a Fantacalcio/Fantagazzetta.

## Verifica manuale

Da mobile:

1. Aprire Listone e verificare che lo stile resti invariato.
2. Aprire Rose, espandere una squadra e verificare colori ruolo e prima colonna opaca/sticky.
3. Da presidente, aprire Area Squadra / pagina squadra e verificare lo stesso stile.
4. Scorrere orizzontalmente: il testo sotto la prima colonna non deve disturbare la lettura.
