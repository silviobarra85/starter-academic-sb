# Overlay ioSudo V735

Aggiornamento da Excel V103.

## Applicazione

```bash
cp -R overlay_iosudo_v735/static/* static/
cp -R overlay_iosudo_v735/docs/* docs/
```

## Controlli

```bash
node --check static/fanta-engine/js/apps/iosudo-app-v735.js
node --check static/iosudo/sw.js
node static/fanta-engine/tools/audit-iosudo-v735.mjs
```

## Note
- Alias confermati applicati.
- Mirko Elia e Jacopo Antolini aggiornati con nome completo e ufficialità in uscita.
- Alessio Zerbin aggiornato come monitoraggio attivo Frosinone/Napoli.
- Header app: overlay 19/07/2026 13:45 CEST.
