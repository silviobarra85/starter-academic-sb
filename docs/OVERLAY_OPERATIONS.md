# Operazioni overlay

## Applicazione V765

Dalla radice del repository:

```bash
rm -rf ~/Downloads/overlay_v765_iosudo_v754_ruoli_listone
unzip -q ~/Downloads/overlay_v765_iosudo_v754_ruoli_listone.zip -d ~/Downloads/

cp -R ~/Downloads/overlay_v765_iosudo_v754_ruoli_listone/static/* static/
cp -R ~/Downloads/overlay_v765_iosudo_v754_ruoli_listone/docs/* docs/
```

## Audit

```bash
node --check static/fanta-engine/js/apps/iosudo-app-v754.js
node --check static/iosudo/sw.js
node --check static/fanta-engine/tools/audit-iosudo-v754.mjs
node static/fanta-engine/tools/audit-iosudo-v754.mjs .
```

Risultato atteso:

```text
Audit ioSudo V754 OK - 4548 controlli superati
```

## Git

```bash
git status
git add static docs
git commit -m "Allinea ruoli ioSudo al listone e aggiunge badge sorgente V754"
git push origin master
```

Dopo il deploy eseguire un hard refresh e, per la PWA installata, chiudere e riaprire l'app per attivare `iosudo-shell-v754`.
