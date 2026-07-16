# Overlay V692 - profili e rose mobile responsive

Overlay solo sito.

## Cosa cambia

- Non tocca ioSudo.
- Non tocca dati, rose JSON o listoni JSON.
- Le card dei movimenti dentro il dettaglio squadra tornano scure.
- Le card dei movimenti nella sezione `Tutte le Rose` vengono renderizzate fuori dalla tabella su mobile e non sforano a destra.
- Desktop invariato.
- Footer aggiornato a V692.

## Controlli

```bash
node static/fanta-engine/tools/audit-site-mobile-profile-v692.mjs
node --check static/zonaorientale/assets/app.js
node --check static/fantapetillomantramanager/assets/app.js
```
