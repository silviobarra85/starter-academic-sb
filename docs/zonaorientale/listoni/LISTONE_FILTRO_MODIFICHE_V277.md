# V277 - Filtro modifiche nel Listone

La V277 aggiunge un filtro operativo nella sezione **Listone** per sfruttare la colonna `Modifica` introdotta in V270.

## Nuovo filtro

Nella barra filtri del Listone compare il campo **Modifiche** con opzioni:

- Tutte le modifiche;
- Solo modificati;
- Solo nuovi;
- Solo usciti;
- Solo aumentati;
- Solo diminuiti;
- Solo cambi stato;
- Solo cambi squadra;
- Solo cambi ruolo.

## Relazione con gli usciti storici

Quando si seleziona **Solo usciti** o **Solo modificati**, gli usciti storici vengono inclusi automaticamente anche se il toggle `Mostra usciti storici` era disattivato.

## Diagnostica console

```js
window.ZonaOrientaleListoneChangeFilterV277
window.ZonaOrientaleListoneChangeFilterV277.getVisibleRows()
```

## Funzionalita' da preservare

Non rimuovere senza test dedicati:

- colonna opzionale `Modifica`;
- toggle `Mostra usciti storici`;
- ricerca storica negli altri listoni;
- normalizzazione codici squadra V274;
- confronto listone corrente vs precedente.
