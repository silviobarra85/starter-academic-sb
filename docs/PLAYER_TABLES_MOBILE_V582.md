# V582 - Tabelle giocatori mobile: fix font e Stati

## Obiettivo
Correggere le sovrapposizioni CSS residue sulle tre tabelle giocatori mobile:

- Area Squadra / Dashboard Presidente
- Rose
- Listone

## Problema verificato
Le patch precedenti applicavano un sistema unico, ma alcune regole legacy continuavano a intervenire:

- `assets/styles.css`: regole globali `zo-role-bg-v405-*` e `player-role-*`, incluse varianti `html[data-theme="light"]`, con background `!important`.
- `assets/css/refactor/rosters-tables.css`: skin `team-profile-listone-skin-v415` e sticky first column.
- `assets/css/mobile-suite-v168.css` e `components-v130.css`: badge `.status`, `.status-badge`, `.player-status` con font, padding, colore e background propri.
- V581 inoltre forzava il testo delle celle non sticky a colore scuro, quindi il risultato mobile poteva diventare nero su background colorato.

## Soluzione
V582 introduce un runtime/CSS unico e deterministico:

- sostituisce gli hook V581 con `data-player-table-v582`;
- rimuove dalle righe le classi legacy ruolo prima di applicare lo stile V582;
- assegna il ruolo a `data-fpt-v582-role` e classi `fpt-v582-role-*`;
- forza testo bianco su celle e discendenti;
- normalizza i badge Stato dentro le colonne Stato;
- usa colori ruolo scuri ad alto contrasto, coerenti tra le tre tabelle;
- mantiene header e prima colonna sticky/opachi;
- mantiene nome giocatore cliccabile e non troncato;
- non reintroduce il resize V570/V571.

## Verifica manuale
Da smartphone o emulazione mobile:

1. aprire Listone;
2. aprire Rose ed espandere una squadra;
3. aprire Area Squadra / Dashboard Presidente;
4. verificare che i colori ruolo siano uguali nelle tre tabelle;
5. verificare che il testo sia bianco;
6. verificare che i badge Stato abbiano lo stesso font/stile;
7. scorrere orizzontalmente e controllare che la prima colonna resti opaca.
