# V283 - Pulizia controllata file macOS e residui

## Scopo

V283 aggiunge strumenti di controllo e pulizia prudente per evitare che metadata macOS o cartelle residue entrino nel repository.

La release non modifica funzionalita' del sito, dati JSON, Firebase, EmailJS o logiche di business.

## File aggiunti o aggiornati

```text
static/zonaorientale/tools/cleanup-macos-artifacts-v283.sh
static/zonaorientale/tools/check-zonaorientale.sh
static/zonaorientale/.gitignore
```

## Script di pulizia

Lo script principale della release e':

```bash
static/zonaorientale/tools/cleanup-macos-artifacts-v283.sh
```

Senza opzioni esegue solo un dry-run e mostra eventuali file/cartelle macOS trovati:

```bash
static/zonaorientale/tools/cleanup-macos-artifacts-v283.sh
```

Per rimuovere fisicamente i file dalla working tree, dopo aver controllato l'elenco:

```bash
static/zonaorientale/tools/cleanup-macos-artifacts-v283.sh --apply
```

Per rimuovere dall'indice Git eventuali file macOS gia' tracciati:

```bash
static/zonaorientale/tools/cleanup-macos-artifacts-v283.sh --git-rm
```

Se serve fare entrambe le cose:

```bash
static/zonaorientale/tools/cleanup-macos-artifacts-v283.sh --apply --git-rm
```

## Pattern controllati

- `.DS_Store`
- `._*`
- `__MACOSX`
- `.AppleDouble`
- `.LSOverride`

La `.gitignore` locale del sito e' stata rafforzata anche per:

- `.Spotlight-V100/`
- `.Trashes/`

## Flusso consigliato

```bash
git status
static/zonaorientale/tools/cleanup-macos-artifacts-v283.sh
static/zonaorientale/tools/cleanup-macos-artifacts-v283.sh --apply
static/zonaorientale/tools/cleanup-macos-artifacts-v283.sh --git-rm
static/zonaorientale/tools/check-zonaorientale.sh
git status
```

Usare `--apply` e `--git-rm` solo dopo aver letto il dry-run.

## Integrazione con V282

Lo script V282 `check-zonaorientale.sh` continua a essere il controllo pre-push principale. In V283 e' stato aggiornato per riconoscere anche `.AppleDouble` e `.LSOverride` e per suggerire lo script di pulizia quando trova file macOS.

## Diagnostica runtime

```js
window.ZonaOrientaleMacOsCleanupV283
```

## Test consigliati

```bash
static/zonaorientale/tools/cleanup-macos-artifacts-v283.sh
static/zonaorientale/tools/check-zonaorientale.sh
```

Poi verificare in browser:

```js
window.ZonaOrientaleMacOsCleanupV283
window.ZonaOrientalePrePushChecksV282
```

## Note di sicurezza

- Non rimuove moduli legacy del sito.
- Non rimuove asset runtime.
- Non modifica `FUNZIONALITA'.md`.
- Il comportamento distruttivo e' disattivato di default: senza opzioni lo script stampa soltanto l'elenco.
