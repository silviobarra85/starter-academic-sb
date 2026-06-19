# V479 - Proposte regolamento FantaMantraManager

## Scopo
Aggiunge una sezione riservata ai presidenti approvati per proporre nuove regole, modifiche, cancellazioni o chiarimenti del regolamento.

## Accesso
- Visibile solo in FantaMantraManager.
- Visibile ai presidenti loggati e approvati in `teamUsers`.
- Non viene mostrata come Dashboard Presidente quando la sessione e' Admin, preservando la regola V477.

## Firebase
Nuova collection: `ruleProposals`.

Campi principali:
- `leagueId`: `fantapetillomantramanager`
- `seasonId`
- `title`
- `type`: `NEW_RULE`, `RULE_CHANGE`, `RULE_DELETE`, `CLARIFICATION`
- `articleRef`
- `currentText`
- `proposedText`
- `reason`
- `effectiveSeason`
- `notes`
- `status`: `SUBMITTED`, `IN_REVIEW`, `IN_VOTING`, `APPROVED`, `REJECTED`, `ARCHIVED`
- `createdByUid`, `createdBySeasonTeamId`, `createdByTeamName`, `createdByPresidentName`, `createdByEmail`
- `createdAt`, `updatedAt`
- campi Admin opzionali: `adminNote`, `reviewedByUid`, `reviewedByName`

## Rules
Applicare in Firebase Console il file:

```text
static/fantapetillomantramanager/tools/firestore-rules-v479.rules
```

Regola funzionale:
- i presidenti approvati leggono tutte le proposte della lega;
- i presidenti approvati creano solo proposte proprie;
- i presidenti possono modificare solo proprie proposte ancora `SUBMITTED`;
- l'Admin puo' cambiare stato/nota e cancellare.

## Funzionalita preservate
- V476: Area Squadra sbloccata.
- V477: Dashboard Presidente non renderizzata in sessione Admin.
- V478: Svincola Giocatori e Comunicato avvenuto scambio restano attivi con EmailJS FantaMantraManager.
- Nessun file ZonaOrientale coinvolto.
