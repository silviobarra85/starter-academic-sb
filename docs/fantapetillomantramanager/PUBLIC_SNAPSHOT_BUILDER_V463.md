# V463 - Generatore snapshot pubblici FantaPetillo

## Obiettivo

La V463 aggiunge nell'Admin di `FantaPetilloMantraManager` la card:

```text
Generatore snapshot pubblici 2026-2027
```

La card serve a trasformare il file `fantapetillo-firestore-seed-preview-v460.json` in JSON statici da revisionare e applicare alla repo.

## Input

Usare la preview generata dalla card V460:

```text
fantapetillo-firestore-seed-preview-v460.json
```

## Output scaricabili

La card genera questi file:

```text
assets/public/config.json
assets/snapshots/seasons/manifest.json
assets/snapshots/seasons/2026-2027.json
assets/snapshots/honor.json
assets/rose/2026-2027-real-data-empty-rosters.json
```

I file vanno sostituiti manualmente nella repo solo dopo revisione.

## Sicurezza

La card V463:

```text
non scrive su Firebase
non modifica rules
non cancella documenti
non sblocca Area Squadra
non tocca ZonaOrientale
```

## Sequenza corretta

```text
V458 scarica template dati reali
V459 valida CSV/JSON dati reali
V460 genera preview Firestore
V461 importa su Firestore, se confermato
V463 genera snapshot pubblici statici da preview
V464/V465 verifica snapshot e sblocco controllato Area Squadra
```

## Note operative

Dopo avere applicato gli output della V463 alla repo, eseguire:

```bash
cd static/fantapetillomantramanager
bash tools/check-fantapetillomantramanager.sh
```

Area Squadra resta da sbloccare solo quando `teamUsers` e UID Authentication sono completi.
