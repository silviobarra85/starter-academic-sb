# Handoff V398 - Rimozione sezione Soccer Data

## Obiettivo
Rimuovere la sezione Soccer Data dalla navigazione e dall'accesso diretto, perché al momento il flusso dati/API non è sostenibile con i limiti del provider gratuito.

## Ambito modifica
- Rimossi link desktop/mobile verso Soccer Data.
- Rimossa la sezione `data-page="soccerdata"` da `index.html`.
- Aggiunto guard V398 in `assets/app.js`: eventuale accesso diretto a `#soccerdata` viene reindirizzato al Listone.
- Footer/cache-buster aggiornati a V398.

## Funzionalità preservate
- Dashboard
- News
- Rose
- Fantamercato
- Calciomercato
- Listone
- Competizioni
- Albo d'Oro/FIFA Ranking
- Statistiche
- Archivio
- Confronta
- Regolamento
- Admin

## Note
Il codice legacy Soccer Data rimane non esposto e inerte nel bundle per minimizzare il rischio di regressioni. Per una pulizia fisica della repo è possibile rimuovere da Git gli asset e le funzioni non più usate con i comandi indicati nel rilascio V398.

`FUNZIONALITA'.md` non è stato modificato.
