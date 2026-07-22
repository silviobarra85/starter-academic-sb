# Operazioni overlay

## Applicazione V768

Dalla radice del repository:

```bash
rm -rf ~/Downloads/overlay_v768_iosudo_v757_dati_v146
unzip -q ~/Downloads/overlay_v768_iosudo_v757_dati_v146.zip -d ~/Downloads/

cp -R ~/Downloads/overlay_v768_iosudo_v757_dati_v146/static/* static/
cp -R ~/Downloads/overlay_v768_iosudo_v757_dati_v146/docs/* docs/
```

## Audit

```bash
node --check static/fanta-engine/js/apps/iosudo-app-v757.js
node --check static/iosudo/sw.js
node --check static/fanta-engine/tools/audit-iosudo-v757.mjs
node static/fanta-engine/tools/audit-iosudo-v757.mjs .
node static/zonaorientale/tools/audit-static-first-v760.mjs .
```

Risultato principale atteso:

```text
Audit ioSudo V757 OK - 4796 controlli superati
```

Il tempo del benchmark dei lookup varia in base al computer e viene riportato alla fine della riga.

## Git

```bash
git status
git add static docs
git commit -m "Aggiorna ioSudo V757 con dati Excel V146 e separa gli Adams"
git push origin master
```

Dopo il deploy eseguire un hard refresh e, per la PWA installata, chiudere e riaprire l'app per attivare `iosudo-shell-v757`.
