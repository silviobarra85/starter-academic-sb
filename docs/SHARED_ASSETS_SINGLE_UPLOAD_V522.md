# V522 - Shared assets single-upload workflow

## Scopo

V522 formalizza il flusso operativo per caricare Listoni e Calciomercato una sola volta nel motore comune `fanta-engine`, senza duplicare gli stessi file dentro ogni lega.

## Percorso operativo unico

Da V522 il percorso primario runtime per entrambe le leghe e':

```text
static/fanta-engine/data/shared-assets/current/assets/listoni/
static/fanta-engine/data/shared-assets/current/assets/calciomercato/
```

Le configurazioni di `zonaorientale` e `fantapetillomantramanager` puntano a `current` come sorgente primaria.

## Fallback preservati

Le copie locali restano presenti, ma sono solo fallback di emergenza:

```text
static/zonaorientale/assets/listoni/
static/zonaorientale/assets/calciomercato/
static/fantapetillomantramanager/assets/listoni/
static/fantapetillomantramanager/assets/calciomercato/
```

V522 non cancella file locali e non scollega rollback/fallback.

## Come caricare nuovi Listoni

1. Aggiornare solo:

```text
static/fanta-engine/data/shared-assets/current/assets/listoni/manifest.json
static/fanta-engine/data/shared-assets/current/assets/listoni/*.json
```

2. Non duplicare gli stessi file nelle cartelle delle leghe, salvo rollback consapevole.

## Come caricare Calciomercato

1. Aggiornare solo:

```text
static/fanta-engine/data/shared-assets/current/assets/calciomercato/links.json
static/fanta-engine/data/shared-assets/current/assets/calciomercato/archive/manifest.json
static/fanta-engine/data/shared-assets/current/assets/calciomercato/archive/*.json
```

2. Non duplicare gli stessi file nelle cartelle delle leghe, salvo fallback di emergenza.

## Audit

Da root repo:

```bash
node static/fanta-engine/tools/audit-shared-assets-single-upload-v522.mjs
```

L'audit controlla che:

- `current` esista e abbia manifest centrale V522;
- entrambe le leghe usino `current` come path primario;
- i fallback locali siano ancora configurati;
- non restino riferimenti runtime a `shared-assets/v485`;
- le istruzioni admin non suggeriscano piu' upload per-lega dei Listoni;
- le pagine siano allineate a `?v=522`;
- `formValidatorsV506` resti esplicito.

## Funzionalita' preservate

- Firebase non modificato.
- EmailJS non modificato.
- Dati rose/competizioni per-lega non modificati.
- Slug `fantapetillomantramanager` non rinominato.
- Fallback locali Listoni/Calciomercato non cancellati.
- `docs/zonaorientale/FUNZIONALITA'.md` non modificato.

## Prossimo passo consigliato

V523 dovrebbe riprendere il configuratore guidato nuova lega, usando `fanta-engine/data/shared-assets/current` come default per gli asset comuni.
