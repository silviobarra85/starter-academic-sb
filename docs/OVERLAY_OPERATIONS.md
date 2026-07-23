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
node --check static/fanta-engine/js/apps/iosudo-app-v760.js
node --check static/iosudo/sw.js
node --check static/fanta-engine/tools/audit-iosudo-v760.mjs
node static/fanta-engine/tools/audit-iosudo-v760.mjs .
node static/zonaorientale/tools/audit-static-first-v760.mjs .
```

Risultato principale atteso:

```text
Audit ioSudo V760 OK - 4796 controlli superati
```

Il tempo del benchmark dei lookup varia in base al computer e viene riportato alla fine della riga.

## Git

```bash
git status
git add static docs
git commit -m "Aggiorna ioSudo V760 con dati Excel V146 e separa gli Adams"
git push origin master
```

Dopo il deploy eseguire un hard refresh e, per la PWA installata, chiudere e riaprire l'app per attivare `iosudo-shell-v757`.

## V776 / ioSudo V765
- Sorgente: `v150_2026-07-23_fantacalcio_serie_a_2026_27_iosudo_v763_aggiornato_1400.xlsx`; cutoff 23/07/2026 14:00 CEST.
- L'overlay contiene payload completi già migrati: GitHub Actions può copiare i file e lanciare subito l'audit.
- Aggiornare sempre insieme header visibile, HTML, JavaScript, CSS, manifest e cache service worker.
- Audit: `node static/fanta-engine/tools/audit-iosudo-v765.mjs .`.
