# ZonaOrientale - V175

Data: 21/05/2026

## Obiettivo

Ridurre ulteriormente le letture Firebase in admin e migliorare l'usabilita mobile del Listone.

## Modifiche

### Admin: utenti e richieste lazy

Il caricamento admin iniziale non legge piu automaticamente:

- `pendingUsers`
- `teamRequests`

Queste collection vengono caricate solo quando l'admin preme **Carica utenti e richieste** nei pannelli:

- Admin -> Utenti e comunicazioni -> Accetta utenti
- Admin -> Utenti e comunicazioni -> Richieste presidenti

`teamUsers` resta nel caricamento iniziale admin perche e usata anche da flussi operativi come riversamento stagione e associazioni account/squadra.

Dopo il primo caricamento manuale, eventuali refresh admin successivi nella stessa sessione includono anche `pendingUsers` e `teamRequests`, cosi approvazioni/rifiuti continuano a funzionare senza perdere lo stato.

### Mobile: tasto Su nel Listone

Nella pagina mobile del Listone e stato aggiunto un pulsante fisso in alto a sinistra:

- `↑ Su`

Il bottone riporta immediatamente l'utente nella parte superiore della schermata del Listone.

### Versione footer

Footer aggiornato a:

`V175 utenti admin lazy e tasto Su listone`

## File modificati

- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/assets/css/mobile-suite-v168.css`

## Test consigliati

1. Aprire il sito da mobile o con device toolbar.
2. Entrare in Listone e scorrere in basso.
3. Premere `↑ Su` e verificare il ritorno alla parte superiore.
4. Entrare come admin.
5. Verificare che i pannelli Utenti/Richieste mostrino il caricamento manuale.
6. Premere **Carica utenti e richieste** e verificare che appaiano dati e pulsanti di approvazione.
7. Verificare che Snapshot pubblici, Backup, Competizioni e Rose funzionino come prima.

## Note letture Firebase

Rispetto a V174, ogni login admin evita il caricamento immediato di `pendingUsers` e `teamRequests`. Le letture vengono effettuate solo quando l'admin apre davvero il flusso di approvazione utenti/richieste.
