# V177 - Diagnostica letture Firebase

Data: 2026-05-21

## Obiettivo

Aggiungere uno strumento leggero per stimare le letture Firebase generate dai flussi principali, cosi da validare le ottimizzazioni prima della pubblicazione online.

## Modifiche

- Aggiornata la Version nel footer a `V177 diagnostica letture Firebase`.
- Aggiornati i cache-buster di `styles.css`, `mobile-suite-v168.css` e `app.js` a `v=177`.
- Aggiunto contatore sessione per letture Firebase stimate:
  - documenti singoli letti tramite `getDocumentIfExistsV32`;
  - collection lette dal caricamento admin V174/V175;
  - query Fantamercato su `transferListings` e `transferNegotiations`.
- Aggiunto riepilogo in Admin -> Backup.
- Aggiunto helper console `window.ZonaOrientaleFirebaseReads`.

## Come usare la diagnostica

Aprire il sito con:

```text
http://localhost:1313/zonaorientale/?debugReads=1
```

Poi consultare la console browser. Per disattivare:

```text
http://localhost:1313/zonaorientale/?debugReads=0
```

Oppure da console:

```js
ZonaOrientaleFirebaseReads.summary()
ZonaOrientaleFirebaseReads.reset()
ZonaOrientaleFirebaseReads.enable()
ZonaOrientaleFirebaseReads.disable()
```

## Nota

Il totale e una stima applicativa: Firestore Billing rimane la fonte ufficiale, perche cache, rules e SDK possono incidere sul conteggio reale.
