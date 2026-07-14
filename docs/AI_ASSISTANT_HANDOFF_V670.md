# AI Assistant Handoff V670

Intervento solo sito per card mobile.

Il verde persistente era causato dalle regole legacy di `player-tables-mobile-v584.css`, in particolare da:

- `td.fpt-v584-col-player`
- `tr[data-fpt-v584-role] > *`
- `tr[data-fpt-v584-role] > *:first-child`

Queste regole avevano specificita alta e `!important`, quindi i fix precedenti non bastavano. V670 aggiunge override piu specifici su `body.player-table-mobile-v584-active table.site-mobile-card-table-v659[data-player-table-v584] tr[class*="site-mobile-card-row-v"]`.

Non tocca ioSudo, dati, rose, listoni o workflow.
