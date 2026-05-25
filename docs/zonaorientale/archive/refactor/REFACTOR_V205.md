# REFACTOR V205 - Dati live Firebase e Archivio snello

## Obiettivo

V205 chiarisce la strategia dati dopo le ottimizzazioni JSON/snapshot:

- i JSON statici restano la fonte prioritaria per dati storici/pesanti;
- gli snapshot Firebase restano fallback pubblico e sorgente compatta quando manca il JSON;
- comunicati, lista trasferibili e trattative sono dati live/operativi e devono essere letti da Firebase.

## Modifiche

### Comunicati live

Il caricamento pubblico aggiorna `state.raw.news` leggendo la collection Firebase `news` dopo il caricamento statico/snapshot. Se Firebase non è disponibile, resta il fallback da snapshot.

### Fantamercato live

La Dashboard Presidente richiede i dati del mercato da Firebase quando il presidente entra nella sua area. I trasferibili non vengono presi dagli snapshot statici: se il mercato non è ancora caricato, la lista resta vuota finché non arriva la query Firebase.

### Archivio stagioni

Rimossa la sottosezione `Partite recenti` dalla pagina Archivio. Restano metriche, squadre, albo della stagione, competizioni e timeline.

## Letture Firebase

Questa versione aggiunge intenzionalmente letture live per:

- `news` all'avvio pubblico/admin leggero;
- `transferListings` e `transferNegotiations` quando un presidente usa Dashboard Presidente/Fantamercato.

È coerente con l'obiettivo funzionale: comunicati, trasferibili e offerte devono essere visibili subito, senza aggiornamento manuale degli snapshot.

## File modificati

- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/app.js`
- `docs/zonaorientale/REFACTOR_V205.md`
- `docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_V205.md`

## Test eseguiti

- `node --check static/zonaorientale/assets/app.js`
- `find static/zonaorientale/assets -type f -name '*.js' -print0 | xargs -0 -n 1 node --check`
