# Applicazione overlay V647

Questo overlay disattiva la sezione pubblica `Per i SUDATORI` nelle due leghe, mantenendo attivo `ioSudo`.

## Comandi

```bash
rm -rf ~/Downloads/fantacalcio_overlay_disable_sudatori_site_v647
unzip -o ~/Downloads/fantacalcio_overlay_disable_sudatori_site_v647.zip -d ~/Downloads/

cp -R ~/Downloads/fantacalcio_overlay_disable_sudatori_site_v647/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_disable_sudatori_site_v647/docs/* docs/
```

## Verifica

```bash
node static/fanta-engine/tools/audit-disable-sudatori-site-v647.mjs
git status
```

## Commit

```bash
git add static docs
git commit -m "Disattiva sezione pubblica Sudatori V647"
git push origin master
```
