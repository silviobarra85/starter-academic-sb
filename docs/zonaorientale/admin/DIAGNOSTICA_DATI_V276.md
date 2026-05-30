# V276 - Diagnostica dati Admin

La V276 aggiunge in **Admin** il pannello **Diagnostica dati**.

## Obiettivo

Fornire un controllo rapido e non distruttivo prima di deploy/merge, per ridurre il rischio che una funzionalita' si perda per strada.

## Controlli disponibili

Il pannello mostra semafori per:

- versione deploy, footer e cache-buster;
- listoni e confronto col listone precedente;
- rose e numero giocatori aggregati;
- competizioni e calendari statici;
- news e route share `/zonaorientale/share/news/<id>`;
- richieste presidenti;
- trattative e simulatore V255;
- EmailJS e flussi comunicato scambio/svincolo.

## Diagnostica console

```js
window.ZonaOrientaleAdminDiagnosticsV276
window.ZonaOrientaleAdminDiagnosticsV276.getRows()
window.ZonaOrientaleAdminDiagnosticsV276.refresh()
```

## Note

Il pannello non scrive su Firebase e non sostituisce i test manuali di regressione.
