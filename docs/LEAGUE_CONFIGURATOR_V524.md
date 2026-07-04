# V524 - Configuratore guidato nuova lega

## Obiettivo

V524 aggiunge un configuratore guidato sopra `create-league-v507.mjs` per creare nuove leghe in modo piu sicuro e coerente con il motore comune `fanta-engine`.

Questa patch non crea automaticamente nuove leghe. Aggiunge solo strumenti, default e audit.

## Script principali

```bash
node static/fanta-engine/tools/create-league-wizard-v524.mjs --slug nuova-lega --name "Nuova Lega" --season "2026-2027" --dry-run
```

Per creare davvero una lega, dopo aver verificato il piano:

```bash
node static/fanta-engine/tools/create-league-wizard-v524.mjs --slug nuova-lega --name "Nuova Lega" --season "2026-2027" --yes
```

## Regole applicate dal wizard

- usa `_league-template` come base;
- usa `create-league-v507.mjs` come generator stabile;
- imposta Listoni e Calciomercato su `static/fanta-engine/data/shared-assets/current/`;
- mantiene fallback locali;
- non modifica `netlify.toml` automaticamente;
- non crea Firebase project;
- non crea EmailJS service/template;
- genera documenti minimi in `docs/<slug>/`;
- lascia la nuova lega in stato `not-ready` fino ai controlli manuali.

## Asset comuni

Il default della nuova lega e':

```text
../fanta-engine/data/shared-assets/current/assets/listoni/
../fanta-engine/data/shared-assets/current/assets/calciomercato/
```

Quindi Listoni e Calciomercato si caricano una sola volta nel motore comune.

## Fallback

Le copie locali restano fallback:

```text
./assets/listoni/
./assets/calciomercato/
```

Non vanno usate come upload ordinario, ma servono per sicurezza e rollback.

## Cosa non cambia

- Nessuna modifica a `FUNZIONALITA'.md`.
- Nessuna nuova lega creata dall'overlay.
- Nessuna modifica a Firebase o EmailJS.
- Nessuna modifica automatica a Netlify.
- Nessuna cancellazione dei fallback locali.

## Verifica

```bash
node static/fanta-engine/tools/audit-league-configurator-v524.mjs
```
