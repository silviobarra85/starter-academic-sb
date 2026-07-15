# Overlay V673 - Card mobile Listone stile Rose

Overlay solo sito.

## Contenuto
- Applica al Listone mobile l'organizzazione interna delle card Rose.
- Sposta lo Stato in alto a destra della card.
- Stato verde per `In listone` e giallo per `Asteriscato`.
- Mantiene comportamento stabile V667/V672 del `td.fpt-v584-col-player`.
- Non modifica ioSudo, dati, rose JSON, listoni JSON o Sudatori.

## Verifiche
```bash
node static/fanta-engine/tools/audit-site-mobile-cards-v673.mjs
node --check static/zonaorientale/assets/app.js
node --check static/fantapetillomantramanager/assets/app.js
```
