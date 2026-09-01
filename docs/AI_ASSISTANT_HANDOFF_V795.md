# Handoff V795 - 1 settembre 2026

## Obiettivo

Inserire i calendari completi 2026/2027 forniti dalla lega e rendere realmente modificabili dall'Admin i risultati delle partite provenienti da JSON statico.

## Calendari pubblicati

- Campionato: `static/zonaorientale/assets/competitions/2026-2027/campionato-2026-2027.json`
  - 36 giornate, 180 partite.
  - Giornate 1-2 gia giocate (10 partite) con gol e fantapunti dall'Excel.
  - Giornate 3-36 `DA_GIOCARE` con risultati null.
- Coppa Italia: `static/zonaorientale/assets/competitions/2026-2027/coppa-italia-2026-2027.json`
  - formula `UNO_VS_TUTTI`.
  - 4 giornate lega, 45 confronti per giornata, 180 partite totali.
  - giornate Serie A reali: 8, 17, 24, 26.
- Champion's League: `static/zonaorientale/assets/competitions/2026-2027/champions-league-2026-2027.json`
  - 8 quarti di finale, 4 andata + 4 ritorno.
  - giornate Serie A reali: 7 e 9.
  - semifinali/finale non vengono inventate: non sono presenti nel file sorgente ricevuto.

Il manifest `assets/competitions/manifest.json` conserva anche i calendari storici 2025/2026.

## Regola Admin calendario V795

Il JSON statico e' la sorgente del calendario base. Firebase e' la sorgente degli override amministrativi di risultato.

- Una riga JSON senza override mostra `Inserisci risultato`.
- Il click apre il form `Partite competizioni` gia compilato.
- Salvataggio: crea/aggiorna `competitionMatches/{id}` in Firestore con `source: firebase-admin-v795`.
- Se esiste un override Firebase, gol, fantapunti e stato Firebase prevalgono sul JSON.
- `Rimuovi override` elimina/segna deleted solo la copia Firebase; la partita base resta nel calendario JSON.
- L'import Excel Admin riconosce ora anche calendari a giornate privi di riga stage e tratta `-` come `DA_GIOCARE`, non come partita giocata 0-0.

## Classifiche

Per competizioni attive/programmate di tipo ranking (`CAMPIONATO`, `CLASSIFICA`, `UNO_VS_TUTTI`) la classifica viene calcolata dalle partite `GIOCATA`:

1. punti;
2. fantapunti;
3. differenza reti;
4. gol fatti;
5. nome squadra.

Dopo le prime due giornate il Campionato restituisce la stessa classifica gia pubblicata in V794.

## Pubblicazione dopo modifiche Admin

La modifica in Admin viene salvata in Firebase. Per rendere il dato durabile anche nel percorso static-first pubblico bisogna usare il pannello Snapshot/Backup Admin per aggiornare competizioni/classifiche e pubblicare lo snapshot statico generato nel repository. Il reminder V189 resta attivo.

## Audit

- `node static/fanta-engine/tools/audit-zona-calendars-admin-v795.mjs .` -> 53/53.
- `node static/zonaorientale/tools/audit-static-first-v760.mjs .` -> 42/42.
- `node static/zonaorientale/tools/audit-admin-card-visibility-v763.mjs .` -> 71/71 (shell V795).
- `node --check static/zonaorientale/assets/app.js` -> OK.
