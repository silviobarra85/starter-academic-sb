# Overlay V678 - Listone mobile su base V676

Overlay solo sito. Non modifica ioSudo, dati JSON, rose o listoni.

## Contenuto

- Riparte dalla V676 funzionante: su mobile il Listone resta renderizzato fuori dalla tabella legacy.
- Le card del Listone usano struttura `section/div`, non `td`.
- Rimosso il campo `Mercato` dalla card Listone.
- Inseriti i campi del JSON/listone come box fissi nella card.
- Badge `Stato` in alto a destra.
- Badge `Modifica` in basso a destra.
- Footer forzato a V678 anche se vecchie routine V667 provano a riscriverlo.

## Controlli

```bash
node static/fanta-engine/tools/audit-site-mobile-cards-v678.mjs
node --check static/zonaorientale/assets/app.js
node --check static/fantapetillomantramanager/assets/app.js
```
