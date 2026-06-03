# V286 - Fix prima colonna mobile Light

## Obiettivo

Correggere il problema segnalato in modalita Light da smartphone: nella prima colonna sticky del Listone e delle tabelle rose il nome del giocatore poteva apparire nero su sfondo scuro, rendendo la cella illeggibile.

## Causa probabile

Le patch mobile precedenti rafforzavano lo sfondo della prima colonna sticky con un colore scuro, ma alcune regole Light successive riportavano il colore del testo delle celle a `#0f172a`. Il risultato poteva essere testo scuro su sfondo scuro, soprattutto quando la tabella era in modalita tabellare mobile con prima colonna sticky.

## Intervento

Aggiunta una patch CSS finale e piu specifica per:

- `table.listone-table`;
- `table.free-agents-table`;
- `table.roster-season-table`;
- `table.roster-player-table`;
- `table.roster-main-table`;
- `table.roster-dialog-players-table`;
- wrapper listone e rose in modalita mobile.

La patch forza:

- sfondo scuro coerente sulla prima colonna sticky;
- testo bianco/chiaro su tutti i discendenti della prima cella;
- link e bottoni nome giocatore con colore chiaro e peso alto;
- intestazione della prima colonna con sfondo ancora piu scuro e testo chiaro.

## Ambito

Intervento solo CSS/UI.

Non modifica:

- Firebase;
- EmailJS;
- dati JSON;
- logiche Listone;
- logiche rose;
- `FUNZIONALITA'.md`.

## Test manuali consigliati

Attivare tema Light e verificare da smartphone reale o viewport mobile:

- Listone: prima colonna con nome giocatore leggibile durante scroll orizzontale;
- Listone: filtro `Modifiche`, `Mostra usciti storici` ed export CSV ancora funzionanti;
- Rose pubbliche: nomi giocatori leggibili nella prima colonna;
- Dashboard Presidente: tabelle rosa leggibili se disponibili;
- Dialog rosa/squadra: nomi giocatori leggibili nella prima colonna;
- Tema Dark: nessuna regressione evidente.

## Diagnostica runtime

```js
window.ZonaOrientaleStickyColumnContrastV286
```
