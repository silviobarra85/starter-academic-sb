# Tabelle giocatori mobile V578

La V578 riduce in modo netto la colonna Giocatore mantenendo gli override mobile V577.

## Tabelle coinvolte

- Area Squadra / Dashboard Presidente.
- Rose.
- Listone.

## Regole principali

- Nome giocatore non troncato, con wrap consentito.
- Celle e intestazioni allineate a sinistra.
- Colore riga per ruolo:
  - P: giallo;
  - D: verde;
  - C: blu;
  - A: rosso.
- Prima colonna sticky e opaca.
- Header sticky e opaco.

## Dimensioni V578

| Tabella | Colonna Giocatore |
|---|---|
| Listone | `clamp(8.5rem, 46vw, 13.5rem)` |
| Area Squadra | `clamp(5.25rem, 28vw, 7rem)` |
| Rose | `clamp(5.25rem, 28vw, 7rem)` |

## Nota

Il resize colonne V570/V571 resta escluso. Le prossime regolazioni devono essere applicate direttamente su CSS/JS V578.
