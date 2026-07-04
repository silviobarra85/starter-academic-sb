# FantaMantraManager - Architettura dati, Firebase ed EmailJS

Aggiornato alla **V483**.

## Principio generale

FantaMantraManager deve restare separato da ZonaOrientale. Le due leghe possono condividere motore e componenti comuni, ma non devono condividere configurazioni sensibili, destinatari EmailJS, rules operative, news, regolamenti o dati specifici di lega.

## Firebase

- Progetto Firebase dedicato: `fantapetillomantramanager`.
- Il runtime FantaMantraManager usa il proprio `static/fantapetillomantramanager/assets/firebase.js`.
- Firebase ZonaOrientale non deve essere importato o usato dal clone.
- I documenti devono includere o derivare sempre l'identita' della lega (`leagueId` / path dedicato / config dedicata).

## Collections/aree operative principali

Le collections effettive dipendono dalle rules applicate e dal workflow dati. Le aree note sono:

- dati presidenti/squadre/stagione;
- `teamUsers` per collegare utenti presidente a squadra/stagione;
- dati di mercato e bilancio;
- dati Admin/import controllato;
- `ruleProposals` per Proposte regolamento V479.

## Proposte regolamento

Collection introdotta:

```text
ruleProposals
```

Campi concettuali:

```text
leagueId
seasonId
title
type
articleRef
currentText
proposedText
reason
effectiveSeason
status
createdByUid
createdBySeasonTeamId
createdByTeamName
createdByPresidentName
createdAt
updatedAt
adminNote
```

Regola funzionale:

- presidenti approvati possono creare proposte;
- presidenti possono modificare solo le proprie proposte finche' sono `SUBMITTED`;
- Admin puo' cambiare stato e nota;
- Admin non deve vedere la Dashboard Presidente, ma puo' avere pannello Admin separato.

Le rules V479 sono in:

```text
static/fantapetillomantramanager/tools/firestore-rules-v479.rules
```

Vanno copiate manualmente nella console Firebase quando si vuole abilitare la funzione in produzione.

## EmailJS

Dati FantaMantraManager correnti:

```text
Public key: gia' presente in assets/emailjs.js
Service ID: service_ttjf7js
Destinatario: barra.silvio@gmail.com
Template Comunicato avvenuto scambio: template_svkkhlr
Template generico/Svincola Giocatori: template_e1o7z5e
```

Note:

- `Svincola Giocatori` compone gia' il corpo email nel sito, quindi usa il template generico.
- `Comunicato avvenuto scambio` usa template dedicato.
- Non sostituire globalmente il template generico con quello dello scambio: si romperebbe lo svincolo.
- Il service EmailJS di FantaMantraManager deve restare diverso da quello di ZonaOrientale.

## Asset e dati statici

FantaMantraManager ha path statico dedicato:

```text
static/fantapetillomantramanager/
```

Il motore comune e' in:

```text
static/fanta-engine/
```

Ad oggi V483 non sposta listoni o calciomercato nel motore comune. La centralizzazione e' candidata per una patch successiva perche' questi file possono essere comuni a piu' leghe, ma bisogna prima verificare:

- quali file sono davvero identici;
- quali includono riferimenti a rose/squadre specifiche di lega;
- quali path sono letti da Listone, Player, Calciomercato, Fantamercato e snapshot;
- quali fallback storici servono per evitare 404.

## Regolamento

PDF corrente:

```text
static/fantapetillomantramanager/assets/regolamento/regolamento-fantapetillo-mantra-manager-2026-2027-v474.pdf
```

La pagina regolamento e la config puntano al PDF V474. I vecchi PDF non vanno cancellati se potrebbero essere gia' stati condivisi.

## Netlify/share news

Il redirect per FantaMantraManager e' separato da ZonaOrientale:

```text
/fantapetillomantramanager/share/news/:id
```

La funzione Netlify usa il parametro lega per distinguere FantaMantraManager.
