# AI Assistant Handoff corrente - V568

Baseline operativa aggiornata a **V568 - Colonne mobili Rose/Area Squadra adattive**.

## Modifica V568

- Aggiunto `static/fanta-engine/css/roster-mobile-column-fit-v568.css`.
- Da smartphone, nelle tabelle Rose e Area Squadra:
  - la prima colonna sticky dei giocatori non ha piu' larghezza fissa/ellissi;
  - la larghezza viene lasciata al layout automatico della tabella, quindi si adatta al contenuto piu' lungo;
  - la colonna `Costo` e la colonna `Qt.A` sono ridotte al contenuto numerico/header.
- V567 resta caricata prima di V568 per mantenere lo sfondo opaco della prima colonna.
- Nessuna modifica a dati, snapshot, Firebase, EmailJS, Admin, permessi o funzioni Netlify.

## Guardrail

- Calciomercato resta disattivato come da V561.
- Svincola Giocatori ZonaOrientale resta attivo.
- Logo account presidente per stagione resta preservato.
- `FUNZIONALITA'.md` non e' stato modificato.

## Audit

```bash
node static/fanta-engine/tools/audit-roster-mobile-column-fit-v568.mjs
```
