# FUNZIONALITAV336 - Stato funzionale da preservare

Documento operativo per V336. Non sostituisce `FUNZIONALITA'.md`, che resta protetto e non e' stato modificato.

## Novita V336

- Calciomercato: il tag giocatore introdotto in V335 non apre piu' una pagina separata.
- Il click sul tag giocatore apre una scheda/modal sovrapposta alla sezione Calciomercato.
- La scheda si chiude con:
  - tasto `X` in alto a destra;
  - click sullo sfondo;
  - tasto `Escape`.
- Rimossi dalla UI della timeline i tasti `Torna agli articoli` e `Torna al Calciomercato`, che potevano non funzionare in alcune condizioni di navigazione/hash.
- Restano invariati matching giocatore, pool articoli e lettura archivio statico.

## Funzionalita Calciomercato da preservare

- Recupero automatico articoli via Netlify Function `calciomercato-feed.js`.
- Parsing RSS classico e parsing HTML TMW squadra introdotto in V329.
- Fonti in `assets/calciomercato/links.json`.
- Archivio statico giornaliero in `assets/calciomercato/archive/`.
- `manifest.json` archivio con giorni disponibili e fonti rimosse.
- Pannello Solo Admin espandibile/riducibile.
- Download archivio giornaliero dal pannello Solo Admin.
- Filtri Cerca, Fonte, Squadra, Topic, Da, A.
- Caricamento articoli piu vecchi quando disponibile.
- Card compatte V332.
- Niente anteprima testo articolo nelle card V331.
- Da mobile niente pulsante `Apri articolo`, ma titolo/immagine restano cliccabili.
- Decodifica entita HTML V328/V334.
- Fallback immagini:
  - immagine articolo reale se presente;
  - favicon fonte se disponibile;
  - tile fonte;
  - tile testuale `TMW - NomeSquadra` per fonti TMW squadra senza immagine.
- Tag giocatore V335 basato sull'ultimo listone della stagione selezionata.
- Matching conservativo giocatore: nome completo o cognome univoco.
- Timeline articoli giocatore V336 in scheda/modal, non pagina separata.

## Funzionalita Listone da preservare

- Caricamento listoni per stagione.
- Ultimo listone della stagione selezionata.
- Ricerca giocatori.
- Filtri ruolo/squadra/status/modifiche.
- Colonna `Modifica`.
- Evidenza nuovi, rimossi, cambi ruolo/squadra/prezzo.
- Usciti storici.
- Export CSV modifiche solo Admin.
- Stile uniforme del filtro `Modifiche` V331/V333.
- `assets/css/refactor/listone.css` separato da V333.

## Funzionalita globali da preservare

- Home/dashboard pubblica.
- News e share WhatsApp.
- Rose e pagina squadra.
- Fantamercato interno/trattative.
- Dashboard Presidente.
- Admin completo e Admin leggero.
- Richieste presidenti.
- Diagnostica dati.
- Converti listone Excel.
- Competizioni e `competition.html`.
- Scheda giocatore standalone `player.html`.
- Archivio stagioni/statistiche/confronta.
- Firebase/Auth/EmailJS.
- Navigazione desktop.
- Bottom nav mobile e menu `Altro`.
- Pulsante `Su`/mobile chrome.
- Dark mode unico.

## Vincoli per futuri refactor

- Non cancellare codice legacy solo perche' sembra inutilizzato.
- Non modificare `docs/zonaorientale/FUNZIONALITA'.md` salvo richiesta esplicita.
- Non rinominare ID DOM o classi usate da JS senza grep completo.
- Ogni release deve aggiornare footer, cache-buster e `DEPLOY_EXPECTED_VERSION_V181`.
- Ogni release deve includere handoff, `FUNZIONALITAVxxx.md` e doc release/refactor utile.
- Se si tocca Netlify, includere `netlify/` nello zip e dichiararlo nella consegna.

## Test minimi

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/js/calciomercato/calciomercato-players-v335.js
static/zonaorientale/tools/check-zonaorientale.sh
static/zonaorientale/tools/audit-assets-v298.sh
static/zonaorientale/tools/audit-css-v300.sh
```
