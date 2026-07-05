# V570 - Strumento resize colonne tabelle giocatori

## Obiettivo

Rendere semplice la taratura manuale delle larghezze colonne senza compilare un Excel.

L'utente puo' aprire il sito in modalita' debug, trascinare le colonne delle tabelle giocatori e leggere in DevTools Console le nuove dimensioni in pixel. Le misure raccolte verranno poi trasformate in una patch CSS definitiva.

## Attivazione

Lo strumento e' disattivato di default.

Attivazione:

```text
?resizeTabelle=1
```

Alias supportati:

```text
?tableSizer=1
?resizeTables=1
#resize-tabelle
```

Disattivazione:

```text
?resizeTabelle=0
```

Oppure da console:

```js
FantaTableResizeV570.disable()
```

## Tabelle coperte

### Area Squadra / Dashboard Presidente

Scope logico:

```text
teamarea-roster
```

Selector principali:

```text
#teamAreaBody .team-profile-roster-table
#teamAreaBody .roster-player-table
#teamAreaBody .roster-main-table
```

### Rose espanse

Scope logico:

```text
rose-expanded
```

Selector principali:

```text
[data-page='clubs'] .roster-player-table
[data-page='clubs'] .roster-main-table
[data-page='clubs'] .team-profile-roster-table
#rosterDialog .team-profile-roster-table
```

### Listone

Scope logico:

```text
listone
```

Selector principale:

```text
[data-page='listone'] table.listone-table
```

## Output in console

A fine ridimensionamento il JS stampa:

- tabella;
- colonna;
- larghezza in px;
- nome variabile CSS suggerita;
- snippet CSS copiabile.

Sono disponibili anche:

```js
FantaTableResizeV570.print()
window.fantaTableResizeV570Last
window.fantaTableResizeV570All
```

## File aggiunti

```text
static/fanta-engine/css/table-column-resizer-v570.css
static/fanta-engine/js/ui/table-column-resizer-v570.js
static/fanta-engine/tools/audit-table-column-resizer-v570.mjs
```

## Funzionalita' preservate

- Firebase, EmailJS, Admin, Presidente.
- Area Squadra, Rose, Listone, Fantamercato.
- Calciomercato disattivato V561.
- Svincola Giocatori ZonaOrientale V563.
- Header Svincola V564.
- Logo presidente per stagione V565.
- Footer/config V566.
- Prima colonna opaca V567.
- Scope separati V568.
- Prima colonna Area Squadra compatta V569.

## Audit

```bash
node static/fanta-engine/tools/audit-table-column-resizer-v570.mjs
```

## Nota operativa

Il ridimensionamento V570 non e' pensato come layout definitivo: serve a raccogliere misure. Dopo che l'utente comunica i valori desiderati, creare una patch CSS stabile e disattivare/non usare il tool in produzione ordinaria.
