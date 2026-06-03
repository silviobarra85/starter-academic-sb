# V305 - Calcio mercato base statico

## Scopo

V305 introduce la prima versione della sezione pubblica `Calcio mercato`.

La release e' volutamente conservativa: crea la pagina, la navigazione e il file dati statico/manuale, ma non recupera ancora articoli da siti esterni in automatico.

## File principali

```text
static/zonaorientale/index.html
static/zonaorientale/assets/app.js
static/zonaorientale/assets/css/refactor/calciomercato.css
static/zonaorientale/assets/calciomercato/links.json
```

## Dati statici

La sezione legge:

```text
assets/calciomercato/links.json
```

Schema previsto:

```json
{
  "sources": [
    {
      "id": "fonte",
      "name": "Nome fonte",
      "url": "https://...",
      "note": "Descrizione facoltativa"
    }
  ],
  "articles": [
    {
      "title": "Titolo articolo",
      "url": "https://...",
      "teamName": "Napoli",
      "topic": "Trattative",
      "sourceName": "Nome fonte",
      "description": "Descrizione breve",
      "image": "https://...",
      "publishedAt": "2026-06-03",
      "tags": ["attaccanti", "serie a"]
    }
  ]
}
```

## Funzioni disponibili

- Navigazione desktop: `Calcio mercato`.
- Navigazione mobile: link in `Altro`.
- Filtri per squadra e topic.
- Ricerca testuale su titolo, fonte, squadra, topic, tag e descrizione.
- Card con immagine/placeholder, titolo, descrizione e pulsante `Apri articolo`.
- Elenco fonti configurate.

## Cosa non fa ancora

- Non interroga siti esterni dal browser.
- Non usa scraping.
- Non usa Netlify Functions.
- Non scrive su Firebase.
- Non categorizza automaticamente gli articoli.

Il recupero automatico andra' progettato in una release successiva tramite funzione server-side, per evitare problemi CORS e dipendenze fragili.

## Funzionalita a rischio e preservazione

Funzionalita da non perdere:

- Fantamercato interno esistente.
- Listone pubblico/Admin, colonna `Modifica`, filtro `Modifiche`, usciti storici ed export CSV admin-only.
- Rose e pagina squadra.
- Dashboard Presidente.
- Admin: Diagnostica dati, Richieste presidenti, Converti listone Excel.
- Mobile: bottom navigation, menu Altro, pulsante Su.
- Dark mode unico V289 e Light mode ancora sospesa.

Preservazione V305:

- La nuova sezione e' isolata in `data-page="calciomercato"`.
- Non modifica le logiche esistenti di `fantamercato`.
- Non modifica Firebase, EmailJS o dati JSON esistenti.
- Il file dati e' nuovo e dedicato.

## Test manuali

```text
Home -> Calcio mercato
Altro mobile -> Calcio mercato
Calcio mercato -> filtri squadra/topic
Calcio mercato -> ricerca
Listone pubblico -> export CSV non visibile
Listone admin -> export CSV visibile
Fantamercato interno -> invariato
Rose/pagina squadra -> invariata
Admin -> Diagnostica dati invariata
```

## Diagnostica runtime

```js
window.ZonaOrientaleCalciomercatoV305
window.ZonaOrientaleCalciomercatoV305.getState()
window.ZonaOrientaleCalciomercatoV305.getArticles()
```
