# V297 - Pulizia helper V294 obsoleto

## Obiettivo

V297 completa il primo ciclo di estrazione helper V294/V295 rimuovendo il file non piu' importato:

```text
static/zonaorientale/assets/js/utils/shared-helpers-v294.js
```

Il file attivo resta:

```text
static/zonaorientale/assets/js/utils/shared-helpers-v295.js
```

## Funzionalita' a rischio e preservazione

Funzionalita' potenzialmente a rischio: export CSV delle modifiche Listone, introdotto in V278 e collegato all'helper CSV in V295.

Preservazione applicata:

- `assets/app.js` continua a importare `shared-helpers-v295.js`;
- `csvEscapeV278` resta collegato a `ZonaOrientaleSharedHelpersV295.csvEscape`;
- il pulsante export resta admin-only dopo V296;
- non vengono toccati filtri Listone, colonna `Modifica`, usciti storici o calcolo differenze;
- non vengono toccati Firebase, EmailJS, Admin, Rose, Dashboard Presidente, Competizioni o mobile navigation.

## Comando di pulizia

Dopo aver applicato l'overlay V297, rimuovere il vecchio helper con:

```bash
git rm static/zonaorientale/assets/js/utils/shared-helpers-v294.js
```

Poi eseguire:

```bash
static/zonaorientale/tools/check-zonaorientale.sh
```

Il controllo deve confermare:

```text
helper obsoleto V294 rimosso
pulizia helper obsoleto V297 presente
```

## Test manuali minimi

- Listone pubblico: colonna `Modifica`, filtro `Modifiche`, usciti storici.
- Login Admin: pulsante `Esporta modifiche CSV` visibile e funzionante.
- Non Admin: pulsante export non visibile.
- Console: `window.ZonaOrientaleSharedHelpersV295.runSmokeTest().ok === true`.
- Console: `window.ZonaOrientaleHelperCleanupV297.behaviorChange === false`.

## Nota

Questa release non rimuove funzioni storiche da `app.js`; rimuove solo un file helper non piu' importato.
