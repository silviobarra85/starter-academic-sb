# V288 - Fix rose mobile Light

## Scopo

V288 corregge un problema residuo segnalato nella pagina squadra/rose in modalita Light da smartphone: nella prima colonna sticky della tabella Rosa il nome giocatore poteva risultare nero su sfondo scuro.

## Intervento

Patch CSS finale e specifica per le tabelle:

```text
.team-profile-roster-table
.roster-sticky-table.team-profile-roster-table
.team-profile-roster-wrap table
```

La patch:

- forza testo chiaro su sfondo scuro nella prima colonna sticky;
- mantiene leggibili link e pulsanti dentro la prima colonna;
- aumenta leggermente la dimensione del nome giocatore;
- centra verticalmente il contenuto della riga;
- compatta padding e altezza delle righe rosa da mobile.

## Cosa non cambia

- Nessuna modifica a Firebase.
- Nessuna modifica a EmailJS.
- Nessuna modifica a dati JSON.
- Nessuna modifica a logiche Listone/Rose/Admin.
- Nessuna modifica a `FUNZIONALITA'.md`.

## Test consigliati

Da smartphone reale o viewport mobile, con tema Light:

```text
Pagina squadra -> tabella Rosa
Prima colonna: nome giocatore chiaro e leggibile
Prima colonna: contenuto centrato verticalmente
Righe: altezza non eccessiva
Scroll orizzontale: prima colonna resta leggibile
Listone: controllo rapido prima colonna per assenza regressioni
Tema Dark: controllo rapido per assenza regressioni evidenti
```

## Diagnostica runtime

```js
window.ZonaOrientaleRosterMobileLightV288
```
