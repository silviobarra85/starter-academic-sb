# ZonaOrientale V179 - Preflight asset pubblici

## Obiettivo

Aggiungere un controllo pre-online che verifica i JSON pubblici serviti da GitHub/static hosting senza fare letture Firebase.

## File modificati

- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/app.js`

## Funzionalità

In Admin, sia nella modalità admin leggero sia nel pannello Backup dopo il caricamento completo, è disponibile il bottone:

```text
Controlla asset pubblici
```

Il controllo esegue fetch statici su:

- `assets/public/config.json`
- `assets/snapshots/seasons/manifest.json`
- `assets/snapshots/honor.json`
- `assets/listoni/manifest.json`
- `assets/rose/manifest.json`
- `assets/competitions/manifest.json`

Il risultato indica OK, attenzione o errore, con dettagli su stagioni, snapshot, voci manifest e data di generazione quando presente.

## Console

È disponibile anche:

```js
ZonaOrientalePreflight.check()
ZonaOrientalePreflight.assets()
ZonaOrientalePreflight.last()
```

## Note

Il preflight non usa Firebase e non sostituisce i test manuali delle pagine. Serve a controllare rapidamente se gli asset statici necessari al pubblico sono pubblicati nel percorso corretto prima del deploy.

## Versione

Footer aggiornato a V179 e cache-buster `app.js?v=179`.
