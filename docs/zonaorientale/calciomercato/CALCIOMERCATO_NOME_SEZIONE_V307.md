# V307 - Rinomina sezione in Calciomercato

## Scopo

V307 rinomina la sezione pubblica da `Calcio mercato` a `Calciomercato` in navigazione desktop, menu mobile, titolo pagina, messaggi runtime e documentazione operativa.

La modifica e' solo di naming/UI: resta invariata la logica statica introdotta in V305 e ampliata in V306 con i giocatori interessati.

## Funzionalita a rischio e preservazione

Funzionalita verificate da non scollegare:

- sezione `calciomercato` come route/hash interno;
- caricamento `assets/calciomercato/links.json`;
- card articolo, filtri squadra/topic e ricerca;
- campo `players`/`giocatori` e chip dei calciatori interessati;
- Fantamercato interno della lega, che resta separato;
- Listone pubblico/Admin ed export CSV solo Admin;
- Rose, pagina squadra, Dashboard Presidente;
- Admin Diagnostica/Richieste/Converti listone;
- mobile navigation, menu Altro, pulsante Su;
- Dark mode unico e Light mode sospesa.

Preservazione adottata:

- non cambia l'id interno `calciomercato`;
- non cambia il formato del JSON;
- non cambia il file dati `assets/calciomercato/links.json`;
- non introduce scraping, Netlify Function o fetch automatici verso siti terzi;
- non scrive su Firebase e non tocca EmailJS.

## Test manuali

1. Menu desktop: il link deve mostrare `Calciomercato`.
2. Menu mobile `Altro`: il link deve mostrare `Calciomercato`.
3. Aprire `#calciomercato`: titolo pagina `Calciomercato`.
4. Verificare caricamento card da `assets/calciomercato/links.json`.
5. Verificare ricerca anche per nome giocatore.
6. Verificare che `Fantamercato` interno resti invariato.

## Diagnostica

```js
window.ZonaOrientaleCalciomercatoV307
```

Valori attesi:

```js
window.ZonaOrientaleCalciomercatoV307.label === "Calciomercato"
window.ZonaOrientaleCalciomercatoV307.behaviorChangeOutsideSection === false
window.ZonaOrientaleCalciomercatoV307.preservesStaticV306Logic === true
```
