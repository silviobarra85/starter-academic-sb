# V567 - Prima colonna Rose/Area Squadra opaca da mobile

## Obiettivo

Da smartphone, nelle tabelle della sezione **Rose** e dell'**Area Squadra**, la prima colonna sticky poteva risultare parzialmente trasparente. Durante lo scroll orizzontale, le celle che scorrevano sotto la prima colonna rendevano il nome giocatore poco leggibile.

## Intervento

- Aggiunto `static/fanta-engine/css/roster-sticky-first-col-v567.css`.
- Collegato il nuovo CSS alle home di:
  - `static/zonaorientale/index.html`;
  - `static/fantapetillomantramanager/index.html`.
- Il CSS e' caricato dopo `roster-listone-table-unification-v551.css`, cosi' sovrascrive i background ruolo semi-trasparenti solo nello scope mobile.
- La prima colonna sticky ora usa sfondi opachi, con varianti opache per Portieri, Difensori, Centrocampisti e Attaccanti.

## Scope

Mobile only:

- `#rosterClubCards .roster-player-table`;
- `.mobile-roster-detail-card-v156 .roster-player-table`;
- `.mobile-roster-selected-v156 .roster-player-table`;
- `.team-profile-roster-wrap table.team-profile-roster-table`;
- `table.roster-sticky-table.team-profile-roster-table`.

## Preservato

- Calciomercato disattivato V561.
- Svincola Giocatori ZonaOrientale V563/V564.
- Logo presidente per stagione V565.
- Footer/config V566.
- Firebase, EmailJS, Admin, Presidente, snapshot, Listone, Rose e Competizioni.
- `FUNZIONALITA'.md` non modificato.

## Audit

```bash
node static/fanta-engine/tools/audit-roster-sticky-first-col-v567.mjs
```
