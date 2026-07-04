# V511 - Navigation data refresh e static-first recovery

## Problema corretto

Il click sui pulsanti di sezione cambiava hash, per esempio `#news`, ma la sezione poteva restare vuota perche il render/dati pubblici non venivano riallineati alla navigazione. In parallelo, se il loader standard non riusciva a completare il caricamento pubblico, il refresh della home poteva mostrare dati mancanti.

## Soluzione

V511 aggiunge un runtime comune in `fanta-engine`:

```text
static/fanta-engine/js/core/navigation-data-refresh-v511.js
```

Il runtime:

- ascolta `hashchange` e `load`;
- dopo `setAppPageV42` schedula un controllo dati;
- se i dati pubblici sono assenti, richiama il loader;
- se il loader standard non produce dati, usa snapshot statici locali;
- renderizza la sezione corrente dopo la navigazione.

## Fallback static-first

Il fallback usa solo asset locali gia presenti:

- `assets/public/config.json`
- `assets/snapshots/seasons/manifest.json`
- `assets/snapshots/seasons/*.json`
- `assets/snapshots/honor.json`
- listoni/rose/competizioni statiche tramite i loader esistenti

## Guardrail

- Non scrive su Firebase.
- Non cambia EmailJS.
- Non cambia Admin/Presidente.
- Non ripristina cartelle annidate rimosse.
