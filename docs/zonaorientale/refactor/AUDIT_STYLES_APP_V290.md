# V290 - Audit `styles.css` e `app.js`

> Obiettivo: preparare un refactor conservativo di `assets/styles.css` e `assets/app.js` senza perdere funzionalita' esistenti.
>
> Questa release non cambia comportamento runtime: aggiunge una mappa di rischio e una diagnostica di checkpoint.

## Stato file al checkpoint V290

| File | Righe | Dimensione indicativa | Note |
| --- | ---: | ---: | --- |
| `assets/styles.css` | 14.690 | 435 KB | CSS storico + patch mobile/recenti V280-V289. |
| `assets/app.js` | 23.302 | 1.095 KB | Bundle principale storico, 782 funzioni dichiarate circa. |

Indicatori rilevati:

- `styles.css` contiene circa 2.070 blocchi/regole CSS e molte regole `@media` ripetute per mobile.
- Le patch recenti CSS V280-V289 sono concentrate nella coda del file.
- `app.js` contiene ancora molte patch storiche Vxxx, override e fallback: non va alleggerito con cancellazioni dirette.
- Gli import critici di `app.js` usano cache-buster e vanno mantenuti allineati alla versione deploy.

## Blocchi CSS recenti da proteggere

Nel refactor CSS non perdere questi blocchi/funzioni visive:

- V280: semplificazione UI del Listone, con pannello `Storico listoni` nascosto ma logiche V269-V278 conservate.
- V281/V285: contrasto mobile e leggibilita' generale.
- V286: fix prima colonna sticky mobile.
- V287: rifinitura controlli mobile, input, select, bottoni, focus e bottom navigation.
- V288: fix rose mobile Light, utile come riferimento se Light verra' ripresa.
- V289: Dark mode temporaneo, toggle tema nascosto e rose mobile compatte.

## Funzionalita' a rischio e come preservarle

### Listone

Da non perdere:

- colonna `Modifica`;
- filtro `Modifiche`;
- `Mostra usciti storici`;
- export CSV modifiche;
- normalizzazione codici squadra V274;
- dati storici V269-V278 usati sotto il cofano anche se il pannello `Storico listoni` e' nascosto.

Presidio:

- prima di spostare CSS Listone, testare tabella, filtri, export e scroll mobile;
- non eliminare funzioni `V269`, `V270`, `V277`, `V278` da `app.js` senza audit dedicato.

### Rose e pagina squadra

Da non perdere:

- tabella Rosa pubblica;
- pagina squadra standalone;
- Dashboard Presidente con rosa;
- prima colonna sticky leggibile;
- righe compatte e contenuto centrato verticalmente da mobile.

Presidio:

- qualsiasi CSS su tabelle deve essere verificato su `Rose`, pagina squadra e Dashboard Presidente;
- mantenere test in Dark mode, dato che Light e' sospesa temporaneamente.

### Mobile chrome

Da non perdere:

- bottom navigation solo smartphone;
- menu mobile `Altro`;
- pulsante globale `Su`;
- modal e sheet che non devono restare aperti passando desktop/mobile.

Presidio:

- non modificare `mobile-chrome-v220.js`, `mobile-chrome-v223.css` o regole correlate senza test desktop/mobile.

### Admin

Da non perdere:

- `Admin -> Richieste presidenti`;
- `Admin -> Diagnostica dati`;
- `Admin -> Converti listone Excel`;
- workflow pubblicazione Admin inline;
- generatore comunicati automatici.

Presidio:

- non estrarre codice Admin da `app.js` prima di una mappa funzioni dedicata;
- testare i pannelli Admin dopo qualsiasi modifica CSS generale a card, form, tabelle, button o toolbar.

### Presidente

Da non perdere:

- Dashboard Presidente;
- trattative e notifiche;
- comunicato squadra;
- comunicato avvenuto scambio;
- svincola giocatori;
- lettura esiti trattative multi-dispositivo quando le Firebase Rules V257 sono pubblicate.

Presidio:

- non toccare Auth/Firebase/trattative in un refactor CSS;
- testare Dashboard Presidente dopo ogni modifica a layout mobile, form e tabelle.

### News / share WhatsApp

Da non perdere:

- link `/zonaorientale/share/news/<id>`;
- redirect a `#news-<id>`;
- pulsante `Copia link WhatsApp`;
- home con meta generici, non ultima news.

Presidio:

- non toccare `news.html`, `comunicati/*.html`, `tools/generate-news-share-pages.mjs` senza audit di compatibilita'.

## Linee guida per pulire `styles.css`

### Passo sicuro consigliato V291

Estrarre solo blocchi recenti e isolabili in file dedicati, mantenendo ordine di import finale:

```text
assets/css/refactor/mobile-fixes-v291.css
assets/css/refactor/rosters-tables-v291.css
```

Regola: prima copiare il blocco, testare, poi rimuovere il duplicato da `styles.css` solo se il risultato visivo e' invariato.

### Non fare in V291

- Non riscrivere tutta la struttura CSS.
- Non dividere subito tutto in `dark-mobile`, `dark-desktop`, `light-mobile`, `light-desktop`.
- Non rimuovere il CSS Light: archiviarlo/separarlo piu' avanti, perche' la Light mode verra' ripresa.
- Non cambiare nomi classe/ID usati dal JavaScript.

## Linee guida per pulire `app.js`

### Passo sicuro consigliato V293/V294

Prima creare una mappa delle funzioni e poi estrarre solo helper puri:

```text
assets/js/utils/text-utils-v294.js
assets/js/utils/export-utils-v294.js
assets/js/utils/version-diagnostics-v294.js
```

Candidati iniziali:

- escape/normalizzazione testo solo se non gia' centralizzati;
- CSV/download file;
- diagnostiche di versione;
- helper senza accesso a Firebase, DOM complesso o `state` globale.

### Non fare in V290-V294

- Non toccare `renderAll`.
- Non toccare bootstrap, Auth o inizializzazione Firebase.
- Non spostare Listone completo, Admin completo o Dashboard Presidente in un unico refactor.
- Non rimuovere override storici Vxxx solo perche' sembrano duplicati.

## Checklist regressione prima di qualunque estrazione

- Home pubblica.
- News e link WhatsApp.
- Listone: filtri, `Modifiche`, export CSV, usciti storici.
- Rose e pagina squadra da mobile.
- Competizioni e classifica campionato.
- Archivio, Statistiche, Confronta.
- Dashboard Presidente.
- Admin: Richieste presidenti, Diagnostica dati, Converti listone Excel.
- Mobile: bottom navigation, menu Altro, pulsante Su.
- Dark mode: tema unico attuale dopo V289.

## Diagnostica runtime

```js
window.ZonaOrientaleStylesAppAuditV290
```

## Conclusione operativa

La prossima modifica consigliata e' V291: separazione prudente dei CSS mobile/rose/tabelle, con confronto visivo prima/dopo e senza toccare `app.js`.
