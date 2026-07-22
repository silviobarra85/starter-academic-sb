# Operazioni overlay

## Applicazione V766

Dalla radice del repository:

```bash
rm -rf ~/Downloads/overlay_v766_iosudo_v755_identita_canoniche
unzip -q ~/Downloads/overlay_v766_iosudo_v755_identita_canoniche.zip -d ~/Downloads/

cp -R ~/Downloads/overlay_v766_iosudo_v755_identita_canoniche/static/* static/
cp -R ~/Downloads/overlay_v766_iosudo_v755_identita_canoniche/docs/* docs/
```

## Audit

```bash
node --check static/fanta-engine/js/apps/iosudo-app-v755.js
node --check static/iosudo/sw.js
node --check static/fanta-engine/tools/audit-iosudo-v755.mjs
node static/fanta-engine/tools/audit-iosudo-v755.mjs .
```

Risultato atteso:

```text
Audit ioSudo V755 OK - 11348 controlli superati
```

## Git

```bash
git status
git add static docs
git commit -m "Canonicalizza identita giocatori e rumor ioSudo V755"
git push origin master
```

Dopo il deploy eseguire un hard refresh e, per la PWA installata, chiudere e riaprire l'app per attivare `iosudo-shell-v755`.
