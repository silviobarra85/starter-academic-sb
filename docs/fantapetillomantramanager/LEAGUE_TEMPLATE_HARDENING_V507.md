# League template hardening V507

La V507 rafforza il template nuova lega introdotto in V502.

## File principali

- `static/fanta-engine/tools/create-league-v507.mjs`
- `static/fanta-engine/tools/validate-league-config-v507.mjs`
- `static/fanta-engine/data/league-template-hardening-v507.json`
- `static/_league-template/*` aggiornato a V507

## Cosa cambia

- il generatore controlla slug riservati, collisioni e cartelle accidentali;
- il generatore supporta `--dry-run`;
- il generatore invoca il validatore dopo la creazione;
- il validatore controlla config, placeholder residui, docs minimi, Firebase/EmailJS dedicati o disabilitati;
- Netlify resta manuale: nessun redirect viene scritto automaticamente.

## Uso futuro

```bash
node static/fanta-engine/tools/create-league-v507.mjs fantanuovalega --name "Fanta Nuova Lega" --short "FNL" --season "2026-2027"
node static/fanta-engine/tools/validate-league-config-v507.mjs fantanuovalega --allow-disabled-integrations
```

Prima del go-live reale, rimuovere `--allow-disabled-integrations` quando Firebase/EmailJS devono essere attivi e dedicati.

## Guardrail

- Non usare slug riservati.
- Non riusare projectId Firebase di altre leghe.
- Non riusare serviceId EmailJS di altre leghe.
- Non pubblicare senza smoke test browser e revisione mobile.
- Non ripristinare `static/static` o `static/zonaorientale/static`.
