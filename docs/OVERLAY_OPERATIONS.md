# Operazioni overlay

## Applicazione V765

```bash
rm -rf ~/Downloads/overlay_v765_iosudo_v754_v141
unzip -q ~/Downloads/overlay_v765_iosudo_v754_v141.zip -d ~/Downloads/
cp -R ~/Downloads/overlay_v765_iosudo_v754_v141/static/* static/
cp -R ~/Downloads/overlay_v765_iosudo_v754_v141/docs/* docs/
```

## Audit

```bash
node --check static/fanta-engine/js/apps/iosudo-app-v754.js
node --check static/iosudo/sw.js
node --check static/fanta-engine/tools/audit-iosudo-v754.mjs
node static/fanta-engine/tools/audit-iosudo-v754.mjs .
```

## Git

```bash
git status
git add static docs
git commit -m "Aggiorna ioSudo V754 con dati Excel V141"
git push origin master
```
