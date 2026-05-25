# AI Handoff ZonaOrientale - Current V216

## Stato corrente

Versione corrente: V216.

V216 estende le classifiche delle competizioni a classifica/campionato: Admin, vista pubblica e pagina singola competizione supportano e visualizzano le colonne complete nell'ordine POS, SQUADRA, PUNTI, PG, V, N, P, GF, GS, DR, FPT.

## Regole operative

- Aggiornare sempre `Version` nel footer e cache-buster ad ogni overlay.
- Includere sempre un handoff AI per ogni overlay.
- Verificare sempre da mobile le nuove funzionalità.
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
