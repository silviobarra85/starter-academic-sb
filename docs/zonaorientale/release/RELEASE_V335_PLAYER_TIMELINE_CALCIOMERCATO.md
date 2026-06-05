# Release V335 - Player timeline Calciomercato

## Tipo release

Refactor protetto + feature isolata Calciomercato.

## Modifiche

- Nuovo modulo `assets/js/calciomercato/calciomercato-players-v335.js`.
- Tag giocatore nelle card articolo sopra il titolo.
- Route interna `#calciomercato-player-<slug>`.
- Pagina timeline dinamica per gli articoli collegati al giocatore.
- Check script aggiornato con controllo V335.
- Versione/cache-buster/footer aggiornati a V335.

## Funzionalita preservate

- Feed RSS/HTML Calciomercato.
- Archivio statico Calciomercato.
- Fallback immagini V334/V330/V328.
- Card compatte V332.
- Solo Admin V327.
- Listone, filtro Modifiche, export CSV solo Admin.
- Rose, Fantamercato, Dashboard Presidente, Admin, Firebase/Auth/EmailJS.
- Mobile navigation.

## Test consigliati

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/js/calciomercato/calciomercato-players-v335.js
static/zonaorientale/tools/check-zonaorientale.sh
static/zonaorientale/tools/audit-assets-v298.sh
static/zonaorientale/tools/audit-css-v300.sh
```

## Verifica browser

- Aprire Calciomercato.
- Verificare tag giocatore dove il titolo/testo contiene un giocatore del listone.
- Cliccare il tag e aprire la timeline.
- Tornare al Calciomercato.
- Verificare Listone e mobile.
