# AI Assistant Handoff - V583

## Versione
V583 - Tabelle giocatori mobile: colonne Stato/Rosa/Modifica e colori coerenti.

## Ambito
Whole-site overlay per entrambe le leghe:

- `zonaorientale`
- `fantapetillomantramanager`

## Modifiche principali
- Nuovo CSS `static/fanta-engine/css/player-tables-mobile-v583.css`.
- Nuovo runtime `static/fanta-engine/js/ui/player-tables-mobile-v583.js`.
- Nuovo audit `static/fanta-engine/tools/audit-player-tables-mobile-v583.mjs`.
- Aggiornati link e cache-buster delle home delle due leghe.
- Aggiornati footer/config a V583.

## Motivo tecnico
Le differenze tra Listone, Rose e Area Squadra erano causate da più strati legacy con `!important`:

- `assets/styles.css`, soprattutto `body.is-mobile-ux` e colonne `listone-col-*` / `roster-col-*`;
- `roster-listone-table-unification-v551.css`;
- `mobile-suite-v168.css` e `rosters-tables.css`;
- badge `.status*` con colori e font autonomi.

V583 non si affida più solo alla cascade CSS: marca le tabelle a runtime e applica gli stili finali anche inline con priorità `important`.

## Tarature richieste
- Area Squadra: Stato `8rem`.
- Rose: Stato `4.75rem`.
- Listone: Stato `5.25rem`.
- Listone: Rosa `6.25rem`.
- Listone: Modifica `6.25rem`.
- Listone: `Svincolati`/`Non presente` in Rosa evidenziato ambra.

## Preservato
- Link giocatore esterno.
- Svincola Giocatori ZonaOrientale.
- Calciomercato disattivato.
- Firebase, EmailJS, Admin, Presidente, snapshot invariati.
- Resize colonne V570/V571 non riattivato.
- `FUNZIONALITA'.md` non modificato.

## Audit
Eseguire:

```bash
node static/fanta-engine/tools/audit-player-tables-mobile-v583.mjs
node --check static/fanta-engine/js/ui/player-tables-mobile-v583.js
```
