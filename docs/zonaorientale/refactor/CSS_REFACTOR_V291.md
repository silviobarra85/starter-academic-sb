# CSS_REFACTOR_V291 - Separazione prudente CSS mobile/rose/tabelle

Versione runtime: **V291 refactor CSS prudente**.

## Obiettivo

Ridurre `assets/styles.css` senza cambiare comportamento visibile, estraendo solo i blocchi CSS recenti e gia' isolati introdotti tra V285 e V289.

## File CSS introdotti

```text
assets/css/refactor/mobile-controls-v291.css
assets/css/refactor/rosters-tables-v291.css
```

I file vengono caricati dopo `assets/styles.css`, `mobile-suite-v168.css` e `mobile-chrome-v223.css`, cosi' mantengono la stessa funzione di override finale che avevano quando erano in coda a `styles.css`.

## Blocchi estratti da styles.css

- V285: fix mobile mirati per leggibilita', tabelle e controlli.
- V286: contrasto prima colonna sticky in modalita Light mobile.
- V287: rifinitura controlli mobile.
- V288: fix rose mobile Light nella pagina squadra.
- V289: sospensione Light mode e rose mobile compatte in Dark.

`styles.css` conserva solo un commento di indirizzamento V291 verso i nuovi file.

## Funzionalita a rischio e preservazione

| Area | Rischio | Preservazione V291 | Test richiesto |
| --- | --- | --- | --- |
| Listone | Perdere colonna sticky, filtri, export o leggibilita mobile | Nessuna logica JS toccata; CSS V285-V287 spostato in file caricato dopo gli altri CSS | Listone mobile, filtro Modifiche, export CSV |
| Rose pubbliche | Prima colonna di nuovo alta/non centrata o con contrasto errato | CSS V286/V288/V289 mantenuto integralmente in `rosters-tables-v291.css` | Pagina squadra -> Rosa da smartphone |
| Dashboard Presidente | Tabelle rosa o controlli trattative possono ereditare regole diverse | Ordine CSS conservato; nessuna modifica a markup/JS | Dashboard Presidente, rose, trattative |
| Bottom navigation mobile | Regole touch/altezza potrebbero non applicarsi | Blocco V287 spostato, non riscritto | Bottom nav e menu Altro mobile |
| Dark mode unico | Light mode potrebbe riapparire | Regole V289 e bootstrap JS restano attivi | Header senza toggle tema, reload dopo `localStorage` light |
| Pagine standalone | `competition.html` e `player.html` potrebbero non caricare gli override | Entrambi gli HTML importano i nuovi CSS V291 | Competition e player da mobile |

## Cosa non e' stato fatto

- Nessuna rimozione di funzioni JS.
- Nessun refactor di `app.js`.
- Nessuna modifica a Firebase, EmailJS o JSON statici.
- Nessuna riattivazione della modalita Light.
- Nessuna cancellazione del CSS Light storico.

## Verifica tecnica

```bash
static/zonaorientale/tools/check-zonaorientale.sh
```

Il controllo V291 verifica anche la presenza dei due nuovi file CSS e di questo documento.

## Verifica manuale minima

```text
Home mobile
Listone mobile: filtri, Modifiche, export CSV
Pagina squadra -> Rosa mobile: prima colonna leggibile e centrata
Dashboard Presidente -> tabelle e controlli
Bottom navigation e menu Altro
Competition.html mobile
Player.html mobile
Header: toggle tema assente, tema Dark forzato
```
