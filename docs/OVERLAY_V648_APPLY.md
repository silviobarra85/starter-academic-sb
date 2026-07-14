# Overlay V648 - ioSudo: rimozione GIOCATORI nelle schede squadra e fix date Excel

## Scopo

Overlay mirato per ioSudo. Non aggiorna i dati Sudatori e non modifica le rose/listoni.

## Modifiche

- aggiorna la shell ioSudo a `648`;
- crea `iosudo-app-v648.js` e `iosudo-app-v648.css`;
- aggiorna `static/iosudo/index.html` e `static/iosudo/sw.js` con cache-buster V648;
- rimuove dalla scheda squadra la vista/tab giocatori di squadra (`Rosa`);
- nasconde i risultati globali mentre una scheda squadra o giocatore e aperta, cosi la vista globale `GIOCATORI` resta disponibile solo nella home dell'app;
- corregge la gestione delle date seriali Excel come `46216`, evitando la conversione errata in anni estesi tipo `+046216-01`;
- aggiunge audit `audit-iosudo-v648.mjs`.

## Applicazione manuale

```bash
rm -rf ~/Downloads/fantacalcio_overlay_iosudo_v648_fix_giocatori_date
unzip -o ~/Downloads/fantacalcio_overlay_iosudo_v648_fix_giocatori_date.zip -d ~/Downloads/

cp -R ~/Downloads/fantacalcio_overlay_iosudo_v648_fix_giocatori_date/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_iosudo_v648_fix_giocatori_date/docs/* docs/
```

## Controlli

```bash
node static/fanta-engine/tools/audit-iosudo-v648.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v648.js
node --check static/iosudo/sw.js
```

## Commit suggerita

```bash
git add static docs
git commit -m "Corregge ioSudo schede squadra e date V648"
git push origin master
```
