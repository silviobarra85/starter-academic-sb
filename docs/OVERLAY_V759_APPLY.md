# Overlay V759 - bootstrap static-first duraturo

## Applicazione

Dalla radice del progetto, dopo aver estratto lo zip dell'overlay:

```bash
cp -R /percorso/overlay_v759/static/. static/
cp -R /percorso/overlay_v759/docs/. docs/
cp /percorso/overlay_v759/netlify.toml ./netlify.toml
```

In alternativa:

```bash
bash /percorso/overlay_v759/APPLY_OVERLAY.sh /percorso/della/repository
```

Lo zip contiene soltanto file nuovi o modificati.

## Verifica

```bash
node static/zonaorientale/tools/audit-static-first-v759.mjs
node static/fanta-engine/tools/audit-iosudo-v751.mjs
node static/zonaorientale/tools/audit-league-config-v443.mjs
node static/zonaorientale/tools/audit-static-data-paths-config-v446.mjs
```

Atteso: tutti gli audit terminano con `OK` o `superato`.
