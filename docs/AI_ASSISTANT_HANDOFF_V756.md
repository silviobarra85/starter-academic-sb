# AI Assistant Handoff V756

## Obiettivo
Fix del blocco mobile del sito ZonaOrientale sul preloader percentuale.

## Problema osservato
Da smartphone il sito restava bloccato su `Caricamento lega` a percentuali diverse, ad esempio 33% o 91%. Il loader V699 era troppo dipendente dal segnale `fanta:app-rendered-v560` e non aveva una rimozione hard abbastanza aggressiva per mobile/cache.

## Soluzione
- Nuovo `boot-preloader-v756.js` con timeout mobile più breve e `forceHide` che imposta anche `display:none!important`.
- Nuovo `boot-preloader-v756.css` con classe `is-force-hidden-v756`.
- Inline guard in `index.html` che rimuove il loader anche se il file boot esterno non entra correttamente.
- Append in `app.js` con `ZonaOrientaleMobileBootHardfixV756`, segnale ready e footer V756.

## Verifiche
Controllare che online carichi:
- `boot-preloader-v756.js?v=756`
- `app.js?v=756`

Console:
```js
window.ZonaOrientaleBootPreloaderV756
window.ZonaOrientaleMobileBootHardfixV756
window.forceHideBootV756('manual')
```

## Nota
Questo fix non cambia Firebase, dati, router o ioSudo. Serve solo a impedire che l'overlay di caricamento blocchi l'uso del sito mobile.
