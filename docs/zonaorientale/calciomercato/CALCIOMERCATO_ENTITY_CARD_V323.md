# V323 - Scheda giocatore/squadra Calciomercato

## Scopo

Aggiunge alla sezione pubblica `Calciomercato` una scheda rapida per raccogliere le notizie gia caricate su un giocatore/allenatore o su una squadra.

## Funzionalita

- Pannello `Schede mercato` sotto i filtri Calciomercato.
- Selettore tipo: `Giocatore/allenatore` oppure `Squadra`.
- Campo nome con suggerimenti generati dagli articoli caricati.
- Chip cliccabili nelle card articolo: squadre e giocatori/allenatori aprono direttamente la scheda.
- Riepilogo scheda con numero notizie, fonti, squadre, nomi citati, stati e ultimi articoli.
- Nessuna AI: riepilogo meccanico basato su articoli gia recuperati dai feed RSS.

## Funzionalita a rischio e preservazione

Funzionalita a rischio:

- Calciomercato RSS automatico.
- Filtri squadra/topic/fonte.
- Range temporale e caricamento articoli piu vecchi.
- Layout mobile compatto.

Preservazione:

- Nessuna modifica alla Netlify Function RSS.
- Nessuna scrittura Firebase.
- Nessuna modifica a Fantamercato interno, Listone, Rose, Admin o Dashboard Presidente.
- La scheda usa solo gli articoli gia caricati in memoria.
- La lista articoli resta la vista principale.

## Test manuali

1. Aprire `Calciomercato`.
2. Verificare che il pannello `Schede mercato` sia visibile.
3. Cliccare un chip squadra su una card articolo.
4. Verificare che si apra la scheda squadra con notizie e riepilogo.
5. Cliccare un chip giocatore/allenatore.
6. Verificare che si apra la scheda dedicata.
7. Inserire manualmente un nome nel campo scheda e cliccare `Apri scheda`.
8. Verificare che filtri, range, caricamento piu vecchi e lista articoli restino funzionanti.

## Diagnostica runtime

```js
window.ZonaOrientaleCalciomercatoEntityCardV323
```
