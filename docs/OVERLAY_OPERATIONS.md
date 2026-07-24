# Operazioni overlay

## Applicazione V780 / ioSudo V769

Dalla radice del repository:

```bash
rm -rf ~/Downloads/overlay_v780_iosudo_v769_fix_badge_sos
unzip -q ~/Downloads/overlay_v780_iosudo_v769_fix_badge_sos.zip -d ~/Downloads/

cp -R ~/Downloads/overlay_v780_iosudo_v769_fix_badge_sos/static/* static/
cp -R ~/Downloads/overlay_v780_iosudo_v769_fix_badge_sos/docs/* docs/
```

## Audit

```bash
node --check static/fanta-engine/js/apps/iosudo-app-v769.js
node --check static/iosudo/sw.js
node --check static/fanta-engine/tools/audit-iosudo-v769.mjs

node static/fanta-engine/tools/audit-iosudo-v769.mjs .
node static/zonaorientale/tools/audit-static-first-v760.mjs static
```

Risultato principale atteso:

```text
Audit ioSudo V769 OK - 34 badge SOS attivi su 1018 giocatori, falsi positivi 0, catalogo 1230.
```

## Git

```bash
git status
git add -A static docs
git commit -m "Corregge i badge SOS ioSudo V769"
git push origin master
```

L'overlay è autosufficiente, non modifica `.github/workflows` e può essere caricato direttamente in `incoming/overlays/`.

Dopo il deploy chiudere completamente la PWA e riaprirla per attivare `iosudo-shell-v769`.
