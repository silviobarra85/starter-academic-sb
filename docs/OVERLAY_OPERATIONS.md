# Operazioni overlay

## Applicazione V767

Dalla radice del repository:

```bash
rm -rf ~/Downloads/overlay_v767_iosudo_v756_catalogo_indicizzato
unzip -q ~/Downloads/overlay_v767_iosudo_v756_catalogo_indicizzato.zip -d ~/Downloads/

cp -R ~/Downloads/overlay_v767_iosudo_v756_catalogo_indicizzato/static/* static/
cp -R ~/Downloads/overlay_v767_iosudo_v756_catalogo_indicizzato/docs/* docs/
```

## Audit

```bash
node --check static/fanta-engine/js/apps/iosudo-app-v756.js
node --check static/iosudo/sw.js
node --check static/fanta-engine/tools/audit-iosudo-v756.mjs
node static/fanta-engine/tools/audit-iosudo-v756.mjs .
node static/zonaorientale/tools/audit-static-first-v760.mjs .
```

Risultato principale atteso:

```text
Audit ioSudo V756 OK - 4357 controlli superati
```

Il tempo del benchmark dei lookup varia in base al computer e viene riportato alla fine della riga.

## Git

```bash
git status
git add static docs
git commit -m "Unifica catalogo giocatori e indicizza dettagli ioSudo V756"
git push origin master
```

Dopo il deploy eseguire un hard refresh e, per la PWA installata, chiudere e riaprire l'app per attivare `iosudo-shell-v756`.
