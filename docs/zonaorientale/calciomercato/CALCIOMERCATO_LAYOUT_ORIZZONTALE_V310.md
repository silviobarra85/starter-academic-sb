# V310 - Calciomercato layout orizzontale

## Scopo

V310 corregge la leggibilita' delle card nella sezione pubblica `Calciomercato` quando gli articoli recuperati da RSS hanno titolo e descrizione lunghi.

Il layout precedente poteva mostrare molte card affiancate e strette, rendendo testo, immagini e metadati poco leggibili. La V310 trasforma l'elenco articoli in una lista di card orizzontali.

## Modifiche

- `assets/css/refactor/calciomercato.css`: aggiunte regole V310 per layout a lista verticale di card orizzontali.
- `assets/app.js`: aggiunta diagnostica `window.ZonaOrientaleCalciomercatoLayoutV310` e aggiornamento versione/runtime.
- HTML principali aggiornati a cache-buster/footer V310.

## Funzionalita' a rischio e preservazione

Funzionalita' a rischio:

- recupero automatico RSS V309;
- fallback statico `assets/calciomercato/links.json`;
- giocatori interessati V306;
- squadre multiple/stato trattativa V308;
- Fantamercato interno;
- Listone pubblico/Admin ed export CSV solo Admin;
- Rose/pagina squadra;
- Dashboard Presidente;
- Admin Diagnostica/Richieste;
- mobile bottom nav, menu Altro e pulsante Su.

Preservazione:

- nessuna modifica al formato JSON;
- nessuna modifica alla Netlify Function;
- nessuna scrittura Firebase;
- nessuna modifica a Fantamercato, Listone, Rose, Admin o Presidente;
- intervento isolato al CSS della sezione Calciomercato.

## Test consigliati

1. Aprire `#calciomercato` da desktop.
2. Verificare che gli articoli siano mostrati in card orizzontali leggibili.
3. Verificare che immagini, titolo, descrizione, fonte, squadre, stato e giocatori restino visibili.
4. Testare mobile: le card devono restare leggibili e non collassare in colonne strette.
5. Verificare che Fantamercato interno, Listone, Rose e Admin siano invariati.

## Diagnostica

```js
window.ZonaOrientaleCalciomercatoLayoutV310
```

Valori attesi:

```js
window.ZonaOrientaleCalciomercatoLayoutV310.layout === "horizontal-list"
window.ZonaOrientaleCalciomercatoLayoutV310.behaviorChangeOutsideSection === false
```
