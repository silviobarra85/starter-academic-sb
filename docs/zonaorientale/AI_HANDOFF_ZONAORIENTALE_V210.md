# AI HANDOFF ZonaOrientale - V210

## Stato versione

Versione corrente: **V210 - refactor comunicati admin**.

## Contesto

Il progetto e' una webapp statica in `static/zonaorientale`, con HTML/CSS/JS puro e Firebase lato browser. La strategia dati attuale e':

- JSON statici / snapshot statici per dati storici e pesanti;
- Firebase live per comunicati, trasferibili e trattative;
- Firebase admin completo solo su richiesta tramite `Carica dati amministrazione`.

## Modifica V210

La V210 estrae il blocco V197 del Generatore comunicati automatici da `assets/app.js` in:

```text
static/zonaorientale/assets/js/refactor/admin-communication-generator-v210.js
```

`app.js` importa il modulo e lo installa con:

```js
installCommunicationGeneratorRefactorV210({ ...dependencies })
```

## Cosa preservare

Il modulo deve continuare a:

- non scrivere automaticamente su Firebase;
- non aggiungere letture Firebase;
- usare solo dati gia' presenti in `state.raw`;
- compilare il form Comunicati esistente solo quando l'admin preme `Inserisci nei Comunicati`;
- mantenere `window.ZonaOrientaleCommunicationGenerator`.

## File chiave

- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/assets/js/refactor/admin-communication-generator-v210.js`
- `static/zonaorientale/index.html`
- `docs/zonaorientale/REFACTOR_V210.md`

## Verifiche minime

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/js/refactor/admin-communication-generator-v210.js
find static/zonaorientale/assets -type f -name '*.js' -print0 | xargs -0 -n 1 node --check
```

## Local launch

Se sei in `static/zonaorientale`:

```bash
cd ..
python3 -m http.server 1313 --bind 0.0.0.0
```

Aprire:

```text
http://localhost:1313/zonaorientale/
```

## Prossimi refactor consigliati

1. Estrarre Statistiche + Confronta in modulo dedicato.
2. Estrarre Pubblicazione dati/Stato Firebase-JSON/Procedura guidata in modulo admin dedicato.
3. Estrarre Dashboard Presidente in modulo separato.
4. Ridurre ulteriormente gli override Vxx in fondo ad `app.js`.
