# Overlay V691 - Profili mobile responsive e footer

Overlay solo sito.

## Modifiche

- Corregge le card mobile di `Ultimi movimenti` e `Ultimi comunicati` nei profili squadra.
- Le card non devono più sforare a destra su smartphone.
- Aggiunge CSS più aggressivo per `max-width`, `min-width:0`, `box-sizing:border-box` e wrapping dei testi lunghi.
- Aggiorna `app.js` a cache-buster `v=691`.
- Aggiorna `site-performance-v691.css`.
- Aggiunge una guardia robusta sul footer per impedire che vecchie routine lo riportino a V667.

## Non modifica

- ioSudo.
- Dati, listoni e rose JSON.
- Desktop: il layout desktop resta invariato.
