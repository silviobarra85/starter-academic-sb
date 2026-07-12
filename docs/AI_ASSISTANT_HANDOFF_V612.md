# AI Assistant Handoff - V612

## Stato

- Overlay corrente: **V612**.
- App: **ioSudo PWA**.
- Dati: restano condivisi con **Per i SUDATORI** tramite `static/fanta-engine/data/sudatori/current/manifest.json`.
- JS app: `static/fanta-engine/js/apps/iosudo-app-v612.js`.
- CSS app: `static/fanta-engine/css/iosudo-app-v612.css`.

## Modifiche V612

- Le card squadre nella home di ioSudo sono colorate a righe secondo i colori sociali richiesti.
- Gestite classi tema per: Atalanta/Inter, Bologna/Cagliari/Genoa, Lazio/Napoli, Como, Juventus/Udinese, Lecce/Roma, Frosinone, Monza, Fiorentina, Milan, Parma, Torino, Venezia, Sassuolo.
- Testi e badge delle card squadra restano leggibili con colore dedicato: bianco, nero, rosso o blu scuro secondo la squadra.
- Nessuna modifica ai dati Sudatori, ai JSON mercato, alle rose o alla logica di aggiornamento Excel.

## Verifica

```bash
node static/fanta-engine/tools/audit-iosudo-v612.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v612.js
node --check static/iosudo/sw.js
```
