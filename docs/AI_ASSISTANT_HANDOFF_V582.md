# AI Assistant Handoff - V582

## Versione
V582 - Tabelle giocatori mobile: fix font e Stati.

## Ambito
Whole-site overlay per entrambe le leghe:

- `zonaorientale`
- `fantapetillomantramanager`

## Modifiche principali
- Nuovo CSS `static/fanta-engine/css/player-tables-mobile-v582.css`.
- Nuovo runtime `static/fanta-engine/js/ui/player-tables-mobile-v582.js`.
- Nuovo audit `static/fanta-engine/tools/audit-player-tables-mobile-v582.mjs`.
- Aggiornati link e cache-buster delle home delle due leghe.
- Aggiornati footer/config a V582.

## Motivo tecnico
Le differenze tra Listone, Rose e Area Squadra erano causate da più strati legacy:

- `zo-role-bg-v405-*` / `player-role-*` in `styles.css`;
- skin `roster-listone-skin-v408` e `team-profile-listone-skin-v415`;
- badge `.status` / `.status-badge` con stili autonomi;
- V581 che imponeva testo scuro alle celle non sticky.

V582 rimuove le classi ruolo legacy dalle righe marcate, applica ruoli propri V582 e normalizza anche i discendenti delle celle e i badge Stato.

## Preservato
- Link giocatore esterno.
- Svincola Giocatori ZonaOrientale.
- Calciomercato disattivato.
- Firebase, EmailJS, Admin, Presidente, snapshot invariati.
- Resize colonne V570/V571 non riattivato.

## Audit
Eseguire:

```bash
node static/fanta-engine/tools/audit-player-tables-mobile-v582.mjs
node --check static/fanta-engine/js/ui/player-tables-mobile-v582.js
```
