# V583 - Tabelle giocatori mobile: colonne Stato/Rosa/Modifica e colori coerenti

## Obiettivo
Correggere le tre tabelle giocatori mobile:

- Area Squadra / Dashboard Presidente
- Rose
- Listone

## Problemi verificati
Le differenze di colore/font erano dovute a sovrapposizioni di CSS storici:

- `assets/styles.css`: regole mobile con `body.is-mobile-ux`, `listone-col-*`, `roster-col-*` e sticky first column con `!important`.
- `roster-listone-table-unification-v551.css`: skin `roster-listone-skin-v408` e `team-profile-listone-skin-v415`.
- `mobile-suite-v168.css` e `rosters-tables.css`: font/padding/sticky sulle tabelle Rose e Area Squadra.
- Badge `.status`, `.status-ok`, `.status-warning`, `.status-danger`, `.status-badge` con colori propri.

## Soluzione V583
V583 introduce un CSS e un runtime mobile dedicati, caricati dopo gli stili legacy:

- `static/fanta-engine/css/player-tables-mobile-v583.css`
- `static/fanta-engine/js/ui/player-tables-mobile-v583.js`

Il runtime:

- marca le tabelle con `data-player-table-v583="teamarea|rose|listone"`;
- rimuove classi ruolo legacy dalle righe/celle marcate;
- applica ruoli propri `data-fpt-v583-role="p|d|c|a"`;
- forza font, colore testo bianco, padding, background e badge Stato con `style.setProperty(..., 'important')`;
- mantiene header e prima colonna sticky/opachi;
- mantiene i link dei giocatori.

## Tarature colonne mobile

- Area Squadra: colonna Stato portata a `8rem`.
- Rose: colonna Stato portata a `4.75rem`.
- Listone: colonna Stato portata a `5.25rem`.
- Listone: colonna Rosa portata a `6.25rem`.
- Listone: colonna Modifica portata a `6.25rem`.
- Listone: testo `Svincolati`/`Non presente` nella colonna Rosa evidenziato in ambra `#fde68a`.

## Preservato

- Link giocatore esterno.
- Svincola Giocatori ZonaOrientale.
- Calciomercato disattivato.
- Firebase, EmailJS, Admin, Presidente, snapshot invariati.
- Resize colonne V570/V571 non riattivato.

## Verifica manuale
Da smartphone o emulazione mobile:

1. aprire Listone;
2. aprire Rose ed espandere una squadra;
3. aprire Area Squadra / Dashboard Presidente;
4. verificare che i colori ruolo siano uguali nelle tre tabelle;
5. verificare che il testo sia bianco;
6. verificare che i badge Stato abbiano stesso font/stile;
7. verificare le nuove larghezze di Stato/Rosa/Modifica;
8. scorrere orizzontalmente e controllare che la prima colonna resti opaca.
