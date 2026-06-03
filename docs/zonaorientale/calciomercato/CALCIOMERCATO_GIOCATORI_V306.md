# V306 - Calciomercato: giocatori interessati

## Scopo

V306 estende la sezione pubblica `Calciomercato` introdotta in V305 permettendo di indicare, per ogni articolo configurato nel JSON statico, i calciatori interessati dall'indiscrezione o dalla notizia.

## Perimetro della modifica

La modifica resta isolata alla nuova sezione `Calciomercato`:

- nessuna lettura automatica da siti esterni;
- nessuno scraping dal browser;
- nessuna Netlify Function ancora attiva;
- nessuna scrittura Firebase;
- nessuna modifica al Fantamercato interno della lega;
- nessuna modifica a Listone, Rose, Dashboard Presidente o Admin.

## Schema JSON aggiornato

Il file resta:

```text
static/zonaorientale/assets/calciomercato/links.json
```

Ogni articolo puo ora includere il campo `players`, con alias tollerati `giocatori`, `playerNames` o `interestedPlayers`.

Esempio:

```json
{
  "title": "Il Napoli segue un nuovo centrocampista",
  "url": "https://esempio.it/articolo",
  "teamName": "Napoli",
  "topic": "Trattativa",
  "sourceName": "Fonte esempio",
  "description": "Sintesi manuale della notizia.",
  "image": "https://esempio.it/immagine.jpg",
  "publishedAt": "2026-06-03",
  "tags": ["Serie A", "centrocampisti"],
  "players": ["Nome Cognome", "Altro Giocatore"]
}
```

Il campo `players` puo essere anche una stringa separata da virgole o punto e virgola, ma l'array e' il formato consigliato.

## Rendering

Nelle card articolo, quando presenti, i calciatori vengono mostrati come chip sotto la descrizione:

```text
Giocatori: Nome Cognome, Altro Giocatore
```

I nomi dei giocatori entrano anche nella ricerca della sezione `Calciomercato`.

## Funzionalita a rischio e preservazione

Funzionalita da non perdere:

- sezione `Calciomercato` V305 e caricamento JSON statico;
- filtri squadra/topic;
- ricerca titolo/fonte/descrizione/tag;
- apertura articolo esterno;
- fonti configurate;
- Fantamercato interno esistente;
- Listone pubblico/Admin ed export CSV solo Admin;
- Rose e pagina squadra;
- Dashboard Presidente;
- Admin Diagnostica/Richieste/Converti listone;
- mobile bottom nav/menu Altro/pulsante Su;
- Dark mode unico con Light mode sospesa.

Preservazione applicata:

- nessuna funzione storica rimossa;
- nessuna logica Firebase/EmailJS toccata;
- nuova logica limitata a parsing/render dei giocatori nella sezione `Calciomercato`;
- CSS isolato in `assets/css/refactor/calciomercato.css`.

## Test consigliati

1. Aprire `Calciomercato` da menu desktop.
2. Aprire `Calciomercato` da `Altro` mobile.
3. Inserire temporaneamente un articolo in `links.json` con `players` e verificare la comparsa dei chip.
4. Cercare il nome di un giocatore e verificare che l'articolo venga filtrato.
5. Verificare che Fantamercato interno, Listone, Rose e Admin restino invariati.

## Diagnostica runtime

```js
window.ZonaOrientaleCalciomercatoV306
window.ZonaOrientaleCalciomercatoV306.getPlayers({ players: ['A', 'B'] })
```
