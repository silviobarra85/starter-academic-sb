# Operativita Admin e release

Stato: V225.

## Regola d'oro dati

Firebase e' area di lavoro / live / fallback. I JSON statici sono la fonte pubblica prioritaria dopo refresh/logout quando esistono.

Quindi: se un dato esiste anche nei JSON statici, non basta modificarlo in Firebase.

Flusso generale:

```text
1. Modifica da Admin
2. Aggiorna snapshot Firebase
3. Scarica JSON/static overlay aggiornati
4. Applica nella repo
5. Commit + push
6. Test online o locale
```

`Aggiorna tutto` aggiorna Firebase/snapshot, non fa commit su GitHub.

## Caso A - Squadre, risultati, classifiche o competizioni

Quando modifichi dati stagione, classifiche, risultati, competizioni o nomi squadra:

```text
1. Admin -> Carica dati amministrazione
2. Modifica il dato
3. Admin -> Snapshot pubblici -> Aggiorna tutto
4. Scarica overlay snapshot stagioni
5. Se il dato compare anche in Albo/Palmares/FIFA, scarica anche honor.json
6. Applica overlay nella repo
7. Commit + push
```

Comandi tipici:

```bash
unzip ~/Downloads/NOME_OVERLAY_SNAPSHOT_STAGIONI.zip -d .
cp ~/Downloads/honor.json static/zonaorientale/assets/snapshots/honor.json

git status
git add -f static/zonaorientale/assets/snapshots/seasons/manifest.json
git add -f static/zonaorientale/assets/snapshots/seasons/*.json
git add -f static/zonaorientale/assets/snapshots/honor.json
git commit -m "Update static public snapshots"
git push
```

Se non hai modificato Albo/Palmares/FIFA, `honor.json` puo non servire.

## Caso B - Albo, Palmares o FIFA Ranking

```text
1. Admin -> Carica dati amministrazione
2. Modifica Albo/Palmares/FIFA
3. Admin -> Snapshot pubblici -> Aggiorna tutto
4. Scarica honor JSON
5. Sostituisci static/zonaorientale/assets/snapshots/honor.json
6. Commit + push
```

Comandi:

```bash
cp ~/Downloads/honor.json static/zonaorientale/assets/snapshots/honor.json

git status
git add -f static/zonaorientale/assets/snapshots/honor.json
git commit -m "Update static honor snapshot"
git push
```

## Caso C - Rose da Excel

Flusso corretto:

```text
1. Admin -> Rose e Movimenti FM
2. Converti rose e scarica overlay
3. Applica overlay nella repo
4. Commit + push dei JSON rose
5. Admin -> Rose e Movimenti FM -> Inizializza rose dal file statico
6. Admin -> Snapshot pubblici -> Aggiorna tutto
7. Scarica overlay snapshot stagioni
8. Commit + push snapshot stagioni
```

Comandi overlay rose:

```bash
unzip ~/Downloads/NOME_OVERLAY_ROSE.zip -d .

git status
git add -f static/zonaorientale/assets/rose/manifest.json
git add -f static/zonaorientale/assets/rose/*.json
git commit -m "Update static rosters"
git push
```

Poi dopo reinizializzazione e snapshot:

```bash
unzip ~/Downloads/NOME_OVERLAY_SNAPSHOT_STAGIONI.zip -d .

git add -f static/zonaorientale/assets/snapshots/seasons/manifest.json
git add -f static/zonaorientale/assets/snapshots/seasons/*.json
git commit -m "Update season snapshots after roster import"
git push
```

## Caso D - Listone da Excel

```text
1. Admin -> Converti listone Excel
2. Scarica overlay/listone JSON
3. Applica overlay nella repo
4. Commit + push
```

Percorsi:

```text
static/zonaorientale/assets/listoni/manifest.json
static/zonaorientale/assets/listoni/<file>.json
```

Comandi:

```bash
unzip ~/Downloads/NOME_OVERLAY_LISTONE.zip -d .

git add -f static/zonaorientale/assets/listoni/manifest.json
git add -f static/zonaorientale/assets/listoni/*.json
git commit -m "Update static listone"
git push
```

## Caso E - Stagione corrente o elenco stagioni

Aggiornare:

```text
static/zonaorientale/assets/public/config.json
```

Comandi:

```bash
cp ~/Downloads/config.json static/zonaorientale/assets/public/config.json

git status
git add -f static/zonaorientale/assets/public/config.json
git commit -m "Update public config"
git push
```

## Overlay codice/UI

Quando si modifica codice o UI:

1. Aggiornare footer `Version` in `index.html` e, se coinvolte, `competition.html`, `player.html`, `news.html`.
2. Aggiornare cache-buster `?v=XXX` negli HTML.
3. Se si modifica un modulo importato da `app.js`, aggiornare anche il query param nello static import.
4. Aggiornare `AI_HANDOFF_ZONAORIENTALE_CURRENT.md` e `CHANGELOG_CONSOLIDATO.md`.
5. Consegnare zip unico con solo file modificati:

```text
zonaorientale/...
docs/...
```

## Test sintattici

Da `static/zonaorientale`:

```bash
find assets -name '*.js' -type f -print0 | xargs -0 -n1 node --check
find assets -name '*.json' -type f -print0 | xargs -0 -n1 jq empty
```

Fallback senza `jq`:

```bash
find assets -name '*.json' -type f -print0 | xargs -0 -n1 python3 -m json.tool >/dev/null
```

## Test locale

Se sei in `static/zonaorientale`:

```bash
cd ..
python3 -m http.server 1313 --bind 0.0.0.0
```

Aprire:

```text
http://localhost:1313/zonaorientale/
```

## Checklist manuale rapida

Desktop:

```text
- Home/dashboard
- Albo d'Oro
- Competizioni
- Pagina singola competizione
- Archivio
- Statistiche
- Confronta
- Admin se disponibile
```

Mobile:

```text
- Bottom menu solo smartphone
- Pulsante Su solo dopo scroll
- Classifiche campionato con scroll orizzontale
- Nessuno sforamento laterale evidente
```

## Comandi Git standard per consegna codice

Esempio:

```bash
git status
git add static/zonaorientale/index.html \
  static/zonaorientale/assets/app.js \
  docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_CURRENT.md \
  docs/zonaorientale/CHANGELOG_CONSOLIDATO.md
git commit -m "fix: descrizione coerente"
```

## Comandi Git per applicare questa riorganizzazione docs

Questa riorganizzazione sostituisce molti vecchi file con pochi documenti canonici. Per eliminare davvero i vecchi docs dalla repo, usare `git rm` come indicato nella risposta di consegna della patch.

## Nota V224 statistiche storiche

Se in Albo una competizione risulta `NON_DISPUTATA`, quella cella non deve essere conteggiata come titolo ne' comparire tra i club piu vincenti.

La sottosezione `Presidenti piu vincenti` dipende dagli snapshot stagione statici per recuperare `seasonTeams.presidenteIds` e `presidents` storici. Dopo modifiche storiche ad Albo, squadre stagionali o presidenti, rigenerare e pubblicare sia:

```text
honor.json
snapshot stagioni statici
```



## Nota V225 stabilizzazione

Dopo i refactor V220-V224, il sito espone in console/browser:

```js
window.ZonaOrientaleRefactorStatus
```

Il campo `ok` deve essere `true`. Se `ok` e' `false`, leggere `checks` per capire quale modulo refactor non risulta disponibile. Questo controllo non sostituisce i test manuali, ma aiuta a intercettare subito regressioni da cache o helper mancanti.
