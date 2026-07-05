# AI Assistant Handoff - V573 Player Tables Mobile Widths

## Scopo
Taratura mobile delle tre tabelle con giocatori dopo il reset V572.

## Modifiche
- Rimosso ogni riferimento runtime al resize colonne V570/V571, gia disattivato in V572.
- Introdotto `static/fanta-engine/css/player-tables-mobile-v573.css`.
- Da mobile, per Area Squadra/Dashboard Presidente, Rose e Listone:
  - colonna giocatore raddoppiata rispetto alla V572;
  - colonna Stato dimezzata/compattata;
  - colonne Costo e Qt.A rese uguali e compatte;
  - intestazioni e celle allineate a sinistra;
  - righe colorate per ruolo preservate;
  - prima colonna e header sticky/opachi preservati;
  - nome giocatore non troncato e link Fantacalcio preservato.

## File principali
- `static/fanta-engine/css/player-tables-mobile-v573.css`
- `static/fanta-engine/tools/audit-player-tables-mobile-v573.mjs`
- HTML/config delle due leghe aggiornati a V573.

## Audit
```bash
node static/fanta-engine/tools/audit-player-tables-mobile-v573.mjs
```

## Regressioni da verificare manualmente
- Area Squadra mobile: colonna giocatore piu larga, Costo/Qt.A uguali, testi a sinistra.
- Rose mobile: stessi controlli su una rosa espansa.
- Listone mobile: colonna Giocatore larga, Stato compatto, Qt.A/Costo rosa uguali quando visibili.
- Link nome giocatore ancora funzionante.
