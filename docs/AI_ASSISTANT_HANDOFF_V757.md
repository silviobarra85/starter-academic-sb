# AI Assistant Handoff V757

## Stato
Overlay V757 dedicato a sbloccare il sito ZonaOrientale da mobile.

## Decisione importante
Il preloader iniziale e' stato disattivato completamente. Non reintrodurre overlay percentuale
finche' non si capisce la causa del blocco mobile.

## Modifiche
- rimosso markup `#fantaBootPreloader` da `static/zonaorientale/index.html`;
- rimosso caricamento `boot-preloader-v756.css/js`;
- aggiunto hard-disable inline V757 per neutralizzare eventuali classi/cache residue;
- aggiornato `app.js?v=757`;
- aggiunta API debug `window.forceHideBootV757()` e `window.ZonaOrientaleNoBootLoaderV757`;
- footer aggiornato a V757.

## Controlli post deploy
Da browser/mobile:
```js
document.querySelector('#fantaBootPreloader')
document.querySelector('script[src*="app.js"]')?.src
window.ZonaOrientaleNoBootLoaderV757
```
Il primo deve essere `null`, il secondo deve contenere `app.js?v=757`.
