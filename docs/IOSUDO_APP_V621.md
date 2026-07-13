# ioSudo V621

V621 mantiene le viste rapide globali introdotte in V620: `SQUADRE`, `SOS`, `RUMOR`, `UFFICIALITÀ`, `AMICHEVOLI`.

L'app legge i dati aggiornati V621 da `static/fanta-engine/data/sudatori/current/manifest.json` e continua a leggere le rose live dai file `assets/rose/` della lega.

Non è richiesta reinstallazione della PWA: dopo il deploy basta chiudere e riaprire l'app, oppure fare refresh dal browser in caso di cache vecchia.
