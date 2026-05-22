# V148 - Rifiniture contenuti mobile

Data: 2026-05-20
Branch: `feature/zonaorientale-competizioni-statiche`

## Obiettivo

Completare il primo giro della nuova interfaccia mobile intervenendo sulle sezioni informative non ancora rifinite:

- News / Comunicati
- Albo d'Oro e FIFA Ranking
- Regolamento
- menu mobile Altro

La vista desktop resta invariata.

## File modificati

```text
static/zonaorientale/index.html
```

## File nuovi

```text
static/zonaorientale/assets/css/mobile-content-v148.css
```

## Cosa cambia

- News mobile in card piu leggibili.
- Data e categoria del comunicato piu ordinate.
- Albo d'Oro mobile con tabelle scrollabili e palmares a card.
- FIFA Ranking mobile piu compatto.
- Regolamento mobile con indice a pulsanti e sezioni piu leggibili.
- Menu Altro mobile con scroll interno, utile su schermi piccoli.
- Cache busting aggiornato a `v=148`.

## Note tecniche

Modifica solo CSS in media query mobile.
Nessuna modifica a Firebase, dati, funzioni JS o regole.
