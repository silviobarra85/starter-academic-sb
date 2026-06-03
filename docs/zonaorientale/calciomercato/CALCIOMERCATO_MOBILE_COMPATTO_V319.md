# V319 - Calciomercato mobile compatto

## Obiettivo

V319 migliora la leggibilita' della sezione pubblica `Calciomercato` da smartphone, senza cambiare recupero RSS, filtri, range temporale o logiche dati.

## Modifiche UI

- I filtri vengono spostati sotto il titolo del pannello `Articoli di mercato`.
- I tre menu principali vengono mostrati affiancati e rinominati visivamente:
  - `Squadre`
  - `Topic`
  - `Fonti`
- Il campo testuale diventa una riga a tutta larghezza con placeholder `Cerca...`.
- I campi data/ora `Da` e `A` vengono mostrati affiancati sotto la ricerca.
- I pulsanti `Aggiorna risultati` e `Ultime 12 ore` restano sotto il range.
- Da mobile le card articolo usano immagine quadrata compatta e nascondono la descrizione testuale, lasciando titolo, metadati, giocatori, fonte/data e link.

## Funzionalita' a rischio e preservazione

Funzionalita' controllate da non perdere:

- Feed RSS automatico V309-V317.
- Fallback statico `assets/calciomercato/links.json`.
- Filtro squadra, topic e fonte.
- Ricerca per giocatore, allenatore, squadra, fonte e titolo.
- Range temporale `Da/A`.
- Caricamento progressivo di articoli piu vecchi.
- Layout orizzontale desktop V310.
- Data/ora Europe/Rome V312.
- Fantamercato interno, che resta separato dalla nuova sezione.
- Listone pubblico/Admin, incluso export CSV solo Admin.
- Rose, pagina squadra, Dashboard Presidente e Admin.
- Mobile bottom nav, menu Altro e pulsante Su.

Preservazione applicata:

- Nessuna modifica alla Netlify Function `calciomercato-feed.js`.
- Nessuna modifica a Firebase/Auth/EmailJS.
- Nessuna modifica a dati JSON o feed configurati.
- Nessuna modifica alle funzioni di filtro o fetch RSS.
- Modifica limitata a markup della sezione, CSS e diagnostica runtime.

## Diagnostica runtime

```js
window.ZonaOrientaleCalciomercatoMobileV319
```

Valori attesi:

```js
window.ZonaOrientaleCalciomercatoMobileV319.behaviorChangeOutsideSection === false
window.ZonaOrientaleCalciomercatoMobileV319.mobileFiltersBelowTitle === true
window.ZonaOrientaleCalciomercatoMobileV319.mobileArticleDescriptionHidden === true
```

## Test manuale consigliato

Da viewport mobile:

1. Aprire `Calciomercato`.
2. Verificare che i filtri siano sotto `Articoli di mercato`.
3. Verificare che `Squadre`, `Topic`, `Fonti` siano affiancati.
4. Verificare che `Cerca...` sia a tutta larghezza.
5. Verificare che `Da` e `A` siano affiancati.
6. Verificare che gli articoli abbiano immagine quadrata compatta.
7. Verificare che la descrizione non occupi spazio da mobile.
8. Verificare che feed, filtri, range, `Carica articoli piu vecchi` e link articoli funzionino.
9. Verificare regressioni su Fantamercato interno, Listone, Rose, Dashboard Presidente e Admin.
