# Operazioni overlay

## Applicazione standard

Dalla radice del repository:

```bash
rm -rf ~/Downloads/NOME_OVERLAY
unzip -q ~/Downloads/NOME_OVERLAY.zip -d ~/Downloads/

# Solo quando l'overlay contiene la lista di pulizia documentale:
while IFS= read -r file; do
  [ -n "$file" ] && rm -f "$file"
done < ~/Downloads/NOME_OVERLAY/REMOVE_LEGACY_DOCS.txt

cp -R ~/Downloads/NOME_OVERLAY/static/* static/
cp -R ~/Downloads/NOME_OVERLAY/docs/* docs/
```

## Audit ioSudo

```bash
node --check static/fanta-engine/js/apps/iosudo-app-v753.js
node --check static/iosudo/sw.js
node --check static/fanta-engine/tools/audit-iosudo-v753.mjs
node static/fanta-engine/tools/audit-iosudo-v753.mjs .
```

## Git

```bash
git status
git add -A static docs
git commit -m "Aggiorna ioSudo V753 con dati Excel V140"
git push origin master
```

## Dopo il deploy

- Aprire `https://silviobarra.com/iosudo/`.
- Eseguire un hard refresh.
- Chiudere e riaprire la PWA installata per attivare il nuovo service worker.
- Verificare versione, data overlay, conteggi, badge e ordinamento della rosa.
