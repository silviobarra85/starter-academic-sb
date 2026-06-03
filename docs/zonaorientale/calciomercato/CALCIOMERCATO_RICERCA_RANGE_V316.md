# V316 - Calciomercato ricerca, range e feed esteso

V316 sostituisce l'idea di sintesi AI immediata con un miglioramento operativo dei feed RSS.

## Cosa cambia

- Rimuove dalle fonti attive `Virgilio Sport` e `La Gazzetta dello Sport`.
- Mantiene il recupero automatico via Netlify Function.
- Aumenta i limiti prudenziali: fino a 500 articoli totali, 250 per fonte e 20 fonti attive.
- Aggiunge ricerca server-side tramite parametro `q`, utile per giocatori, allenatori, squadre o parole chiave.
- Aggiunge range temporale `from` / `to` sia lato funzione sia lato UI.
- All'apertura della sezione la UI imposta automaticamente le ultime 12 ore.
- Se l'utente resta nella sezione e scorre verso il fondo, la finestra temporale si estende a ritroso e carica articoli piu vecchi.
- Resta disponibile il pulsante `Carica articoli più vecchi`.

## Funzionalita preservate

Non vengono toccati Fantamercato interno, Listone, export CSV solo Admin, Rose, Dashboard Presidente, Admin, Firebase/Auth/EmailJS, mobile navigation, Dark mode e fallback statico `assets/calciomercato/links.json`.

## Nota sui limiti

I feed RSS non sono archivi illimitati: la ricerca lavora sugli articoli esposti dalle fonti nei rispettivi feed. Per una ricerca storica profonda servirebbero API/search endpoint delle singole testate o un indice proprietario futuro.
