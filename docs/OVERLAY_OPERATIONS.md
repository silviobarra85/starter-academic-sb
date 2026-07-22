# Operazioni overlay

```bash
rm -rf ~/Downloads/overlay_v766_iosudo_v755_v143
unzip -q ~/Downloads/overlay_v766_iosudo_v755_v143.zip -d ~/Downloads/
cp -R ~/Downloads/overlay_v766_iosudo_v755_v143/static/* static/
cp -R ~/Downloads/overlay_v766_iosudo_v755_v143/docs/* docs/

node --check static/fanta-engine/js/apps/iosudo-app-v755.js
node --check static/iosudo/sw.js
node --check static/fanta-engine/tools/audit-iosudo-v755.mjs
node static/fanta-engine/tools/audit-iosudo-v755.mjs .

git status
git add static docs
git commit -m "Aggiorna ioSudo V755 con dati Excel V143"
git push origin master
```

Dopo il deploy eseguire un hard refresh e riaprire la PWA per attivare `iosudo-shell-v755`.
