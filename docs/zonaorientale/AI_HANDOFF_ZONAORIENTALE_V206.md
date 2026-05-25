# AI Handoff ZonaOrientale - V206

## Stato
V206 e' un hotfix dopo V205.

## Problema risolto
Dopo V205 il sito poteva non mostrare i dati perche' la lettura live dei comunicati Firebase veniva attesa dentro il caricamento pubblico.

## Strategia corretta
1. JSON statici/snapshot devono renderizzare sempre per primi.
2. Comunicati Firebase live devono aggiornare la UI in background.
3. Fantamercato live deve restare lazy/sicuro e non bloccare l'avvio.

## File principali
- static/zonaorientale/assets/app.js
- static/zonaorientale/index.html

## Verifiche
- Aprire /zonaorientale/ senza login: dashboard deve mostrare dati.
- Aprire Albo, Statistiche, Confronta, Archivio: dati visibili senza admin full-load.
- Login presidente: Dashboard Presidente visibile; mercato live solo quando serve.
- Comunicati: snapshot/fallback visibili subito, Firebase live aggiorna dopo.
