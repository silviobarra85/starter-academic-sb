# ioSudo V627

Aggiornamento fonti articolo puntuali.

## Cosa cambia
- Le chip fonte in dettaglio giocatore, rumor, ufficialita, SOS e amichevoli puntano all'articolo o pagina specifica.
- `sourceHref` usa prima `articleUrl`/`url`/`source` se e un URL valido, senza sostituirlo con homepage generiche.
- Conservate le funzioni V626: vista GIOCATORI, click su card, dettaglio giocatore, listone recente, rose live.

## Audit
`node static/fanta-engine/tools/audit-iosudo-v627.mjs`


Nota V627: 335 occorrenze con fonte generica/homepage marcata DA VERIFICARE sono state lasciate non cliccabili per evitare link a fonti generiche al posto dell'articolo puntuale.
