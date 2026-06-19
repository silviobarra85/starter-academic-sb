# Handoff V479 - Proposte regolamento FantaMantraManager

## Contesto
Il progetto ha due leghe statiche nella stessa repo: `zonaorientale` e `fantapetillomantramanager`. Questa patch riguarda esclusivamente FantaMantraManager e non deve toccare ZonaOrientale.

## Obiettivo V479
Aggiungere una sezione per permettere ai presidenti loggati e approvati di proporre regole o modifiche regolamentari, con salvataggio su Firebase/Firestore e pannello Admin per la gestione dello stato.

## File modificati
- `static/fantapetillomantramanager/assets/app.js`
- `static/fantapetillomantramanager/assets/league-config.json`
- `static/fantapetillomantramanager/index.html`
- `static/fantapetillomantramanager/competition.html`
- `static/fantapetillomantramanager/player.html`
- `static/fantapetillomantramanager/news.html`
- `static/fantapetillomantramanager/bilanci.html`
- `static/fantapetillomantramanager/tools/firestore-rules-v479.rules`
- `static/fantapetillomantramanager/tools/audit-rule-proposals-v479.mjs`
- `docs/fantapetillomantramanager/README.md`
- `docs/fantapetillomantramanager/RULE_PROPOSALS_V479.md`
- `docs/fantapetillomantramanager/HANDOFF_V479_RULE_PROPOSALS.md`

## Implementazione
In `assets/app.js` e' stato aggiunto il modulo V479:
- collection `ruleProposals`;
- form presidente con titolo, tipo, articolo, testo attuale, testo proposto, motivazione, stagione di applicazione e note;
- lista `Le mie proposte` e `Tutte le proposte della lega`;
- modifica consentita lato frontend solo per proprie proposte ancora `SUBMITTED`;
- pannello Admin `Proposte regolamento` con cambio stato e nota admin;
- caricamento Firestore lazy e sicuro, con gestione permission-denied non bloccante.

## Firebase Rules
La patch include `tools/firestore-rules-v479.rules`. Prima di usare la funzione in produzione va copiato il contenuto nella console Firebase del progetto `fantapetillomantramanager`.

## Funzionalita da preservare
- Non modificare `static/zonaorientale`.
- Non rimuovere funzionalita' esistenti.
- V476 Area Squadra resta sbloccata.
- V477 Dashboard Presidente resta nascosta quando il login e' Admin.
- V478 Svincola Giocatori e Comunicato avvenuto scambio restano attivi con EmailJS dedicato.

## Audit
Da `static/fantapetillomantramanager`:

```bash
node tools/audit-rule-proposals-v479.mjs
```

Esito atteso: tutti i controlli OK.
