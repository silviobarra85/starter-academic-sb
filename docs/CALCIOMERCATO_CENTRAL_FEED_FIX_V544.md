# V544 - Calciomercato central feed fix

## Obiettivo

Dopo il cleanup dei fallback locali V543, la sezione Calciomercato deve leggere esclusivamente dagli asset comuni in `static/fanta-engine/data/shared-assets/current/assets/calciomercato/`.

## Problema risolto

La funzione Netlify `calciomercato-feed.js` leggeva ancora il vecchio percorso locale `zonaorientale/assets/calciomercato/links.json`. Dopo la rimozione dei fallback locali, il recupero automatico poteva fallire e il frontend poteva mostrare il messaggio "Calciomercato non configurato".

## Modifica

- La funzione Netlify ora cerca prima `fanta-engine/data/shared-assets/current/assets/calciomercato/links.json`.
- Il frontend di entrambe le leghe ha fallback URL assoluti verso il path centrale.
- Se il range corrente non ha ancora un archivio statico giornaliero, il loader usa gli ultimi giorni archiviati disponibili.
- I fallback locali restano fuori dal workflow e non vengono ripristinati.

## Guardrail

- Nessuna modifica a Firebase.
- Nessuna modifica a EmailJS.
- Nessuna modifica ad Admin o Presidente.
- Nessun ripristino delle copie locali Listoni/Calciomercato.
- `FUNZIONALITA'.md` non modificato.
