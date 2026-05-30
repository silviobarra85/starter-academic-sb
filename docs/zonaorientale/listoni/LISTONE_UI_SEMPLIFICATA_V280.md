# V280 - UI Listone semplificata

## Obiettivo

La sezione pubblica `Storico listoni` viene tolta dalla UI del Listone per rendere la pagina piu' semplice e meno dispersiva.

## Cosa cambia

- Il pannello `Storico listoni` non viene piu' montato/mostrato nella pagina pubblica.
- Il toggle `Cerca anche negli altri listoni` viene rimosso dalla barra filtri.
- Le note di export collegate al pannello storico non vengono piu' mostrate.

## Cosa resta attivo

La modifica e' solo di interfaccia. Restano preservate le logiche V269-V278 usate da:

- colonna `Modifica`;
- filtro `Modifiche`;
- toggle `Mostra usciti storici`;
- righe `Uscito`;
- normalizzazione codici squadra reali;
- export `Esporta modifiche CSV`.

## Diagnostica

```js
window.ZonaOrientaleListoneUiV280
```

Valori attesi:

```text
version: V280
historyPanelVisible: false
preserves: Modifica, Modifiche, Usciti storici, Export CSV
```

## Test consigliati

- Aprire `Listone` da pubblico.
- Verificare che il pannello `Storico listoni` non sia visibile.
- Verificare che la tabella Listone continui a caricarsi.
- Verificare filtro `Modifiche`.
- Verificare colonna `Modifica` nei campi visibili.
- Verificare `Mostra usciti storici`.
- Verificare `Esporta modifiche CSV`.
