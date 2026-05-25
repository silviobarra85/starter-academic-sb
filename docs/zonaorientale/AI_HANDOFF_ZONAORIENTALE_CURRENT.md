# AI Handoff ZonaOrientale - Current V219

## Stato corrente

Versione corrente: V219.

V219 uniforma la UI mobile e ripristina il rendering delle pagine storiche pubbliche. Il pulsante "Su" è ora globale, più curato, visibile solo da smartphone dopo scroll verso il basso e nascosto automaticamente quando si torna in cima. Il bottom menu è vincolato agli smartphone e non deve comparire da desktop.

V219 corregge anche Archivio, Statistiche e Confronta: il modulo V211 viene installato realmente, le superfici storiche vengono renderizzate nel ciclo `renderAll()`, e l'Archivio V196/V209 viene richiamato dopo il caricamento dati.

La classifica delle competizioni di tipo campionato/classifica supporta e visualizza le colonne nell'ordine: POS, SQUADRA, PUNTI, PG, V, N, P, GF, GS, DR, FPT.

## Regole operative

- Aggiornare sempre `Version` nel footer e cache-buster ad ogni overlay.
- Includere sempre un handoff AI per ogni overlay.
- Consegnare un solo zip con dentro le cartelle `zonaorientale/` e `docs/`, includendo solo i file effettivamente modificati.
- Verificare sempre da mobile le nuove funzionalità.
- Quando si modifica un modulo importato da `app.js`, valutare anche il cache-buster nello static import.
- Per lanciare in locale, se ci si trova in `static/zonaorientale`:

```bash
cd ..
python3 -m http.server 1313 --bind 0.0.0.0
```

Poi aprire:

```text
http://localhost:1313/zonaorientale/
```

## Architettura dati

- Dati storici/pesanti: JSON statici e snapshot stagione.
- Comunicati/news: Firebase live in background.
- Fantamercato/trattative: Firebase live/lazy.
- Admin completo: caricato solo su richiesta.
- I risultati classifica campionato salvano i campi canonici `points`, `played`, `wins`, `draws`, `losses`, `goalsFor`, `goalsAgainst`, `goalDifference`, `fantapoints`.

## Refactor recenti attivi

- V209: modulo live data / archivio.
- V210: generatore comunicati admin.
- V211: statistiche storiche e confronta squadre, installato in V219 nel bootstrap reale.
- V212: dashboard presidente e helper rose.
- V213: workflow pubblicazione admin, disattivato in V214 per stabilità.
- V215: ripristino helper Archivio V196 necessari agli override V204/V209.
- V216: classifica campionato completa, con tabella mobile scrollabile e Admin risultati esteso.
- V217: cache-buster reale per modulo Admin competizioni e pagina singola competizione.
- V219: pulsante "Su" globale mobile-only, bottom menu solo smartphone, render Archivio/Statistiche/Confronta.

## Note V219

- `competition.html` non deve partire più con `body.is-mobile-ux`: la classe viene assegnata a runtime solo se il viewport è smartphone.
- Il rilevamento mobile in `assets/js/mobile/mobile-viewport.js` è basato su larghezza `<= 900px`, non su `pointer: coarse`.
- `stats`, `archive` e `compare` sono hash statici e non devono essere trattati come slug squadra.


## V219 - Hotfix archivio stagioni
- Ripristinati `getSeasonSortValueV193`, `getSeasonLabelV193` e `HISTORICAL_COMPETITIONS_V193` nel bundle principale.
- Risolve il `ReferenceError: getSeasonSortValueV193 is not defined` che impediva il rendering di Archivio dopo il richiamo introdotto in V218.
- Aggiornati cache-buster e footer a V219.
