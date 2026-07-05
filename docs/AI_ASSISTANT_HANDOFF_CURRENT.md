# AI Assistant Handoff corrente - V574

Baseline operativa aggiornata a **V574 - Tabelle giocatori mobile stile Listone**.

## Modifica V574

- Rimosso/lasciato non caricato lo strumento resize colonne V570/V571.
- Mantenuto un unico CSS mobile per le tabelle giocatori.
- Applicato lo stile mobile del **Listone** anche a:
  - Area Squadra / Dashboard Presidente: tabella rosa.
  - Rose: tabella rosa espansa / scheda squadra.
- Allineati font, densita' righe, dimensioni colonne, intestazione sticky e prima colonna sticky/opaca.
- Righe colorate per ruolo su tutte e tre le tabelle:
  - P: giallo.
  - D: verde.
  - C: blu.
  - A: rosso.
- Nome giocatore non troncato e link Fantagazzetta/Fantacalcio preservato.
- Intestazioni e celle allineate a sinistra.
- Aggiornati footer/cache-buster/config a V574 su entrambe le leghe.

## File principali

```text
static/fanta-engine/css/player-tables-mobile-v574.css
static/fanta-engine/tools/audit-player-tables-mobile-v574.mjs
```

## Guardrail

- V574 non modifica dati, Firebase, EmailJS, Admin, Area Presidente o snapshot.
- Calciomercato resta disattivato come da V561.
- Svincola Giocatori ZonaOrientale resta attivo.
- Logo account presidente per stagione resta preservato.
- `FUNZIONALITA'.md` non e' stato modificato.

## Audit

```bash
node static/fanta-engine/tools/audit-player-tables-mobile-v574.mjs
```
