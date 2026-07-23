# Operazioni overlay

## Applicazione V772

Dalla radice del repository:

```bash
rm -rf ~/Downloads/overlay_v772_iosudo_v763_dati_v149_pessina
unzip -q ~/Downloads/overlay_v772_iosudo_v763_dati_v149_pessina.zip -d ~/Downloads/

cp -R ~/Downloads/overlay_v772_iosudo_v763_dati_v149_pessina/static/* static/
cp -R ~/Downloads/overlay_v772_iosudo_v763_dati_v149_pessina/docs/* docs/
```

## Audit

```bash
node --check static/fanta-engine/js/apps/iosudo-app-v763.js
node --check static/iosudo/sw.js
node --check static/fanta-engine/tools/audit-iosudo-v763.mjs
node static/fanta-engine/tools/audit-iosudo-v763.mjs .
node static/zonaorientale/tools/audit-static-first-v760.mjs static
```

Risultati principali attesi:

```text
Audit ioSudo V763 OK - 1266 controlli superati
[audit-static-first-v760] OK - 42 controlli superati su static.
```

## Git

```bash
git status
git add static docs
git commit -m "Aggiorna ioSudo V763 con Excel V149 e disambigua Pessina"
git push origin master
```

Dopo il deploy eseguire un hard refresh. Per la PWA installata, chiuderla completamente e riaprirla per attivare `iosudo-shell-v763`.
