# ioSudo V628

Aggiornamento fonti articolo puntuali.

## Cosa cambia
- Le chip fonte in dettaglio giocatore, rumor, ufficialita, SOS e amichevoli puntano all'articolo o pagina specifica.
- `sourceHref` usa prima `articleUrl`/`url`/`source` se e un URL valido, senza sostituirlo con homepage generiche.
- Conservate le funzioni V626: vista GIOCATORI, click su card, dettaglio giocatore, listone recente, rose live.

## Audit
`node static/fanta-engine/tools/audit-iosudo-v628.mjs`


## Audit fonti V628
- Righe recupero fonti: 50
- Recuperi OK: 23
- Da verificare nel recupero: 27
- Righe ancora senza articolo preciso nel file: 43
- Occorrenze rese non cliccabili nel JSON: 256
