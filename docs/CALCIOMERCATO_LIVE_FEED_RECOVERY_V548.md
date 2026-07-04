# V548 - Calciomercato live feed recovery

## Obiettivo

Correggere la regressione post-cleanup V543/V547 in cui la sezione Calciomercato risultava configurata ma non mostrava articoli.

## Diagnosi

Il browser non deve recuperare direttamente gli articoli dai siti esterni: molti domini RSS/HTML non espongono header CORS compatibili e lo scraping diretto dal frontend non e affidabile. Il recupero live deve passare dalla Netlify Function `/.netlify/functions/calciomercato-feed`.

Dopo il cleanup dei fallback locali, restavano due problemi:

1. la richiesta live veniva fatta con range data predefinito molto stretto; se i feed avevano articoli fuori range, la funzione restituiva zero articoli visibili;
2. l override archivio V324 aveva perso il fallback agli ultimi giorni disponibili quando il range corrente non coincideva con i giorni archiviati.

## Modifica

V548 aggiunge nel runtime di entrambe le leghe:

- retry live senza filtro data quando il range automatico produce zero articoli ma la funzione segnala feed disponibili;
- riallineamento del range visibile agli articoli live caricati;
- ripristino del fallback agli ultimi tre giorni disponibili dell archivio centrale;
- nessun ripristino dei fallback locali `assets/calciomercato` o `assets/listoni`.

## File principali

- `static/zonaorientale/assets/app.js`
- `static/fantapetillomantramanager/assets/app.js`
- `static/fanta-engine/tools/audit-calciomercato-live-feed-recovery-v548.mjs`

## Verifica

```bash
node static/fanta-engine/tools/audit-calciomercato-live-feed-recovery-v548.mjs
```

## Guardrail

- Firebase invariato.
- EmailJS invariato.
- Admin e Presidente invariati.
- Asset comuni Listoni/Calciomercato restano centralizzati in `static/fanta-engine/data/shared-assets/current/`.
- `FUNZIONALITA'.md` non modificato.
