# AI Assistant Handoff V650

## Contesto

L'utente ha segnalato che ioSudo è ancora lento, soprattutto nella navigazione tra sezioni.

## Cosa è stato fatto

Creato overlay V650 solo performance, senza aggiornamento dataset.

### Modifiche tecniche

- Nuovo JS `iosudo-app-v650.js`.
- Nuovo CSS `iosudo-app-v650.css`.
- `index.html` aggiornato a V650.
- `sw.js` aggiornato a cache `iosudo-shell-v650`.
- Aggiunta cache in memoria per viste globali già calcolate.
- Aggiunto rendering progressivo con `Mostra altre voci`.
- Ridotto carico iniziale della vista GIOCATORI.
- Eliminato riaggancio di listener sul pannello focus a ogni render.
- Aggiunto `content-visibility: auto` per ridurre costi di painting/scrolling.
- Migliorato service worker per usare network-first sulla shell HTML.

## Cosa NON è stato fatto

- Non sono stati modificati i dati V649/V23.
- Non è stata riattivata la sezione pubblica Per i SUDATORI.
- Non sono stati cambiati listoni, rose, manifest o dataset Sudatori.

## Possibile step futuro

Se su smartphone l'app resta lenta, lo step successivo è una virtualizzazione reale delle liste: mantenere nel DOM solo le card visibili nel viewport, non solo limitare a blocchi con `Mostra altre voci`.
