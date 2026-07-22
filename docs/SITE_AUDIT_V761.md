# Site Audit V761 - blocco del thread principale

## Sintomo

La home mostrava il footer V760 ma restava in caricamento. In Chrome DevTools la Console accettava il testo ma non eseguiva Invio. Mettendo in pausa JavaScript, Chrome si fermava ripetutamente nel file condiviso:

`fanta-engine/js/shared/v489/assets/js/core/admin-card-visibility-v456.js`

all'interno della funzione `decorate()` dell'hardfix V755.

## Causa esatta

L'hardfix V755 conteneva contemporaneamente:

```js
function decorate() {
  const eyebrow = control.querySelector(...);
  if (eyebrow) eyebrow.textContent = 'Visibilità Admin · V755';
}

new MutationObserver(decorate).observe(document.documentElement, {
  childList: true,
  subtree: true
});
```

L'assegnazione a `textContent` sostituisce il nodo di testo e genera una mutazione `childList`. L'observer vede la mutazione, richiama `decorate()`, che modifica di nuovo `textContent`, generando una nuova mutazione. Il browser entra in una catena infinita di microtask e il thread principale non torna mai libero.

Per questo:

- il sito rimaneva in caricamento;
- il bootstrap statico non arrivava al render utile;
- i comandi della Console non venivano eseguiti;
- il controllo HTTP V760 risultava comunque tutto verde.

## Correzione V761

1. Rimosso l'observer globale ricorsivo `MutationObserver(decorate)`.
2. Eliminata ogni scrittura ripetuta a `textContent` dalla decorazione.
3. La decorazione ora aggiunge una sola classe CSS idempotente al contenitore.
4. Il nuovo observer esamina esclusivamente gli `addedNodes` e interviene solo se il selettore admin viene aggiunto o ricreato.
5. La decorazione è accodata con un solo `requestAnimationFrame`.
6. Rimosso il doppio listener `pointerup` + `click`, che poteva invertire due volte la stessa checkbox.
7. Allineate byte-per-byte la copia FantaEngine e i fallback locali di ZonaOrientale e FantaPetillo.
8. Aggiunto cache-buster V761 su JS e CSS condivisi.
9. Aggiunto audit pre-build e post-build che impedisce la ricomparsa dei pattern bloccanti.
10. Aggiunto controllo live V761 sul contenuto effettivamente pubblicato.

## Ruolo del FantaEngine

Il problema era nel file condiviso del FantaEngine, non nel loader dati. Poiché ZonaOrientale e FantaPetillo caricano per prime le copie condivise, un errore nel runtime comune può bloccare tutte le leghe anche quando snapshot e bootstrap sono corretti.

La V761 mantiene la centralizzazione nel FantaEngine, ma rende identici anche i fallback locali. In questo modo:

- il comportamento è uniforme tra le leghe;
- il fallback non reintroduce una versione differente;
- un audit confronta automaticamente le tre copie.

## ioSudo

ioSudo non è coinvolta in questo blocco. È un consumer autonomo dei dataset del FantaEngine e non carica il modulo `admin-card-visibility-v456.js` della home delle leghe.

## Verifica dopo il deploy

```bash
node static/zonaorientale/tools/check-live-v761.mjs https://silviobarra.com
```

In Chrome:

```js
window.LeagueAdminCardCheckboxHardfixV761
window.ZonaOrientaleBootstrapV760
window.ZonaOrientaleModuleEntryV760
```

Il primo oggetto deve avere:

```js
{
  version: 'V761',
  observerMode: 'targeted-added-nodes'
}
```
