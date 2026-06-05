# FUNZIONALITAV344 - Cleanup JS legacy Calciomercato player

Versione: V344  
Data: 05/06/2026

## Obiettivo

La V344 prosegue il refactor protetto con la rimozione controllata dei vecchi moduli JS Calciomercato player superati:

```text
assets/js/calciomercato/calciomercato-players-v335.js
assets/js/calciomercato/calciomercato-players-v337.js
```

Il runtime usa gia il modulo attivo:

```text
assets/js/calciomercato/calciomercato-players-v340.js
```

La rimozione non cambia comportamento utente: i nomi storici delle funzioni restano in `assets/app.js` come wrapper di compatibilita.

Il file canonico `FUNZIONALITA'.md` non e stato modificato.

## Funzionalita preservate

- Dashboard pubblica e navigazione principale.
- Menu mobile, bottom navigation, menu Altro e pulsante Su.
- Tema Dark unico e Light mode sospesa.
- News e share WhatsApp dinamico.
- Listone pubblico e Admin, filtro Modifiche, colonna Modifica, usciti storici, export CSV solo Admin.
- Rose pubbliche, pagina squadra, dettagli rosa e tabelle mobile.
- Fantamercato interno e flussi presidente.
- Dashboard Presidente.
- Admin generale: login, rendering pannelli, attach handlers, richieste presidenti, convertitore listone, diagnostica dati.
- Diagnostica dati Admin con timestamp ultimo refresh V343.
- Calciomercato: feed RSS/HTML, TMW squadre, archivio statico, Solo Admin, download JSON, filtri, card compatte, fallback immagini, tag giocatore, timeline modal.
- Netlify Functions `news-share.js` e `calciomercato-feed.js`.
- Firebase, Auth, EmailJS.
- Pagine standalone `competition.html` e `player.html`.

## Calciomercato player matching/timeline

Restano attivi:

```text
assets/js/calciomercato/calciomercato-players-v340.js
renderCalciomercatoPlayerTagsV335()
activateCalciomercatoPlayerTimelineFromHashV335()
normalizeCalciomercatoPlayerMatchValueV337()
window.ZonaOrientaleCalciomercatoPlayersV335
window.ZonaOrientaleCalciomercatoPlayerMatchingV340
window.ZonaOrientaleCalciomercatoPlayerModalV336
```

Il fatto che alcune funzioni mantengano suffissi V335/V337 e intenzionale: sono wrapper pubblici usati dal runtime e dai refactor successivi. Non vanno rinominati senza piano dedicato.

## File rimossi

La V344 rimuove solo questi candidati gia superati da V340:

```text
assets/js/calciomercato/calciomercato-players-v335.js
assets/js/calciomercato/calciomercato-players-v337.js
```

Se si applica lo zip con `cp -R`, la cancellazione va fatta con `git rm`, perche lo zip non puo eliminare file gia presenti nella repo locale.

## Nuovo tool

```bash
static/zonaorientale/tools/audit-js-legacy-v344.mjs
```

Verifica che:

- i moduli attivi Calciomercato siano presenti;
- i moduli player V335/V337 siano rimossi;
- `app.js` importi V340;
- i wrapper compatibili restino presenti;
- la diagnostica V344 sia esposta.

## Diagnostica runtime

```js
window.ZonaOrientaleJsLegacyCleanupV344.runSmokeTest()
```

## Regole per il prossimo assistente AI

- Non ripristinare `calciomercato-players-v335.js` o `calciomercato-players-v337.js` salvo rollback esplicito.
- Non rinominare i wrapper V335/V337 rimasti in `app.js` senza audit completo.
- Non toccare `FUNZIONALITA'.md` senza richiesta esplicita.
- Preservare tutte le funzionalita dell'ultimo merge su master.
