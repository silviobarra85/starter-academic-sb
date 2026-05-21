# V185 - Admin mobile actions and help

## Obiettivo

Rifinitura della UI admin prima del deploy finale.

## Modifiche

- Aggiornata la versione footer a V185.
- Aggiornati i cache-buster degli asset principali a `v=185`.
- Da mobile, quando l'utente e loggato come admin, i quattro pulsanti header restano sulla stessa riga:
  - Dark/Light
  - Aggiorna dati
  - Account
  - Logout
- In `Admin -> Snapshot pubblici`, il testo dei bottoni e centrato anche sui pulsanti originali, non solo su quelli con data ultimo aggiornamento.
- Aggiunta in fondo alla sezione Admin una guida rapida che spiega le principali funzionalita:
  - caricamento dati amministrazione;
  - anagrafiche;
  - rose e movimenti;
  - competizioni;
  - FIFA Ranking e comunicati;
  - snapshot pubblici;
  - config e JSON statici;
  - preflight asset pubblici;
  - checklist online finale;
  - backup Firebase.

## Note tecniche

La guida e renderizzata sia nella modalita admin leggero sia dopo il caricamento completo dei dati amministrativi.

## Test

- `node --check assets/app.js`
- validazione sintassi JS degli asset
- validazione JSON degli asset statici
- smoke test HTTP locale sugli asset principali
