# AI Assistant Handoff - ioSudo V739

## Base corrente
- Overlay: V739
- Excel sorgente: `v111_2026-07-20_fantacalcio_serie_a_2026_27_aggiornamento_globale.xlsx`
- Timestamp header app: `2026-07-20T07:20:00+02:00` / `20/07/2026 07:20 CEST`

## Regole operative da preservare
1. Sempre controllare duplicati e ID duplicati.
2. I giocatori con ufficialità attiva non devono restare nei rumor/trattative attive.
3. Usare nome+cognome quando disponibile in lista giocatori e alias; non forzare la normalizzazione negli XI/Formazioni.
4. Non fondere globalmente Carboni, Esposito, Thuram, Ferguson.
5. Non fondere le coppie disambiguate V737/V738 né le disambiguazioni V739: Russo/Arena/Bonfanti/Rossi/Colombo.
6. Per le amichevoli: mantenere ordinamento per data, click partita -> dettaglio, click giocatore -> dettaglio giocatore con riepilogo amichevoli.

## Decisioni V739
- Duplicate confermate e consolidate: Cuenca H./H. Cuenca; Je. Rodriguez/Rodriguez Je.; Ju. Rodriguez/Rodriguez Ju.; J. Martinez/Martinez Jo.
- Non duplicati: Lorenzo Russo vs Alessandro/Flavio Russo; Alessandro Arena vs Andrea Arena; Nicholas Bonfanti vs Giovanni Bonfanti; Gianluca Rossi vs Francesco Rossi; Leonardo Colombo vs Lorenzo Colombo.
- Oulai ufficiale Fiorentina: aggiunto come `Christ Ravynel Inao Oulai`; chiuse le righe di trattativa attiva sul giocatore.

## File principali
- `static/fanta-engine/data/sudatori/current/sudatori-data.json`
- `static/fanta-engine/data/sudatori/current/manifest.json`
- `static/fanta-engine/js/apps/iosudo-app-v739.js`
- `static/fanta-engine/css/iosudo-app-v739.css`
- `static/iosudo/index.html`
- `static/iosudo/sw.js`

## Audit atteso
`node static/fanta-engine/tools/audit-iosudo-v739.mjs` deve restituire OK.
