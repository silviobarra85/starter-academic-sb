## Aggiornamento V292

Lo script `static/zonaorientale/tools/check-zonaorientale.sh` controlla ora la presenza dei CSS refactor V292 e del file conservativo `theme-light-suspended-v292.css`, oltre al documento `docs/zonaorientale/refactor/CSS_CLEANUP_V292.md`.

## Aggiornamento V290

Lo script `static/zonaorientale/tools/check-zonaorientale.sh` controlla anche la presenza dell’audit `docs/zonaorientale/refactor/AUDIT_STYLES_APP_V290.md` quando la documentazione e disponibile. Prima di qualunque refactor CSS/JS consultare la sezione funzionalita a rischio del documento V290.

## Aggiornamento V289

Lo script `static/zonaorientale/tools/check-zonaorientale.sh` controlla anche la presenza del documento `docs/zonaorientale/audit/DARK_MODE_ROSE_MOBILE_V289.md` quando la documentazione e' disponibile.

## Aggiornamento V288

Lo script `static/zonaorientale/tools/check-zonaorientale.sh` controlla anche la presenza del documento `docs/zonaorientale/audit/FIX_ROSE_MOBILE_LIGHT_V288.md` quando la documentazione e' disponibile.

## Aggiornamento V287

Lo script `static/zonaorientale/tools/check-zonaorientale.sh` controlla anche la presenza del documento `docs/zonaorientale/audit/RIFINITURA_CONTROLLI_MOBILE_V287.md` quando la documentazione e' disponibile.

## Aggiornamento V284

Lo script `check-zonaorientale.sh` segnala anche la presenza dell'audit mobile V284 quando la cartella documentazione e' disponibile:

```text
docs/zonaorientale/audit/AUDIT_MOBILE_COMPLETO_V284.md
```

Il controllo e' un promemoria operativo: non sostituisce il test manuale da browser/dispositivo.

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

## Aggiornamento V283

In V283 lo script e' stato aggiornato per riconoscere anche `.AppleDouble` e `.LSOverride` e per suggerire il nuovo strumento di pulizia controllata:

```bash
static/zonaorientale/tools/cleanup-macos-artifacts-v283.sh
```

Il controllo pre-push resta non distruttivo: segnala gli errori, ma non rimuove file automaticamente.

## Aggiornamento V285

In V285 lo script segnala anche la presenza della documentazione dei fix mobile mirati:

```text
docs/zonaorientale/audit/FIX_MOBILE_MIRATI_V285.md
```

Il controllo resta non distruttivo e serve solo a ricordare di mantenere allineati audit, fix UI e checklist di regressione quando si lavora su mobile.

## Aggiornamento V286

In V286 lo script segnala anche la presenza della documentazione del fix prima colonna mobile Light:

```text
docs/zonaorientale/audit/FIX_PRIMA_COLONNA_MOBILE_LIGHT_V286.md
```

Prima del push di interventi mobile, verificare tema Light su Listone e rose con scroll orizzontale.
## Aggiornamento V291

Lo script `check-zonaorientale.sh` controlla anche la presenza dei file CSS estratti:

```text
assets/css/refactor/mobile-controls-v291.css
assets/css/refactor/rosters-tables-v291.css
```

e del documento:

```text
docs/zonaorientale/refactor/CSS_REFACTOR_V291.md
```

Questi controlli servono a evitare che gli override mobile/rose/Listone vengano staccati dagli HTML durante futuri refactor.



## Aggiornamento V293

Lo script `check-zonaorientale.sh` controlla anche la presenza del documento:

```text
docs/zonaorientale/refactor/APP_JS_AUDIT_V293.md
```

Questo serve a evitare refactor di `assets/app.js` senza una mappa preventiva delle funzionalita a rischio. Prima di spostare helper JS, leggere l'audit V293 e dichiarare nel documento della release cosa si rischia di perdere e come lo si preserva.
