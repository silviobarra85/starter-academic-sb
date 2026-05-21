# V174 - Collection admin esplicite

Data: 2026-05-21

## Obiettivo

Ridurre le letture Firebase in area admin separando le collection caricate automaticamente dalle collection usate solo per backup o snapshot pubblici.

Prima il full-load admin usava direttamente `COLLECTIONS`, array storico e mutabile nel tempo. Quando una feature aggiungeva una collection a `COLLECTIONS`, quella collection poteva entrare automaticamente nel caricamento generale admin.

## Modifiche

- Aggiunte liste esplicite in `assets/app.js`:
  - `ADMIN_FULL_LOAD_COLLECTIONS_V174`
  - `ADMIN_BACKUP_COLLECTIONS_V174`
  - `ADMIN_FULL_LOAD_EXCLUDED_COLLECTIONS_V174`
- Override di `loadFullDataV32` e `loadFullDataStableV100` per leggere solo le collection admin necessarie.
- `publicTeamSnapshots` non viene più letto al login/full-load admin.
- Il backup Firebase resta manuale e continua a poter includere `publicTeamSnapshots` tramite lista esplicita.
- Aggiornato pannello backup con indicazione delle collection lette dal caricamento admin iniziale.
- Aggiornati cache-buster e footer a V174.

## Impatto sulle letture Firebase

Il caricamento admin iniziale non legge più tutti i documenti di:

```text
publicTeamSnapshots
```

Gli snapshot squadra restano accessibili:

- in lettura puntuale quando si apre una scheda squadra pubblica;
- in scrittura quando si preme `Aggiorna schede squadra` o `Aggiorna tutto`;
- nel backup manuale Firebase.

## Test eseguiti

```bash
node --check assets/app.js
find assets -type f -name '*.js' -print0 | xargs -0 -n 1 node --check
find assets -type f -name '*.json' -print0 | xargs -0 -n 1 python3 -m json.tool
python3 -m http.server 1313 --bind 127.0.0.1
```

Asset verificati:

```text
/zonaorientale/ -> 200
/zonaorientale/assets/app.js -> 200
/zonaorientale/assets/public/config.json -> 200
/zonaorientale/assets/snapshots/seasons/manifest.json -> 200
/zonaorientale/assets/js/admin/public-snapshots.js -> 200
```
