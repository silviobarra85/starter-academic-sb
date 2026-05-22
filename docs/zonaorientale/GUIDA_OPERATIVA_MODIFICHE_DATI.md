# Guida operativa modifiche dati

Sì. La regola generale è questa:

Firebase = area di lavoro / dati modificabili da Admin
Snapshot Firebase = copia pubblica veloce su Firebase
JSON GitHub = fonte pubblica prioritaria dopo refresh/logout

Quindi, se un dato esiste anche nei JSON statici, non basta modificarlo in Firebase: dopo refresh/logout il sito rilegge il JSON GitHub e può tornare al dato vecchio.

Regola d’oro

Ogni volta che fai una modifica da Admin devi chiederti:

Questo dato viene letto anche dai JSON statici?

Se sì, il flusso completo è:

1. Modifico da Admin
2. Aggiorno snapshot Firebase
3. Scarico i JSON/static overlay aggiornati
4. Li applico nella repo
5. Commit + push
6. Se necessario, merge su master

Aggiorna tutto aggiorna Firebase, non GitHub.


---

Flusso standard per modificare dati pubblici

1. Entra come Admin

Login Admin
↓
Admin
↓
Carica dati amministrazione

Questo carica i dati granulari da Firebase e ti permette di modificarli.

2. Fai la modifica

Esempi:

- cambio nome squadra storica
- cambio presidente
- modifica albo
- modifica ranking FIFA
- modifica competizione
- modifica risultato
- modifica rosa
- modifica comunicato

3. Aggiorna gli snapshot pubblici Firebase

Vai in:

Admin → Snapshot pubblici

e premi:

Aggiorna tutto

Questo aggiorna:

publicSeasonSnapshots
publicSnapshots/honor
publicTeamSnapshots

A questo punto nella sessione corrente potresti già vedere i dati corretti.

4. Scarica anche i JSON statici necessari

Questa è la parte importante.

A seconda di cosa hai modificato, devi scaricare questi file.

Cosa hai modificato	Cosa devi scaricare

Squadre per stagione, classifiche, risultati, competizioni, rose, movimenti, news stagionali	Scarica overlay snapshot stagioni
Albo d’Oro, Palmarès, FIFA Ranking, nomi che appaiono in Albo/Palmarès	Scarica honor JSON
Stagione corrente, elenco stagioni, impostazioni pubbliche base	Scarica config pubblica
Rose da Excel	Converti rose e scarica overlay
Listone da Excel	Converti listone Excel
Competizione storica da Excel	funzione di export/import competizione statica



---

Caso A — Modifico nomi squadre, risultati, classifiche o competizioni

Flusso:

1. Admin → Carica dati amministrazione
2. Modifica il dato
3. Admin → Snapshot pubblici → Aggiorna tutto
4. Scarica overlay snapshot stagioni
5. Se il dato compare anche in Albo/Palmarès, scarica anche honor JSON
6. Applica gli zip/file nella repo
7. Commit + push

Comandi tipici:

unzip ~/Downloads/NOME_OVERLAY_SNAPSHOT_STAGIONI.zip -d .

cp ~/Downloads/honor.json static/zonaorientale/assets/snapshots/honor.json

