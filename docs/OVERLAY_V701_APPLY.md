# Applicazione overlay V701

Copiare le cartelle `static/` e `docs/` sopra quelle del repository.

```bash
cp -R overlay/static/* static/
cp -R overlay/docs/* docs/
node static/fanta-engine/tools/audit-iosudo-v701.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v701.js
node --check static/iosudo/sw.js
```
