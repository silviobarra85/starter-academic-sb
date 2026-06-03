# Calciomercato scroll e range RSS - V317

## Scopo

V317 corregge il caricamento progressivo degli articoli Calciomercato introdotto in V316.

Obiettivi:

- quando l'utente arriva in fondo alla pagina, il sito non deve tornare in alto;
- il pulsante `Carica articoli piu vecchi` deve mantenere la posizione di scroll;
- se i feed non contengono articoli piu vecchi, il sito deve dirlo chiaramente;
- il range temporale deve spiegare che i feed RSS non sono un archivio storico completo.

## Modifiche tecniche

### Frontend

File principale:

```text
static/zonaorientale/assets/app.js
```

Cambi principali:

- `loadCalciomercatoDataV306(options)` ora accetta opzioni conservative per preservare il contenuto durante il caricamento progressivo;
- `loadOlderCalciomercatoArticlesV316()` estende il periodo senza sostituire la lista con il loader;
- durante il caricamento degli articoli vecchi viene preservata la posizione `scrollY`;
- aggiunto il messaggio live `#calciomercatoLoadStatusV317`;
- aggiunto avviso specifico quando un range molto passato non restituisce risultati perche il feed non espone storico sufficiente.

### Netlify Function

File:

```text
netlify/functions/calciomercato-feed.js
```

Cambi principali:

- versione risposta aggiornata a `V317`;
- limiti massimi aumentati a 1000 articoli totali e 1000 per fonte;
- aggiunto `feedRange`, con prima/ultima data disponibile tra gli articoli effettivamente esposti dai feed;
- se il range richiesto non produce risultati, la funzione aggiunge un warning esplicito sul limite storico dei feed RSS.

## Limite importante dei feed RSS

I feed RSS normalmente espongono solo gli articoli piu recenti. Anche se il sito permette di selezionare un range temporale molto vecchio, non e garantito che le fonti forniscano articoli di quel periodo.

Per uno storico profondo servira in futuro una di queste soluzioni:

- indicizzazione periodica degli articoli recuperati;
- API/search dedicate delle fonti;
- database interno di cache storica.

## Funzionalita preservate

V317 non modifica:

- Fantamercato interno;
- Listone pubblico/Admin;
- export CSV solo Admin;
- Rose e pagina squadra;
- Dashboard Presidente;
- Admin;
- Firebase/Auth/EmailJS;
- mobile navigation;
- fallback statico `assets/calciomercato/links.json`;
- layout orizzontale degli articoli;
- data/ora Europe/Rome.

## Test manuale

```text
Calciomercato:
- aprire la sezione con Netlify Dev o preview;
- verificare articoli ultime 12 ore;
- scorrere in fondo: non deve tornare in alto;
- il periodo deve estendersi e, se disponibili, devono comparire articoli piu vecchi;
- cliccare Carica articoli piu vecchi: non deve tornare in alto;
- impostare un range molto vecchio: deve comparire un messaggio chiaro sul limite RSS;
- Fantamercato interno e Listone devono restare invariati.
```

## Diagnostica runtime

```js
window.ZonaOrientaleCalciomercatoScrollV317
```
