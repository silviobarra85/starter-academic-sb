# V147 - Admin mobile a blocchi

Data: 2026-05-20

## Obiettivo

Migliorare la fruizione dell'area Admin da smartphone senza modificare la vista desktop e senza cambiare logica Firebase.

## Modifiche

- Aggiunto `assets/css/mobile-admin-v147.css`.
- Le sottosezioni Admin diventano card più compatte su mobile.
- I pannelli funzionali interni sono più leggibili e separati.
- Form, liste e azioni Admin sono ottimizzati per touch.
- Le tabelle Admin mantengono lo scroll orizzontale.
- Desktop invariato.

## File coinvolti

- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/css/mobile-admin-v147.css`

## Test consigliati

- `/zonaorientale/#admin` da smartphone.
- Aprire tutte le macro-sezioni Admin.
- Verificare: Accetta utenti, Comunicati, Stagioni e club, Partite competizioni, Snapshot e backup.
- Controllare che desktop resti invariato.
