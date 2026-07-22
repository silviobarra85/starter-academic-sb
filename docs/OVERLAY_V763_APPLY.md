# Applicazione overlay V763

Dalla radice del repository `starter-academic-sb`, supponendo lo zip in `~/Downloads`:

```bash
rm -rf ~/Downloads/overlay_v763_admin_card_controller
unzip -q ~/Downloads/overlay_v763_admin_card_controller.zip -d ~/Downloads/

cp -R ~/Downloads/overlay_v763_admin_card_controller/static/* static/
cp -R ~/Downloads/overlay_v763_admin_card_controller/docs/* docs/
cp -R ~/Downloads/overlay_v763_admin_card_controller/netlify/* netlify/
cp ~/Downloads/overlay_v763_admin_card_controller/netlify.toml netlify.toml
```

Audit:

```bash
node --check static/fanta-engine/js/shared/v489/assets/js/core/admin-card-visibility-v456.js
node --check static/zonaorientale/assets/js/core/admin-card-visibility-v456.js
node --check static/fantapetillomantramanager/assets/js/core/admin-card-visibility-v456.js
node static/zonaorientale/tools/audit-static-first-v760.mjs .
node static/zonaorientale/tools/audit-admin-card-visibility-v763.mjs .
```

Commit e push:

```bash
git status
git add static docs netlify netlify.toml
git commit -m "Fix controller visibilita Admin V763"
git push origin master
```

Dopo il deploy:

```bash
node static/zonaorientale/tools/check-live-v763.mjs https://silviobarra.com
```
