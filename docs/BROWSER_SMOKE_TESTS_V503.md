# Browser smoke tests V503

La V503 introduce uno smoke test Playwright condiviso nel motore comune. Lo scopo e' intercettare regressioni che gli audit statici non vedono: errori console, asset 404, request fallite e footer/versione non coerenti.

## File principali

```text
static/fanta-engine/tools/playwright-smoke-v503.mjs
static/fanta-engine/tools/audit-browser-smoke-tests-v503.mjs
static/fanta-engine/data/browser-smoke-tests-v503.json
```

## Audit statici

```bash
cd static
node fanta-engine/tools/audit-browser-smoke-tests-v503.mjs
node fanta-engine/tools/audit-runtime-regression-v503.mjs
node fanta-engine/tools/audit-multileague-contamination-v503.mjs
```

## Esecuzione browser

Con il workflow locale gia' usato nel progetto, avviare il server dalla cartella parent:

```bash
cd ..
python3 -m http.server 1313 --bind 0.0.0.0
```

Poi, da un altro terminale nella repo:

```bash
FANTA_BASE_URL=http://127.0.0.1:1313 FANTA_SITE_PREFIX=/starter-academic-sb/static node static/fanta-engine/tools/playwright-smoke-v503.mjs
```

Se invece si serve direttamente la cartella `static`, non serve `FANTA_SITE_PREFIX`:

```bash
FANTA_BASE_URL=http://127.0.0.1:1313 node static/fanta-engine/tools/playwright-smoke-v503.mjs
```

## Cosa controlla

- home, competition e player per ZonaOrientale;
- home, competition, player, news e bilanci per FantaMantraManager;
- HTTP status inferiore a 400;
- assenza di request failed;
- assenza di console error;
- title pagina presente;
- footer/versione V503 presente;
- brand corretto.

## Cosa non fa

- Non effettua login;
- non invia EmailJS;
- non scrive Firebase;
- non sostituisce la verifica manuale su Admin, Presidente, Listone e Calciomercato.
