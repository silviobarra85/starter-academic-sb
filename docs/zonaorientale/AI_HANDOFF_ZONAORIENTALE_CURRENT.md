# AI Handoff ZonaOrientale - Current V217

## Stato corrente

Versione corrente: V217.

V217 corregge il rilascio V216 della classifica campionato completa: il modulo Admin risultati competizioni viene ora importato con cache-buster esplicito da `app.js`, e i link “Apri competizione” aggiungono `v=217` alla query della pagina singola `competition.html`. Questo evita che browser/GitHub Pages continuino a servire il vecchio modulo Admin o la vecchia pagina competizione con sole colonne POS/Squadra/Punti/PG/FPT.

La classifica delle competizioni di tipo campionato/classifica supporta e visualizza le colonne nell'ordine: POS, SQUADRA, PUNTI, PG, V, N, P, GF, GS, DR, FPT.

## Regole operative

- Aggiornare sempre `Version` nel footer e cache-buster ad ogni overlay.
- Includere sempre un handoff AI per ogni overlay.
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
- V211: statistiche storiche e confronta squadre.
- V212: dashboard presidente e helper rose.
- V213: workflow pubblicazione admin, disattivato in V214 per stabilità.
- V215: ripristino helper Archivio V196 necessari agli override V204/V209.
- V216: classifica campionato completa, con tabella mobile scrollabile e Admin risultati esteso.
- V217: cache-buster reale per modulo Admin competizioni e pagina singola competizione.