git status
git add -f static/zonaorientale/assets/snapshots/seasons/manifest.json
git add -f static/zonaorientale/assets/snapshots/seasons/*.json
git add -f static/zonaorientale/assets/snapshots/honor.json
git commit -m "Update static public snapshots"
git push

Se non hai modificato Albo/Palmarès/FIFA, puoi evitare honor.json.


---

Caso B — Modifico Albo d’Oro, Palmarès o FIFA Ranking

Flusso:

1. Admin → Carica dati amministrazione
2. Modifica Albo/Palmarès/FIFA
3. Admin → Snapshot pubblici → Aggiorna tutto
4. Scarica honor JSON
5. Sostituisci static/zonaorientale/assets/snapshots/honor.json
6. Commit + push

Comandi:

cp ~/Downloads/honor.json static/zonaorientale/assets/snapshots/honor.json

git status
git add -f static/zonaorientale/assets/snapshots/honor.json
git commit -m "Update static honor snapshot"
git push


---

Caso C — Aggiorno le rose da Excel

Flusso corretto:

1. Admin → Rose e Movimenti FM
2. Converti rose e scarica overlay
3. Applica overlay nella repo
4. Commit + push dei JSON rose
5. Admin → Rose e Movimenti FM → Inizializza rose dal file statico
6. Admin → Snapshot pubblici → Aggiorna tutto
7. Scarica overlay snapshot stagioni
8. Commit + push snapshot stagioni

Comandi dopo aver scaricato overlay rose:

unzip ~/Downloads/NOME_OVERLAY_ROSE.zip -d .

git status
git add -f static/zonaorientale/assets/rose/manifest.json
git add -f static/zonaorientale/assets/rose/*.json
git commit -m "Update static rosters"
git push

Poi, dopo Inizializza rose dal file statico e Aggiorna tutto:

unzip ~/Downloads/NOME_OVERLAY_SNAPSHOT_STAGIONI.zip -d .

git add -f static/zonaorientale/assets/snapshots/seasons/manifest.json
git add -f static/zonaorientale/assets/snapshots/seasons/*.json
git commit -m "Update season snapshots after roster import"
git push


---

Caso D — Aggiorno il listone da Excel

Flusso:

1. Admin → Converti listone Excel
2. Scarica overlay/listone JSON
3. Applica overlay nella repo
4. Commit + push

Percorsi coinvolti:

static/zonaorientale/assets/listoni/manifest.json
static/zonaorientale/assets/listoni/<file>.json

Comandi:

unzip ~/Downloads/NOME_OVERLAY_LISTONE.zip -d .

git add -f static/zonaorientale/assets/listoni/manifest.json
git add -f static/zonaorientale/assets/listoni/*.json
git commit -m "Update static listone"
git push


---

Caso E — Modifico stagione corrente o elenco stagioni

Se modifichi:

- stagione corrente
- nome stagione
- stagioni disponibili
- impostazioni pubbliche base

devi aggiornare:

static/zonaorientale/assets/public/config.json

Flusso:

1. Admin → Carica dati amministrazione
2. Modifica stagioni/impostazioni
3. Admin → Snapshot pubblici → Scarica config pubblica
4. Sostituisci config.json
5. Commit + push

Comandi:

cp ~/Downloads/config.json static/zonaorientale/assets/public/config.json

git add -f static/zonaorientale/assets/public/config.json
git commit -m "Update static public config"
git push


---

Caso F — Cancello dati

Per cancellare dati vale la stessa regola delle modifiche.

Se cancelli da Firebase/Admin

Esempio:

- cancello una competizione
- cancello una partita
- cancello un risultato
- cancello una rosa
- cancello un record albo

Poi devi fare:

1. Admin → Snapshot pubblici → Aggiorna tutto
2. Scarica i JSON statici coinvolti
3. Applica nella repo
4. Commit + push

Se cancelli una cosa ma non aggiorni il JSON statico, dopo refresh/logout può ricomparire.

Se cancelli un file statico

Devi anche aggiornare il relativo manifest.

Esempio rose:

assets/rose/2025-2026-vecchio.json
assets/rose/manifest.json

Non basta cancellare il JSON: devi togliere anche la voce dal manifest.

Comandi esempio:

rm static/zonaorientale/assets/rose/NOME_FILE_VECCHIO.json

git add -f static/zonaorientale/assets/rose/manifest.json
git rm static/zonaorientale/assets/rose/NOME_FILE_VECCHIO.json
git commit -m "Remove old static roster snapshot"
git push


---

Caso G — Pubblicare tutto online su master

Quando hai finito le modifiche sul branch attuale:

git status
git push

Poi porta tutto su master:

git checkout master
git pull --ff-only origin master
git merge --no-ff feature/zonaorientale-v187-next
git push origin master
git checkout feature/zonaorientale-v187-next

Se si apre Vim nel merge:

Esc
:wq
Invio


---

Controlli prima di pubblicare

In locale:

cd ..
python3 -m http.server 1313 --bind 0.0.0.0

Apri:

http://localhost:1313/zonaorientale/

Da Admin esegui:

Controlla asset pubblici
Checklist online finale

Devono essere OK soprattutto:

config.json
honor.json
manifest snapshot stagioni
manifest rose
manifest listoni
manifest competizioni
Version/cache-buster


---

Riassunto operativo breve

Per qualsiasi modifica importante:

1. Carica dati amministrazione
2. Modifica
3. Aggiorna tutto
4. Scarica i JSON interessati
5. Applica nella repo
6. Commit
7. Push
8. Merge su master se vuoi pubblicare

Tabella mentale:

Stagioni/squadre/risultati/rose/news → overlay snapshot stagioni
Albo/Palmarès/FIFA → honor.json
Stagione corrente/config → config.json
Rose Excel → overlay rose + inizializza rose statiche + snapshot stagioni
Listone Excel → overlay listone
Competizioni storiche → overlay competizioni

Nessuna modifica al codice in questa risposta, quindi non ci sono comandi Git obbligatori da eseguire ora.
