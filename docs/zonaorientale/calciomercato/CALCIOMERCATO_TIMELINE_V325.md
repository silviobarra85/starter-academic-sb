# V325 - Timeline Calciomercato e download JSON protetto

## Scopo

Aggiungere una vista opzionale `Timeline` alla sezione Calciomercato e rafforzare la presenza dei download JSON, senza rimuovere o sostituire la lista articoli standard.

## Funzionalita aggiunte

- Pulsanti `Lista` e `Timeline` nella sezione Articoli di mercato.
- La lista resta la vista predefinita.
- La Timeline raggruppa gli articoli filtrati per giorno: `Oggi`, `Ieri` o data estesa.
- Download JSON filtrati.
- Download JSON completo del feed corrente.
- Payload export con filtri, contatori, modalita sorgente e articoli esportati.

## Funzionalita a rischio e preservazione

Funzionalita protette:

- Feed RSS automatico Calciomercato.
- Fallback statico `assets/calciomercato/links.json`.
- Filtri Squadre / Topic / Fonti.
- Ricerca libera.
- Range Da/A.
- Carica articoli piu vecchi.
- Layout mobile compatto.
- Download JSON.
- Fantamercato interno.
- Listone pubblico/Admin ed export CSV solo Admin.
- Rose, pagina squadra, Dashboard Presidente e Admin.

Preservazione adottata:

- La vista standard resta `Lista`.
- La Timeline usa gli stessi articoli filtrati e lo stesso renderer delle card.
- I download JSON non cambiano feed, filtri o Netlify Function.
- Nessuna scrittura Firebase.
- Nessuna modifica a Fantamercato interno, Listone, Rose o Admin.

## Test manuale

1. Aprire Calciomercato.
2. Verificare che la vista iniziale sia `Lista`.
3. Cliccare `Timeline`.
4. Verificare raggruppamento per giorno.
5. Cambiare filtri Squadre / Topic / Fonti e verificare che la Timeline rispetti i filtri.
6. Tornare a `Lista`.
7. Provare `Scarica JSON filtrati`.
8. Provare `Scarica JSON completo`.
9. Verificare `Carica articoli piu vecchi`.
10. Verificare che Fantamercato interno, Listone, Rose e Admin siano invariati.

## Diagnostica console

```js
window.ZonaOrientaleCalciomercatoTimelineV325
window.ZonaOrientaleCalciomercatoTimelineV325.getTimelineGroups()
window.ZonaOrientaleCalciomercatoTimelineV325.getDownloadPayload("filtered")
```
