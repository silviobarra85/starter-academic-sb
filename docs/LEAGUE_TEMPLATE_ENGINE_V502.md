# League Template Engine V502

La V502 introduce un template controllato per creare nuove leghe a partire da `fanta-engine`.

## File principali

- `static/_league-template/`: template HTML/config minimale.
- `static/fanta-engine/tools/create-league-v502.mjs`: generatore nuova lega.
- `static/fanta-engine/data/league-template-v502.json`: manifest del template.

## Uso previsto

```bash
node static/fanta-engine/tools/create-league-v502.mjs fantanuovalega --name "Fanta Nuova Lega" --short "FNL" --season "2026-2027"
```

Il comando crea:

- `static/fantanuovalega/`
- `docs/fantanuovalega/`

## Cosa NON fa

- non crea progetto Firebase;
- non crea service/template EmailJS;
- non modifica `netlify.toml`;
- non importa dati reali;
- non rende la lega pronta per produzione.

## Checklist prima del go-live di una nuova lega

- completare `assets/league-config.json`;
- creare o disabilitare Firebase;
- creare o disabilitare EmailJS;
- aggiungere dati reali/snapshot;
- configurare eventuali redirect Netlify;
- eseguire audit runtime e anti-contaminazione;
- testare mobile, menu, footer, listone, calciomercato e dashboard.
