# Release V327 - Fix Solo Admin Calciomercato

Data: 04/06/2026

## Sintesi

Release mirata per correggere il pannello Solo Admin della sezione Calciomercato. Nessuna modifica a Firestore, Netlify Functions, dati statici o regole Firebase.

## Modifiche incluse

1. Calciomercato Solo Admin: rimosso il testo non destinato alla UI dal label del pannello.
2. Calciomercato Solo Admin: il pulsante `Espandi`/`Riduci` apre e chiude realmente la sezione.
3. CSS Calciomercato: aggiunta protezione esplicita per il body nascosto del pannello.

## Funzionalita da verificare dopo deploy

- Aprire `#calciomercato` come admin.
- Verificare che il box mostri il label `Solo Admin`.
- Cliccare `Espandi` e verificare che compaiano azioni, diagnostica e stato archivio.
- Cliccare `Riduci` e verificare che la sezione si richiuda.

## Funzionalita preservate

- Calciomercato feed RSS, fallback statico, archivio giornaliero e download admin.
- Fallback immagine fonte per articoli senza anteprima.
- Filtri desktop compatti V326.
- Listone, mobile menu e rimozione toggle vista mobile/desktop V326.
- Fantamercato interno, Rose, Dashboard Presidente, Admin, Firebase/Auth/EmailJS.

## Versione

- Footer e cache-buster: V327.
- `DEPLOY_EXPECTED_VERSION_V181`: `327`.
