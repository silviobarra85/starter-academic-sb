# Applicazione overlay V761

L'overlay è incrementale rispetto alla V760 e contiene solo i file modificati.

Dalla radice del repository:

```bash
unzip -q ~/Downloads/overlay_v761_fix_mutation_observer.zip -d ~/Downloads/

cp -R ~/Downloads/overlay_v761_fix_mutation_observer/static/* static/
cp -R ~/Downloads/overlay_v761_fix_mutation_observer/docs/* docs/
cp -R ~/Downloads/overlay_v761_fix_mutation_observer/netlify/* netlify/
cp ~/Downloads/overlay_v761_fix_mutation_observer/netlify.toml netlify.toml

node static/zonaorientale/tools/audit-static-first-v760.mjs .
node static/zonaorientale/tools/audit-admin-card-loop-v761.mjs .

git add static docs netlify netlify.toml
git commit -m "Fix loop MutationObserver e blocco caricamento V761"
git push origin master
```

Dopo il deploy:

```bash
node static/zonaorientale/tools/check-live-v761.mjs https://silviobarra.com
```
