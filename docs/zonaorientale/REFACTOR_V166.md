# V166 - Rifiniture mobile UI

Data: 2026-05-21
Branch: `feature/zonaorientale-competizioni-statiche`

## Obiettivo

Rifinire alcune parti della nuova esperienza mobile senza modificare la vista desktop.

## Modifiche

- Aggiunte icone/emoticon alle voci del menu mobile `Altro`.
- Compattati i pulsanti mobile in header (`Dark/Light`, `Account`, `Logout`) per farli stare su una singola riga quando l'utente e loggato.
- In `Area squadra`, le metriche `Utente`, `Ruolo`, `Stato` vengono mostrate su una sola riga da mobile.
- Nella scheda squadra mobile, i dettagli della squadra sono resi come contenuto principale del blocco, evitando l'effetto blocco dentro blocco.
- Nella rosa della scheda squadra mobile, la colonna `Giocatore` viene ridotta del 15% rispetto alla dimensione precedente.
- Standardizzate varie larghezze dei blocchi mobile per allinearle alla larghezza del blocco titolo.
- In mobile, `News` e `Palmares per competizioni` hanno blocchi scuri con testo bianco.
- Nella pagina della singola competizione e stato aggiunto un tasto fisso in alto a sinistra `Su` per tornare rapidamente all'inizio.

## File coinvolti

```text
static/zonaorientale/index.html
static/zonaorientale/competition.html
static/zonaorientale/assets/app.js
static/zonaorientale/assets/css/mobile-hotfix-v166.css
```

## Note

- Nessuna modifica a Firebase.
- Nessuna modifica alle regole Firestore.
- Le modifiche sono limitate alla UI mobile tramite media query e classi `is-mobile-ux`.
- Desktop invariato.
