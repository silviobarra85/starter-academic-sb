# Operativita Admin e release

Stato: V247.

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

## Nota V226 statistiche storiche

Dopo deploy V226 o successivi verificare in `#stats`:

- `Club più vincenti`: nomi club visibili, non solo trattini;
- `Podi Campionato`: nomi club visibili, non solo trattini;
- `Ultimi titoli assegnati`: nomi storici visibili per piu stagioni;
- `Top FIFA Ranking`: nessuna nota generica `FIFA Ranking` ripetuta vicino alle squadre.

Se ricompaiono trattini, controllare che `assets/snapshots/honor.json` sia pubblicato e che venga normalizzato come `snapshot.honorRows`.

## Nota V227 Archivio FM

Dopo deploy V227 verificare in `#archive` / Archivio stagioni, selezionando almeno la stagione corrente 2025-2026:

- nelle card `Squadre della stagione`, il campo `Saldo` deve mostrare i crediti residui reali quando presenti negli snapshot rose o nei movimenti FM;
- squadre con saldo reale zero possono mostrare `0 FM`;
- stagioni prive di dati FM devono mostrare `-`, non un falso `0 FM` generalizzato.


## Caso E - Nuovo comunicato e anteprima WhatsApp

Da V231 non serve piu' generare e committare file HTML per ogni comunicato.

Flusso corretto:

1. Pubblica il comunicato da Admin.
2. Dopo il salvataggio, usa `Copia link WhatsApp` sul comunicato.
3. Il link avra' forma:

```text
https://silviobarra.com/zonaorientale/share/news/<id-comunicato>?v=<id-comunicato>
```

4. Netlify instrada il path alla funzione `netlify/functions/news-share.js`.
5. La funzione legge il comunicato da Firebase/Firestore e restituisce i meta Open Graph corretti.
6. Il browser viene poi reindirizzato alla webapp su `/#news-<id-comunicato>`.

Non fare piu' il vecchio flusso V228/V230 con `node tools/generate-news-share-pages.mjs`, salvo manutenzione legacy.

Se WhatsApp mostra ancora una preview vecchia, prova a condividere il link con il parametro `?v=<id>` appena copiato dal sito.

## Nota V230 - Verifica link WhatsApp comunicati

Dopo il deploy di un comunicato, il link copiato deve avere forma:

```text
https://silviobarra.com/zonaorientale/comunicati/<slug>.html?v=<id>
```

Non deve contenere `www`. Se si apre `Apri preview`, la pagina deve esistere e poi reindirizzare alla webapp tramite hash `#news-...`.

## Test manuale specifico V229

Dopo deploy o test locale:

```text
1. Login con account presidente approvato.
2. Verificare che nel header non compaia piu `Account`.
3. Verificare che compaia logo squadra + `Pres. Cognome`.
4. Cliccare il pulsante e verificare apertura Dashboard Presidente.
5. Logout e verificare ritorno del pulsante `Accedi / Registrati`.
6. Login admin e verificare che la navigazione Admin non cambi.
```


Nota V241: il flusso Accetta utenti conserva i rifiuti come `REJECTED` e filtra i duplicati di utenti gia approvati, evitando ricomparse non volute in Admin.


Nota V243: per i comunicati di avvenuto scambio il presidente non scrive direttamente in `news`; crea una richiesta `TRANSFER_NEWS`, manda EmailJS alla lega e l Admin pubblica approvando la richiesta.

Nota V245: dopo aver approvato o rifiutato un comunicato in Admin -> Richieste presidenti, compare `Elimina da Firebase`. Usarlo solo quando si vuole rimuovere definitivamente il documento `teamRequests` approvato/rifiutato; se il comunicato approvato e' gia' in News, la news pubblicata non viene rimossa.


## Nota V246

Le notifiche degli esiti trattative sono sincronizzate su Firebase quando possibile. Per testare:

```text
1. Presidente A invia proposta a Presidente B
2. Presidente B approva/rifiuta
3. Presidente A vede badge esito
4. Presidente A apre Dashboard Presidente -> Trattative -> card proposta
5. Il badge sparisce anche dopo refresh o da altro dispositivo, se le rules permettono l'update su transferNegotiations
```

Se le rules negano l'update di lettura, il sito usa ancora `localStorage` come fallback locale e in console puo' apparire il warning `Lettura esito trattativa salvata solo localmente`.


## Nota V247

Prima di fondere un branch su `master`, usare `REGRESSION_TESTS.md` come checklist minima. La checklist include test pubblico, presidente, admin, mobile, notifiche trattative, comunicati e controlli tecnici pre-commit.
