# V320 - Riconoscimento automatico giocatori/squadre Calciomercato

## Obiettivo

V320 introduce un riconoscimento automatico prudente di squadre, giocatori e allenatori negli articoli recuperati dai feed RSS del Calciomercato.

La modifica resta isolata alla sezione `Calciomercato` e non introduce AI, Firebase o scritture server.

## Cosa cambia

La Netlify Function:

```text
netlify/functions/calciomercato-feed.js
```

analizza titolo, descrizione e categoria degli articoli RSS e aggiunge, quando possibile:

```json
{
  "detectedTeams": ["Inter", "Napoli"],
  "detectedPlayers": ["Lookman"],
  "entities": {
    "teams": ["Inter", "Napoli"],
    "people": ["Lookman"],
    "players": ["Lookman"]
  }
}
```

Il frontend combina questi campi con i campi manuali gia supportati (`teams`, `players`, `giocatori`, `playerNames`, `interestedPlayers`) e li usa per:

- chip squadra nelle card;
- chip giocatore/allenatore;
- filtro squadra;
- ricerca libera.

## Limiti noti

Il riconoscimento e' euristico, non AI. Usa alias squadre e pattern testuali ricorrenti nei titoli/descrizioni.

Puo' non rilevare tutti i giocatori e puo' produrre qualche falso positivo. Non sostituisce una futura classificazione AI o un indice storico.

## Funzionalita preservate

Non vengono toccati:

- Fantamercato interno;
- Listone pubblico/Admin;
- Export CSV modifiche solo Admin;
- Rose e pagina squadra;
- Dashboard Presidente;
- Admin e diagnostica dati;
- Firebase/Auth/EmailJS;
- mobile bottom nav, menu Altro e pulsante Su;
- feed RSS automatico V309-V317;
- fallback statico `assets/calciomercato/links.json`;
- layout mobile compatto V319.

## Test consigliati

```text
Calciomercato:
- aprire feed automatico via Netlify Dev;
- cercare una squadra, ad esempio Inter o Napoli;
- cercare un nome giocatore/allenatore citato nei titoli;
- verificare chip squadre/giocatori nelle card;
- verificare che i filtri fonte/topic/squadra continuino a funzionare.

Regressioni:
- Fantamercato interno invariato;
- Listone pubblico: export CSV non visibile;
- Listone Admin: export CSV visibile;
- Rose/pagina squadra ok;
- Dashboard Presidente ok;
- Admin ok.
```

## Diagnostica runtime

```js
window.ZonaOrientaleCalciomercatoRecognitionV320
window.ZonaOrientaleCalciomercatoRecognitionV320.getArticles()
window.ZonaOrientaleCalciomercatoRecognitionV320.getTeams(article)
window.ZonaOrientaleCalciomercatoRecognitionV320.getPeople(article)
```
