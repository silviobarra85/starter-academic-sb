# Release V323 - Archivio statico Calciomercato

## Sintesi

V323 introduce l'archivio statico giornaliero del Calciomercato e i download JSON disponibili solo agli Admin direttamente dalla pagina `Calciomercato`.

## Modifiche

- Aggiunto `assets/calciomercato/archive/manifest.json` iniziale.
- Il frontend fonde feed RSS live e JSON statici giornalieri.
- Aggiunta deduplica stabile tramite URL normalizzato o fallback fonte/giorno/titolo.
- Aggiunto riquadro Admin nella pagina Calciomercato per scaricare JSON giorno/intervallo.
- Aggiornati cache-buster e footer a V323.

## Funzionalita preservate

- Feed RSS automatico Calciomercato.
- Fallback statico `links.json`.
- Filtri Squadre / Topic / Fonti.
- Ricerca libera.
- Range Da/A.
- Caricamento articoli piu vecchi.
- Layout mobile compatto.
- Riconoscimento squadre/giocatori/allenatori V320.
- Fantamercato interno.
- Listone pubblico/Admin ed export CSV solo Admin.
- Rose, Dashboard Presidente, Admin, Firebase/Auth/EmailJS.

## Test prioritari

```text
static/zonaorientale/tools/check-zonaorientale.sh
node --check netlify/functions/calciomercato-feed.js
node --check netlify/functions/news-share.js
```

Manuale:

```text
Calciomercato pubblico non Admin: nessun riquadro download.
Calciomercato Admin: riquadro download visibile.
Download giorno: genera YYYY-MM-DD.json + manifest.json.
Download intervallo: genera un JSON per giorno + manifest.json.
Dopo copia in archive/: gli articoli statici vengono caricati automaticamente.
Nessun doppione tra live e statico.
```
