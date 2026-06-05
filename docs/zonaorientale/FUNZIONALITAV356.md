# FUNZIONALITAV356 - Stato funzionale preservato

Versione: V356
Data: 05/06/2026
Tipo: manual QA tracker post-refactor, senza cambio funzionale.

## Scopo

La V356 aggiunge un tracker console per segnare i test manuali completati dopo il ciclo di refactor/cleanup V333-V355. Non introduce nuove funzionalita utente, non rimuove file e non modifica flussi runtime esistenti.

## Funzionalita preservate

- Login Admin e Presidente.
- Dashboard Presidente.
- Calciomercato con feed RSS/HTML, fonti TMW squadra, archivio statico, filtri, card compatte e fallback immagini.
- Tag giocatore negli articoli Calciomercato e timeline in modal.
- Pannello Calciomercato Solo Admin, download archivio e diagnostica.
- Listone, filtro Modifiche, export Admin e manifest listoni.
- Rose, schede giocatore e player.html.
- Competizioni e competition.html.
- Fantamercato interno, notifiche trattative reali e simulatore trade V255/V349.
- Diagnostica dati Admin con timestamp italiano V343.
- News/share WhatsApp e Netlify Functions.
- Navigazione mobile, bottom nav e menu Altro.
- Firebase/Auth/EmailJS.

## Nuovo strumento V356

Da console browser e possibile usare:

```js
ZonaOrientaleManualQaTrackerV356.print()
ZonaOrientaleManualQaTrackerV356.mark('calciomercato-feed', 'ok', 'feed e archivio visibili')
ZonaOrientaleManualQaTrackerV356.summary()
ZonaOrientaleManualQaTrackerV356.exportMarkdown()
ZonaOrientaleManualQaTrackerV356.reset()
```

I dati sono salvati solo in `localStorage` con chiave `zonaorientale.manualQa.v356`.

## Garanzia di preservazione

La V356 non cambia HTML strutturale, JSON, Netlify Functions, Firebase rules, archivi statici, Listone, Rose, Calciomercato o Admin. Aggiorna solo versione/cache-buster, documenti e strumenti di verifica.
