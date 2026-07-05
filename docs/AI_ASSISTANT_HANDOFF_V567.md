# AI Assistant Handoff V567

## Titolo
Prima colonna Rose/Area Squadra opaca da mobile

## Contesto
L'utente ha segnalato che da smartphone, nelle tabelle della rosa in **Area Squadra** e nella sezione **Rose** quando una rosa viene espansa, la prima colonna sticky era troppo trasparente. Durante lo scroll orizzontale, il testo delle celle che scorrevano sotto rendeva il nome giocatore illeggibile.

## Modifiche
- Aggiunto `static/fanta-engine/css/roster-sticky-first-col-v567.css`.
- Caricato il CSS sulle home di ZonaOrientale e FantaMantraManager dopo `roster-listone-table-unification-v551.css`.
- Aggiornati footer/config/cache-buster `league-config-v443.js` a V567 per entrambe le leghe.
- Aggiornata documentazione canonica e roadmap.

## File principali
- `static/fanta-engine/css/roster-sticky-first-col-v567.css`
- `static/fanta-engine/tools/audit-roster-sticky-first-col-v567.mjs`
- `static/zonaorientale/index.html`
- `static/fantapetillomantramanager/index.html`
- `static/zonaorientale/assets/league-config.json`
- `static/fantapetillomantramanager/assets/league-config.json`
- `static/zonaorientale/assets/js/core/league-config-v443.js`
- `static/fantapetillomantramanager/assets/js/core/league-config-v443.js`

## Preservato
- Nessun cambio a dati, snapshot, Firebase, EmailJS, permessi, Admin o Presidente.
- Calciomercato resta disattivato come da V561.
- Svincola Giocatori resta attivo su ZonaOrientale.
- Logo account presidente per stagione V565 preservato.
- `FUNZIONALITA'.md` non modificato.

## Audit
```bash
node static/fanta-engine/tools/audit-roster-sticky-first-col-v567.mjs
node --check static/zonaorientale/assets/js/core/league-config-v443.js
node --check static/fantapetillomantramanager/assets/js/core/league-config-v443.js
```

## Verifica manuale
- Aprire ZonaOrientale da smartphone o emulazione mobile.
- Sezione Rose: espandere una rosa e scorrere orizzontalmente la tabella.
- Area Squadra: aprire la rosa squadra e scorrere orizzontalmente.
- Verificare che la prima colonna copra le celle sottostanti e resti leggibile.
- Ripetere su FantaMantraManager.
