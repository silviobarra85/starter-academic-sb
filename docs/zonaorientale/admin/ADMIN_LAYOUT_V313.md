# V313 - Admin ordinato e sezioni ridotte

## Scopo

V313 corregge l'ordine visivo dell'area Admin e rende piu' controllabile la pagina dopo il caricamento dei dati completi.

## Modifiche

- Il titolo `Admin` resta sempre il primo blocco visibile dell'area Admin.
- I pannelli informativi inseriti da versioni precedenti (`Avvisi pubblicazione`, `Stato Firebase / JSON`, `Procedura guidata Pubblica aggiornamenti`) vengono spostati sotto il titolo, non sopra.
- Le categorie Admin vengono mostrate ridotte al primo caricamento, con pulsante `Apri` / `Riduci`.
- I pannelli Admin collassabili vengono inizializzati ridotti al primo render in cui compaiono.
- La sezione `Dati amministrazione non ancora caricati`, che contiene `Carica dati amministrazione`, resta aperta.

## Funzionalita a rischio e preservazione

Funzionalita da non perdere:

- `Carica dati amministrazione` e modalita Admin leggero/completo.
- `Richieste presidenti`: aggiorna, approva, rifiuta, elimina da Firebase.
- `Diagnostica dati` Admin.
- `Converti listone Excel`.
- Snapshot pubblici, backup e workflow pubblicazione.
- Listone pubblico/Admin, export CSV solo Admin, colonna `Modifica`.
- Dashboard Presidente, trattative, comunicati, svincoli.
- Calciomercato RSS automatico.

Preservazione applicata:

- Nessuna funzione Admin storica e' stata rimossa.
- Nessuna scrittura Firebase nuova.
- Nessun dato JSON modificato.
- Il cambiamento e' solo di ordine visuale/collasso UI.
- Diagnostica runtime: `window.ZonaOrientaleAdminLayoutV313`.

## Test minimi

1. Entrare come Admin in modalita leggera.
2. Verificare che il titolo `Admin` sia sopra tutto.
3. Verificare che `Carica dati amministrazione` sia visibile e aperto.
4. Premere `Carica dati amministrazione`.
5. Verificare che le categorie Admin siano ridotte.
6. Aprire `Utenti e comunicazioni`, `Rose e mercato`, `Competizioni`, `Snapshot e backup`.
7. Verificare `Richieste presidenti`, `Diagnostica dati`, `Converti listone Excel`.
