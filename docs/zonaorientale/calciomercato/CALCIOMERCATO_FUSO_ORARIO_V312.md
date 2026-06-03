# V312 - Calciomercato fuso orario Europe/Rome

## Scopo

V312 corregge il timestamp mostrato nella sezione `Calciomercato`: l'orario di aggiornamento del feed e l'orario degli articoli RSS vengono formattati esplicitamente nel fuso `Europe/Rome`.

## Problema rilevato

Nel riepilogo della sezione compariva una stringa del tipo:

```text
34 articoli visibili su 34 recuperati automaticamente · aggiornato 2026-06-03 08:51.
```

L'ora era quella grezza del timestamp ricevuto dalla funzione/feed, spesso in UTC, quindi in Italia risultava due ore indietro durante l'ora legale.

## Correzione

- Aggiunta costante runtime `CALCIOMERCATO_TIME_ZONE_V312 = "Europe/Rome"`.
- Aggiunto formatter `formatCalciomercatoDateTimeRomeV312` basato su `Intl.DateTimeFormat` con `timeZone: "Europe/Rome"`.
- `formatCalciomercatoArticleDateTimeV311` ora delega al formatter V312 per preservare compatibilita con il codice V311.
- Il riepilogo `aggiornato ...` usa lo stesso formatter V312, invece di tagliare la stringa ISO grezza con `slice(0, 16)`.

## Esempio atteso

Un timestamp UTC come:

```text
2026-06-03T08:51:00Z
```

viene mostrato come:

```text
03/06/2026, 10:51
```

## Funzionalita preservate

V312 non modifica:

- recupero automatico RSS V309;
- Netlify Function `calciomercato-feed.js`;
- fallback statico `assets/calciomercato/links.json`;
- layout orizzontale V310;
- giocatori interessati V306;
- squadre multiple/stato V308;
- Fantamercato interno;
- Listone pubblico/Admin;
- export CSV solo Admin;
- Rose e pagina squadra;
- Dashboard Presidente;
- Admin;
- Firebase/Auth/EmailJS;
- mobile navigation.

## Test consigliati

1. Avviare con Netlify Dev o deploy Netlify.
2. Aprire `#calciomercato`.
3. Verificare che il riepilogo mostri l'ora italiana, non l'UTC grezza.
4. Verificare che le card articolo mostrino data/ora coerenti.
5. Verificare che Fantamercato interno, Listone, Rose e Admin restino invariati.

## Diagnostica

```js
window.ZonaOrientaleCalciomercatoTimeZoneV312
window.ZonaOrientaleCalciomercatoTimeZoneV312.formatRomeDateTime("2026-06-03T08:51:00Z")
```
