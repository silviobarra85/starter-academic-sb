# REFACTOR V194 - Tasto Su mobile globale

## Obiettivo

Uniformare la navigazione mobile sulle pagine lunghe aggiungendo un pulsante flottante `Su` che riporta l'utente all'inizio della schermata.

## File modificati

- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/app.js`

## Dettagli

- Aggiornato footer a `V194 tasto Su mobile globale`.
- Aggiornati cache-buster a `v=194`.
- Aggiornato `DEPLOY_EXPECTED_VERSION_V181` a `194` per la checklist online finale.
- Aggiunto `mobileGlobalTopBtnV194` creato dinamicamente in `app.js`.
- Il pulsante compare solo su viewport mobile, solo quando la pagina attiva e' abbastanza lunga e dopo scroll superiore a circa 420px.
- Il click fa scroll smooth verso l'alto e prova a ripristinare il focus sul titolo della pagina attiva.
- Nessuna nuova lettura Firebase.

## Test

- `node --check static/zonaorientale/assets/app.js`
- `find static/zonaorientale/assets -type f -name '*.js' -print0 | xargs -0 -n 1 node --check`
- `find static/zonaorientale/assets -type f -name '*.json' -print0 | xargs -0 -n 1 python3 -m json.tool`

## Verifiche manuali consigliate

- Mobile: Listone, Albo, Statistiche, Admin e Competizioni.
- Scorrere in basso e verificare la comparsa del pulsante `Su`.
- Premere `Su` e verificare ritorno a inizio pagina.
- Desktop: verificare che il pulsante non compaia.
