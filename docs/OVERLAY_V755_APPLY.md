# Overlay V755 / ioSudo V751

## Contenuto

- ioSudo V751: allineamento KPI Giocatori alla vista GIOCATORI effettiva.
- ioSudo V751: service worker mobile più tollerante, con precache non bloccante e navigazione network-first.
- ioSudo V751: ordinamento GIOCATORI per aggiornamento più recente, poi ruolo/nome.
- ZonaOrientale V755: cache-buster sito principale, app.js?v=755.
- ZonaOrientale V755: include i fix V752 sulle Rose/svincoli e V754 sulle checkbox Admin desktop.

## Applicazione

Dalla root del progetto:

```bash
cp -R ~/Downloads/overlay_site_iosudo_v755_mobile_iosudo_count_fix/static/* static/
cp -R ~/Downloads/overlay_site_iosudo_v755_mobile_iosudo_count_fix/docs/* docs/
```

Verifiche:

```bash
grep -n "app.js?v=" static/zonaorientale/index.html
grep -n "iosudo-app-v751" static/iosudo/index.html
node --check static/zonaorientale/assets/app.js
node --check static/fanta-engine/js/apps/iosudo-app-v751.js
node --check static/iosudo/sw.js
node static/fanta-engine/tools/audit-iosudo-v751.mjs
```

Commit:

```bash
git add static docs
git commit -m "Fix mobile boot e conteggio giocatori ioSudo V751"
git push origin master
```
