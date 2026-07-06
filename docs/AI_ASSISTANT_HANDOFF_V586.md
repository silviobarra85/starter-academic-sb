# AI Assistant Handoff V586 - Rose pubbliche senza filtri ruolo + cleanup review

## Obiettivo
Rimuovere i filtri ruolo dalla sezione pubblica **Tutte le rose**, mantenendo invariati Listone, Area Squadra, Dashboard Presidente e il lavoro mobile consolidato fino alla V585.

## Modifiche runtime
- Aggiunto override V586 in:
  - `static/zonaorientale/assets/app.js`
  - `static/fantapetillomantramanager/assets/app.js`
- La sezione pubblica Rose/Tutte le rose non inserisce piu' il pannello `rosterRoleFiltersV441`.
- Le rose espanse mostrano di nuovo tutti i giocatori senza filtraggio per ruolo.
- I filtri ruolo del Listone restano preservati.
- I filtri operativi dell'Area Squadra/Presidente per trattative/svincoli restano preservati.

## Cleanup e verifica file
- Nuovo audit: `static/fanta-engine/tools/audit-public-roster-filters-cleanup-v586.mjs`.
- Nuovo cleanup conservativo: `static/fanta-engine/tools/cleanup-unused-v586.sh`.
- Il cleanup rimuove solo residui tecnici noti e ormai sostituiti:
  - resize colonne V570/V571;
  - tentativi CSS/JS tabelle giocatori V567-V583;
  - audit sperimentali collegati a quegli asset.
- La documentazione storica non viene cancellata.

## Strategia accorpamento/separazione
- Mantenere `player-tables-mobile-v584` come single source per le tre tabelle giocatori mobile.
- Mantenere `president-teamarea-mobile-v585` separato per la Dashboard Presidente mobile, per non mescolare layout pannelli e stili tabellari.
- Non accorpare per ora `app.js`: e' troppo grande e contiene overlay storici; conviene un refactor successivo per moduli funzionali, con audit dedicato.
- Separare eventuali futuri interventi in tre famiglie:
  1. dashboard/mobile actions;
  2. tabelle giocatori mobile;
  3. filtri/listone/rose.

## Preservato
- Firebase/Auth.
- EmailJS.
- Area Admin.
- Dashboard Presidente V585.
- Tabelle giocatori mobile V584.
- Svincola Giocatori.
- Calciomercato disattivato V561.
- Documentazione storica.

## Audit
```bash
node static/fanta-engine/tools/audit-public-roster-filters-cleanup-v586.mjs
node --check static/zonaorientale/assets/app.js
node --check static/fantapetillomantramanager/assets/app.js
```
