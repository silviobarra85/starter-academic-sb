# Overlay V679 - Rifinitura Listone mobile

Overlay solo sito. Riparte dalla V676/V678, senza toccare ioSudo o dati JSON.

## Modifiche

- Rimosso il filtro `Campi visibili` dalla sezione Listone.
- Rimosse dalle card Listone mobile le box: Diff, Qt.I M, Qt.A M, Diff M, FVM M, Ruolo rosa, Costo rosa, Rosa, Origine, Id, MantraRoles, RealTeamOriginal, SourceFormat e RosterSourceV589.
- Badge `Modifica` in basso a destra reso più leggibile.
- Footer/cache-buster portati a V679.

## Controlli

```bash
node static/fanta-engine/tools/audit-site-mobile-cards-v679.mjs
node --check static/zonaorientale/assets/app.js
node --check static/fantapetillomantramanager/assets/app.js
```
