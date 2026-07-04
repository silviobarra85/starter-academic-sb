# V484 - Inventario asset comuni listone/calciomercato

Aggiornato al **24/06/2026**.

## Scopo

La V484 verifica quali asset statici relativi a **listone** e **calciomercato** sono identici tra `static/zonaorientale` e `static/fantapetillomantramanager`, senza spostare path runtime e senza cancellare copie locali.

## Esito inventario

Audit V484:

```text
42 file candidati
42 file identici tra ZonaOrientale e FantaMantraManager
0 file diversi o mancanti
```

File di inventario prodotto nel motore comune:

```text
static/fanta-engine/data/shared-assets-inventory-v484.json
```

Audit dedicato:

```text
static/fanta-engine/tools/audit-shared-assets-inventory-v484.mjs
```

Audit anti-contaminazione aggiornato alla V484:

```text
static/fanta-engine/tools/audit-multileague-contamination-v484.mjs
```


## Categorie risultate identiche

- `assets/listoni/**`
- `assets/calciomercato/**`
- `assets/js/calciomercato/**`
- `assets/js/admin/listone-converter.js`
- `assets/js/domain/listone.js`
- `assets/css/refactor/listone.css`
- `assets/css/refactor/calciomercato.css`

## Decisione V484

Non viene ancora centralizzato nulla nei path runtime.

Motivo: anche se i file sono identici, alcuni JSON del listone possono contenere metadati come `sourceFile`, `rosterSourceFile`, `fantasyRoster` o riferimenti storici importati dal clone. Prima di farli diventare sorgente comune bisogna decidere se quei dati devono essere condivisi davvero oppure se in futuro diventeranno specifici per lega.

## Guardrail introdotti

In `assets/league-config.json` sono tracciati:

```json
{
  "features": {
    "sharedAssetsInventory": true
  },
  "guardrails": {
    "sharedAssetsInventoryOnly": true,
    "doNotMoveSharedAssetsWithoutFallback": true,
    "preserveLeagueLocalListoniCalciomercato": true
  }
}
```

## Prossimo step consigliato

La prossima patch puo' essere una V485 prudente:

1. Creare path comuni in `static/fanta-engine/data/`.
2. Copiare, non spostare, i file identici.
3. Aggiungere config per path comuni.
4. Aggiornare loader listone/calciomercato con fallback ai path locali.
5. Tenere le copie locali finche' audit e test manuali non confermano zero regressioni.

## Test manuali obbligatori prima di centralizzare

- Sezione Listone aperta da home.
- Scheda `player.html` aperta da un giocatore del listone.
- Filtri ruolo/classico/mantra funzionanti.
- Calciomercato/Fantamercato non danno 404 su manifest e archive.
- Nessun riferimento visibile a ZonaOrientale dentro FantaMantraManager.
