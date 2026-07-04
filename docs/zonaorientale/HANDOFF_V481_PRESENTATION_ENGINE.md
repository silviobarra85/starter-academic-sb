# Handoff V481 — Presentation engine multi-lega

## Modifica

V481 estrae meta, branding, footer e mobile More in un modulo comune:

`static/fanta-engine/js/core/league-presentation-v481.js`

I file `league-config-v443.js` di ZonaOrientale e FantaMantraManager continuano a caricare la config lega-specifica, ma delegano la presentazione al motore comune se disponibile.

## Funzionalità preservate

- Firebase/Admin/Auth invariati.
- Team area invariata.
- Sorteggio giornate invariato.
- News, regolamenti, listoni, rose e bilanci invariati.
- Footer e brand restano separati per lega.

## Prossimo step consigliato

V482 audit anti-contaminazione e report automatico multi-lega prima di altri refactor del motore unico.
