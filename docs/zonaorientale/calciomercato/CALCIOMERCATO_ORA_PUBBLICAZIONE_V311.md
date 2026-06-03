# V311 - Ora pubblicazione articoli Calciomercato

## Obiettivo

Mostrare nelle card della sezione Calciomercato anche l'ora di pubblicazione dell'articolo quando il feed RSS o il JSON statico espongono un timestamp completo.

## Campi letti

La funzione V311 legge, in ordine:

```text
publishedAt
published_at
pubDate
date
createdAt
```

Se il valore e' parseabile come data, viene mostrato in formato italiano `gg/mm/aaaa, hh:mm`. Se il valore contiene solo una data o una stringa non standard, viene usato un fallback testuale compatto.

## Funzionalita a rischio e preservazione

Aree controllate e preservate:

- recupero RSS automatico V309;
- fallback statico `assets/calciomercato/links.json`;
- layout orizzontale V310;
- giocatori interessati V306;
- squadre multiple e stato trattativa V308;
- Fantamercato interno;
- Listone pubblico/Admin, inclusa esportazione CSV solo Admin;
- Rose, pagina squadra e Dashboard Presidente;
- Admin, Firebase, EmailJS, mobile navigation e Dark mode.

La modifica e' limitata alla formattazione della data visualizzata nelle card Calciomercato.

## Test consigliati

```text
Calciomercato con Netlify Dev/deploy
- articolo RSS con timestamp completo -> data e ora visibili;
- articolo statico con sola data -> nessun errore;
- ricerca e filtri ancora funzionanti;
- Apri articolo ancora funzionante.
```

Console:

```js
window.ZonaOrientaleCalciomercatoDateTimeV311
window.ZonaOrientaleCalciomercatoDateTimeV311.formatDateTime({ publishedAt: "2026-06-03T10:40:00Z" })
```
