# V180 - Checklist online finale

## Obiettivo
Consolidare il pre-online con una checklist eseguibile dall'admin che non scrive su Firebase e non carica collection aggiuntive.

## Modifiche
- Aggiornata la Version nel footer a `V180 checklist online finale`.
- Aggiornati i cache-buster di `styles.css`, `mobile-suite-v168.css` e `app.js` a `v=180`.
- Aggiunto il bottone `Checklist online finale` in Admin:
  - nella schermata admin leggero;
  - nel pannello Backup dopo il caricamento admin completo.
- Aggiunto `window.ZonaOrientaleDeploy` per lanciare la checklist da console.

## Cosa controlla la checklist
La checklist finale verifica:
- coerenza tra footer `V180` e cache-buster asset `v=180`;
- esito del preflight asset pubblici statici introdotto in V179;
- modalità admin corrente, segnalando se il full-load admin è già stato caricato;
- letture Firebase stimate nella sessione;
- diagnostica letture attiva in locale.

## Console
```js
ZonaOrientaleDeploy.check()
ZonaOrientaleDeploy.last()
ZonaOrientaleDeploy.runtime()
```

## Nota operativa
Prima del deploy finale conviene eseguire:
1. test pubblico anonimo/incognito;
2. test login presidente;
3. test admin leggero senza premere `Carica dati amministrazione`;
4. test admin completo solo quando serve modificare o generare snapshot.

## Test eseguiti
- `node --check assets/app.js`
- `find assets -type f -name '*.js' -print0 | xargs -0 -n 1 node --check`
- `find assets -type f -name '*.json' -print0 | xargs -0 -n 1 python3 -m json.tool`
- server statico locale con verifica asset principali.
