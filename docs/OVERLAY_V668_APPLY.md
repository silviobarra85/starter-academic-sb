# Overlay V668 - Card mobile Listone/Rose

## Applicazione manuale

```bash
rm -rf ~/Downloads/fantacalcio_overlay_site_mobile_cards_v668
unzip -o ~/Downloads/fantacalcio_overlay_site_mobile_cards_v668.zip -d ~/Downloads/

cp -R ~/Downloads/fantacalcio_overlay_site_mobile_cards_v668/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_site_mobile_cards_v668/docs/* docs/
```

## Controlli

```bash
node static/fanta-engine/tools/audit-site-mobile-cards-v668.mjs
node --check static/zonaorientale/assets/app.js
node --check static/fantapetillomantramanager/assets/app.js
```

## Commit

```bash
git status
git add static docs
git commit -m "Rifinisce card mobile sito V668"
git push origin master
```
