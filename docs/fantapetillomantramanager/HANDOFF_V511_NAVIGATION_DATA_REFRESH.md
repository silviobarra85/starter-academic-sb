# Handoff V511 - Navigation data refresh

## Modifica

Aggiunto fix V511 per assicurare che i click sulle sezioni hash, come News/Listone/Rose, renderizzino i dati pubblici dopo la navigazione.

## File principali

- `static/fanta-engine/js/core/navigation-data-refresh-v511.js`
- `static/fanta-engine/data/navigation-data-refresh-v511.json`
- `static/fantapetillomantramanager/assets/app.js`
- `static/fantapetillomantramanager/assets/js/data/static-files-service.js`
- `static/fantapetillomantramanager/assets/league-config.json`

## Verifica manuale

- Aprire la home.
- Cliccare News: l'URL deve diventare `#news` e la lista deve renderizzare dati o messaggio coerente.
- Cliccare Listone, Rose, Competizioni, Calciomercato/Fantamercato.
- Fare refresh della home e verificare che i dati tornino senza dover cliccare Aggiorna.

## Guardrail

Nessuna modifica a Firebase, EmailJS, ruoli, dati o rules.
