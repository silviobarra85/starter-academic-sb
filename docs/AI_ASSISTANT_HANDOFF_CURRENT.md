# AI Assistant Handoff corrente - V569

Baseline operativa aggiornata a **V569 - Prima colonna rosa Area Squadra mobile compatta**.

## Modifica V569

- Aggiunto `static/fanta-engine/css/teamarea-roster-first-col-compact-v569.css`.
- Da smartphone, nella tabella rosa dell'Area Squadra / profilo squadra la prima colonna sticky viene ridotta a un intervallo compatto:
  - `clamp(6.25rem, 30vw, 9rem)`.
- La riduzione e' isolata da V568: Rose espanse e Listone restano governati dai loro blocchi CSS separati.
- La prima colonna resta opaca/sticky, quindi non tornano le sovrapposizioni visive durante lo scroll orizzontale.
- Il testo del nome giocatore non viene troncato con ellissi: puo' andare a capo nella colonna compatta.
- Aggiornati footer/cache-buster/config a V569 su entrambe le leghe.
- Nessuna modifica a dati, snapshot, Firebase, EmailJS, Admin, permessi o funzioni Netlify.

## Guardrail

- Calciomercato resta disattivato come da V561.
- Svincola Giocatori ZonaOrientale resta attivo.
- Logo account presidente per stagione resta preservato.
- Gli stili Area Squadra, Rose e Listone restano separati per modifiche future indipendenti.
- `FUNZIONALITA'.md` non e' stato modificato.

## Audit

```bash
node static/fanta-engine/tools/audit-teamarea-roster-first-col-v569.mjs
```
