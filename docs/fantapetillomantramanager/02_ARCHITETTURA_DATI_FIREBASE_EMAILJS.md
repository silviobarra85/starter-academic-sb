## Aggiornamento V787 - sincronizzazione rose/listone condivisa

- FantaMantraManager usa lo stesso helper V787 di ZonaOrientale per squadra reale, ruolo, quotazioni, link e badge delle rose.
- Gli eventi di caricamento statico sono ascoltati su `window`, coerentemente con il bootstrap V760.
- Ogni nuova fantasquadra aperta parte con ordine `P -> D -> C -> A`; gli ordinamenti manuali esistenti restano disponibili.
- La modifica non tocca Firebase, EmailJS, configurazioni sensibili, rose specifiche della lega o competizioni.

## Aggiornamento V783 - asset listoni condivisi

FantaMantraManager usa ora in produzione gli stessi listoni centrali di ZonaOrientale:

```text
static/fanta-engine/data/shared-assets/current/assets/listoni/manifest.json
static/fanta-engine/data/shared-assets/current/assets/listoni/<id>.json
```

La config della lega punta a `../fanta-engine/data/shared-assets/current/assets/listoni/`. Il sito carica tutte le voci del manifest, filtra `seasonId: "2026-2027"`, mostra lo storico nel selettore e apre per default la voce con data/ID più recente. Il file `2026-07-04.json` deve restare nel manifest quando verrà aggiunto il nuovo listone.

Il nuovo listone può avere ID Fantacalcio diversi: i link pubblici usano gli ID del JSON selezionato, mentre l'arricchimento con le rose usa il nome normalizzato. L'import va comunque verificato per omonimie e collisioni. ioSudo V783 è in manutenzione e non modifica il funzionamento del Listone di FantaMantraManager.

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

La centralizzazione di listoni e calciomercato nel FantaEngine è attiva. I path condivisi sono configurati in `assets/league-config.json`; le rose, le competizioni e gli snapshot restano invece specifici della lega. I fallback locali restano previsti dal resolver, ma non sono la sorgente canonica.

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

## V785 - listone centralizzato 2026-2027

FantaMantraManager legge il nuovo `2026-08-05.json` dallo stesso manifest del FantaEngine usato da ZonaOrientale. Il file contiene 494 giocatori e ruoli Mantra ufficiali. Il precedente `2026-07-04.json` resta disponibile nel selettore storico. Nessuna configurazione Firebase o EmailJS viene modificata.
- Correzione condivisa link giocatori Frosinone: `FRO -> frosinone`.

## V786 - stato rose derivato dall'ultimo listone stagionale

FantaMantraManager usa il nuovo helper condiviso del FantaEngine `roster-listone-sync-v786.js`. Ogni rosa, sia proveniente da Firebase sia da snapshot statico, viene confrontata con il listone più recente della stagione selezionata. Gli ID Fantacalcio non vengono usati come chiave identità. I giocatori presenti ricevono il badge `In listone`; quelli assenti o ceduti/asteriscati ricevono `Asteriscato` senza essere rimossi dalla rosa. Ruoli Classic/Mantra, squadra reale, quotazione e link vengono aggiornati dal listone corrente, mentre costo d'asta e appartenenza alla fantasquadra restano invariati.
