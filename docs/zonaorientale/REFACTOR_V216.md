# V216 - Classifica campionato completa

## Obiettivo

Uniformare la classifica delle competizioni di campionato/classifica al formato completo richiesto dalla Lega:

```text
POS, SQUADRA, PUNTI, PG, V, N, P, GF, GS, DR, FPT
```

## Modifica tecnica

### Admin risultati competizione

`assets/js/admin/admin-competitions.js` ora renderizza una tabella risultati completa per le competizioni a classifica, con input numerici per tutte le statistiche.

### Salvataggio

`assets/app.js` legge i nuovi input e salva in Firebase i campi:

- `points`
- `played`
- `wins`
- `draws`
- `losses`
- `goalsFor`
- `goalsAgainst`
- `goalDifference`
- `fantapoints`

### Rendering pubblico

`renderCompetitionResultsPublic` mostra tutte le colonne in ordine e supporta alias legacy per dati statici o snapshot.

### Pagina singola competizione

`competition.html` usa lo stesso ordine colonne e gli stessi alias di lettura per JSON statici/Firebase.

### Mobile

Aggiunti override CSS V216:

- tabella non trasformata in card;
- scroll orizzontale controllato;
- larghezze minime per squadra e statistiche;
- celle compatte da mobile senza nascondere colonne.

## Compatibilità

Le classifiche esistenti restano valide anche se non hanno ancora V/N/P/GF/GS/DR: i campi mancanti vengono mostrati come `-`.

## Test eseguiti

```bash
node --check assets/app.js
node --check assets/js/admin/admin-competitions.js
```
