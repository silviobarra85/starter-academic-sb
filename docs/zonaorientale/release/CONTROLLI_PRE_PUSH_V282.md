# V282 - Controlli pre-push ZonaOrientale

## Scopo

V282 aggiunge uno script locale per eseguire i controlli tecnici ricorrenti prima di commit, push o preparazione merge.

Lo script non modifica file, non scrive su Firebase e non cambia dati runtime.

## File aggiunto

```text
static/zonaorientale/tools/check-zonaorientale.sh
```

Nello zip overlay il file si trova in:

```text
zonaorientale/tools/check-zonaorientale.sh
```

## Come eseguirlo

Dalla root della repo:

```bash
static/zonaorientale/tools/check-zonaorientale.sh
```

Oppure dalla cartella del sito:

```bash
cd static/zonaorientale
tools/check-zonaorientale.sh
```

## Controlli eseguiti

1. Sintassi JavaScript sotto `assets/` con `node --check`.
2. Validita dei JSON sotto `assets/` con `jq empty`; se `jq` non e disponibile usa `python3 -m json.tool`.
3. Allineamento tra `DEPLOY_EXPECTED_VERSION_V181`, footer HTML e cache-buster `?v=`.
4. Assenza di file macOS indesiderati (`.DS_Store`, `._*`, `__MACOSX`) nel sito e nella documentazione.
5. Assenza di file macOS tracciati da Git quando lo script viene eseguito dentro la repo.

## Quando usarlo

Usarlo sempre dopo aver applicato un overlay e prima di:

```bash
git add ...
git commit ...
git push ...
```

## Note operative

- Lo script fallisce con exit code `1` se trova errori obbligatori.
- Gli avvisi non bloccanti vengono indicati come `WARN`.
- Il controllo dei file Git tracciati viene eseguito solo se lo script rileva la repo.
- Se vengono aggiunti nuovi HTML principali o nuovi import critici, aggiornare lo script in una release successiva.

## Diagnostica runtime

V282 espone:

```js
window.ZonaOrientalePrePushChecksV282
```

## Test consigliati dopo V282

```bash
static/zonaorientale/tools/check-zonaorientale.sh
```

Poi avviare il sito in locale:

```bash
cd static
python3 -m http.server 1313 --bind 0.0.0.0
```

Aprire:

```text
http://localhost:1313/zonaorientale/
```

Verificare anche da browser:

```js
window.ZonaOrientalePrePushChecksV282
```
