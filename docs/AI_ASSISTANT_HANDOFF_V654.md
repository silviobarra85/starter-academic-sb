# AI Assistant Handoff V654

V654 aggiorna ioSudo con Excel v24 e conserva lo stato precedente:

- Per i SUDATORI pubblico resta disattivato.
- ioSudo continua a usare `static/fanta-engine/data/sudatori/current/sudatori-data.json`.
- La vista GIOCATORI mantiene i giocatori del listone, Serie A, rose fantasy e giocatori presenti solo in rumor/ufficialità.
- Le liste pesanti restano leggere a blocchi, con cache.
- Dettaglio giocatore usa cache e non deve rieseguire scansioni globali pesanti a ogni click.
- Novità V654: badge fonti compatti. URL lunghi come `https://www.gianlucadimarzio.com/...` devono essere visualizzati come `Gianluca Di Marzio`, non come URL integrale.

Audit principale: `node static/fanta-engine/tools/audit-iosudo-v654.mjs`.
