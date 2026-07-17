# AI Assistant Handoff V706

## Stato

Patch solo ioSudo sopra V705, generata dal workbook `fantacalcio_serie_a_2026_27_aggiornato_2026-07-17_aggiornamento_globale_v57.xlsx`.

## Obiettivo utente

Aggiornare ioSudo con il nuovo Excel, mantenendo attenzione ai duplicati e rendendo le amichevoli cliccabili con una scheda riepilogo. La scheda deve mostrare badge per gol, minuti giocati, titolarita/subentro, autogol e infortuni gara come indicato nell'Excel.

## Implementazione

- Dataset aggiornato in `static/fanta-engine/data/sudatori/current/sudatori-data.json`.
- Manifest aggiornato a `V706`.
- Nuova app `static/fanta-engine/js/apps/iosudo-app-v706.js`.
- Nuovo CSS `static/fanta-engine/css/iosudo-app-v706.css`.
- `static/iosudo/index.html` punta a JS/CSS V706.
- `static/iosudo/sw.js` usa cache `iosudo-shell-v706`.

## Nuovi campi dati

- `friendlyPlayerStatsByMatch`: dettagli tabellino indicizzati da `matchKey`.
- `friendlyPlayerStatsByTeam`: dettagli tabellino raggruppati per squadra.
- `friendliesByTeam[*].playerStats`: tabellino allegato direttamente alla partita quando disponibile.
- `friendliesByTeam[*].statsTotals`: riepilogo giocatori/titolari/impiegati/gol/autogol/infortuni gara.
- `talksDedupedOutV706`: audit delle trattative duplicate/consolidate.
- `injuriesFilteredOutV706`: righe storiche/superate escluse dagli infortuni attivi.
- `sameNameDifferentRoleAuditV706`: omonimie/same-name con ruoli diversi non deduplicate automaticamente.

## Numeri V706

- Squadre: 20
- Giocatori: 768
- Ufficialita: 365
- Trattative: 578
- Trattative duplicate/consolidate escluse: 37
- Infortuni attivi: 16
- Amichevoli raw: 117
- Tabellini amichevoli: 1
- Righe tabellino Sassuolo-Alta Anaunia: 26

## Controlli eseguiti

```bash
node --check static/fanta-engine/js/apps/iosudo-app-v706.js
node static/fanta-engine/tools/audit-iosudo-v706.mjs
```

Audit atteso: `Audit ioSudo V706 OK`.

## Nota duplicati

Non risultano duplicati esatti in `playersByTeam` con chiave squadra + nome normalizzato + ruolo. Il caso `Genoa / Calvani` compare con ruoli diversi: non e stato eliminato per evitare falsi positivi, ma gli ID sono stati resi univoci.
