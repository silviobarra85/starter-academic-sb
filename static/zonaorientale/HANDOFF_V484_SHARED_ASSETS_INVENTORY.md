# Handoff V484 - Inventario asset comuni listone/calciomercato

## Contesto

Il progetto sta evolvendo verso un motore unico multi-lega. L'utente ha segnalato che i file statici relativi a listone e calciomercato sembrano comuni a ZonaOrientale e FantaMantraManager e potrebbero stare nel motore centrale.

## Modifica V484

La V484 e' volutamente osservativa: misura e documenta, ma non sposta i path runtime.

File principali aggiunti:

```text
static/fanta-engine/data/shared-assets-inventory-v484.json
static/fanta-engine/tools/audit-shared-assets-inventory-v484.mjs
docs/fantapetillomantramanager/SHARED_ASSETS_INVENTORY_V484.md
docs/zonaorientale/SHARED_ASSETS_INVENTORY_V484.md
```

Risultato audit:

```text
42 file candidati
42 file identici
0 file diversi o mancanti
```

Categorie incluse:

```text
assets/listoni/**
assets/calciomercato/**
assets/js/calciomercato/**
assets/js/admin/listone-converter.js
assets/js/domain/listone.js
assets/css/refactor/listone.css
assets/css/refactor/calciomercato.css
```

## Cosa NON e' stato fatto

- Nessun asset e' stato spostato nei path runtime del motore comune.
- Nessuna copia locale in `static/zonaorientale` o `static/fantapetillomantramanager` e' stata cancellata.
- Nessun loader listone/calciomercato e' stato modificato.
- Nessuna modifica a Firebase, Admin, EmailJS, news, regolamenti, bilanci o `FUNZIONALITA'.md`.

## Guardrail

In entrambe le config lega e' stato aggiunto tracking:

```json
"features": {
  "sharedAssetsInventory": true
},
"guardrails": {
  "sharedAssetsInventoryOnly": true,
  "doNotMoveSharedAssetsWithoutFallback": true,
  "preserveLeagueLocalListoniCalciomercato": true
}
```

## Prossimo passo consigliato

V485 puo' centralizzare in modo prudente:

1. Copiare i file comuni in `static/fanta-engine/data/`.
2. Aggiungere path comuni in config.
3. Aggiornare loader con fallback ai path locali.
4. Non cancellare copie locali.
5. Aggiungere audit 404 e test UI su Listone, Player, Calciomercato e Fantamercato.

## Audit

Da root repo:

```bash
cd static
node fanta-engine/tools/audit-shared-assets-inventory-v484.mjs
node fanta-engine/tools/audit-multileague-contamination-v484.mjs
```
