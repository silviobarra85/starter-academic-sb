# AI Assistant Handoff corrente - V573

Baseline operativa aggiornata a **V573 - Tabelle giocatori mobile pulite**.

## Modifica V573

- Rimosso dal runtime lo strumento opzionale di resize colonne V570/V571.
- Rimosso il caricamento dei CSS incrementali V567/V568/V569 dalle home, sostituiti da un unico CSS pulito V573.
- Tabelle target mobile:
  - Area Squadra / Dashboard Presidente: tabella rosa.
  - Rose: rosa espansa / scheda squadra.
  - Listone: tabella principale e svincolati.
- Righe colorate per ruolo:
  - P: giallo.
  - D: verde.
  - C: blu.
  - A: rosso.
- Prima colonna sticky/opaca durante lo scroll orizzontale.
- Riga intestazione sticky/opaca.
- Nome giocatore mai troncato: puo' andare a capo e mantiene il link a Fantagazzetta/Fantacalcio.
- Scope CSS separati per Area Squadra, Rose e Listone.
- Aggiornati footer/cache-buster/config a V573 su entrambe le leghe.

## File principali

```text
static/fanta-engine/css/player-tables-mobile-v573.css
static/fanta-engine/tools/audit-player-tables-mobile-v573.mjs
```

## Guardrail

- V573 non modifica dati, Firebase, EmailJS, Admin, Area Presidente o snapshot.
- Calciomercato resta disattivato come da V561.
- Svincola Giocatori ZonaOrientale resta attivo.
- Logo account presidente per stagione resta preservato.
- Il resize V570/V571 resta presente come file storico ma non viene piu' caricato dal sito.
- `FUNZIONALITA'.md` non e' stato modificato.

## Audit

```bash
node static/fanta-engine/tools/audit-player-tables-mobile-v573.mjs
```
