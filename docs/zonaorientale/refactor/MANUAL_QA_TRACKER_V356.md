# Manual QA tracker V356

## Obiettivo

Dopo il ciclo V333-V355, la V356 introduce uno strumento leggero per tracciare da console i test manuali completati. Lo strumento non modifica i dati applicativi e non scrive su Firebase.

## Implementazione

In `assets/app.js` e stato aggiunto:

```js
window.ZonaOrientaleManualQaTrackerV356
```

Il tracker contiene una lista di checkpoint funzionali e salva lo stato in `localStorage`.

## Perche e sicuro

- Nessun listener globale invasivo.
- Nessuna modifica DOM automatica.
- Nessuna chiamata Firebase/Netlify.
- Nessuna rimozione di file.
- I comandi sono disponibili solo se invocati dalla console.

## Checkpoint coperti

Auth/Admin, Dashboard Presidente, Diagnostica dati, Calciomercato, Listone, Rose, Competizioni, Fantamercato, simulatore trade, mobile navigation e News/share.
