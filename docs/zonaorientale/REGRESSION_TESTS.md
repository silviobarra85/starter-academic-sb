# Regression tests ZonaOrientale

Stato: V249.

Questo documento e' una checklist operativa per evitare regressioni prima di fondere un branch su `master` o prima di pubblicare una modifica rilevante. Non sostituisce `FUNZIONALITA'.md`: quel file resta il registro funzionale e va modificato solo su richiesta esplicita.

## Regola generale

Per ogni overlay codice/UI verificare sempre:

1. footer con versione attesa;
2. cache-buster HTML principali allineati;
3. assenza di errori bloccanti in Console;
4. test desktop e mobile;
5. comportamento Firebase coerente con utente anonimo, presidente e admin.

## Smoke test pubblico

### Avvio

- Aprire `/zonaorientale/`.
- Verificare che il footer mostri la versione corrente.
- Verificare che la Dashboard carichi senza errori bloccanti.
- Aprire e richiudere menu mobile/bottom navigation.

### Dashboard

- Vedere riepilogo stagione corrente.
- Vedere card squadre/competizioni/news recenti.
- Da mobile, usare le azioni rapide principali.

### News

- Aprire la sezione `News`.
- Espandere un comunicato.
- Copiare/condividere link WhatsApp.
- Aprire un hash diretto `#news-...`, quando disponibile.

### Rose

- Aprire `Rose`.
- Selezionare almeno due squadre.
- Verificare giocatori, ruoli, costo e quotazione.
- Controllare tabella movimenti, ricerca e filtro squadra.

### Fantamercato pubblico

- Aprire `Fantamercato`.
- Verificare lista giocatori in vendita.
- Usare ricerca e filtro squadra.
- Da mobile, verificare card e scroll.

### Listone

- Aprire `Listone`.
- Testare ricerca giocatore.
- Testare filtri ruolo.
- Testare stati: `In listone`, `Asteriscato`, `Svincolati`.
- Verificare che i filtri non si sovrappongano in modo anomalo.
- Aprire almeno una scheda giocatore.

### Competizioni

- Aprire `Competizioni`.
- Aprire una competizione in dettaglio.
- Verificare calendario, risultati e classifiche.
- Per campionato, verificare colonne POS/SQUADRA/PUNTI/PG/V/N/P/GF/GS/DR/FPT.

### Archivio

- Aprire `Archivio`.
- Cambiare stagione.
- Verificare squadre, competizioni, risultati e dati FM se presenti.

### Albo e statistiche

- Aprire `Albo d'Oro`.
- Verificare albo, palmares e FIFA Ranking.
- Aprire `Statistiche`.
- Verificare titoli, presidenti e ranking storici.

### Confronta

- Aprire `Confronta`.
- Selezionare due squadre.
- Verificare che il confronto venga renderizzato.

### Regolamento

- Aprire `Regolamento`.
- Verificare indice e contenuti principali.

## Smoke test Presidente

### Login e Dashboard Presidente

- Login con presidente approvato.
- Verificare header con logo squadra e `Pres. Cognome`.
- Aprire Dashboard Presidente.
- Verificare saldo FM, rosa, giocatori in vendita e trattative.

### Comunicati squadra

- Compilare `Comunicato squadra`.
- Inviare.
- Verificare comparsa richiesta in Admin -> Richieste presidenti.
- Approvare da admin e verificare pubblicazione in News.

### Comunicati avvenuto scambio

- Compilare `Comunicato avvenuto scambio`.
- Inviare.
- Verificare invio EmailJS a `caparrotti86@yahoo.it`.
- Verificare comparsa richiesta in Admin -> Richieste presidenti.
- Approvare da admin e verificare pubblicazione in News con topic corretto.

### Trattative

- Presidente A invia proposta a Presidente B.
- Presidente B vede badge rosso persistente.
- Presidente B apre Dashboard Presidente -> Trattative.
- Presidente B approva o rifiuta.
- Presidente B non vede piu' badge per quella proposta.
- Presidente A vede badge rosso di esito.
- Presidente A apre card proposta conclusa.
- Badge del Presidente A sparisce e resta spento dopo refresh, se Firebase consente il salvataggio lettura.
- Ripetere almeno un controllo da mobile.

### Storico trattative

- Verificare sezioni `Inviate` e `Ricevute`.
- Verificare che siano visibili le ultime 5 e che lo storico sia scrollabile.
- Verificare che proposta ed esito rimangano leggibili.

## Smoke test Admin

### Accesso admin

- Login admin.
- Aprire `Admin`.
- Caricare dati amministrazione completi solo quando serve.
- Verificare assenza di permission-denied imprevisti.

### Accetta utenti

- Aprire `Accetta utenti`.
- Verificare che utenti gia' approvati non compaiano come pending.
- Verificare che utenti rifiutati restino `REJECTED` e non tornino pending da soli.

### Richieste presidenti

- Aprire `Richieste presidenti`.
- Usare `Aggiorna richieste`.
- Approvare un comunicato squadra.
- Rifiutare un comunicato squadra.
- Approvare un comunicato avvenuto scambio.
- Rifiutare un comunicato avvenuto scambio.
- Per richieste rifiutate o approvate, verificare pulsante `Elimina da Firebase`.
- Dopo eliminazione, premere `Aggiorna richieste` e verificare che non torni.

### News admin

- Creare/modificare/eliminare comunicato admin, se in test controllato.
- Verificare preview/condivisione quando disponibile.

### Competizioni admin

- Aprire pannello competizioni.
- Verificare elenco, calendario, risultati e classifiche.
- Non salvare modifiche su produzione senza necessita'.

### Snapshot e pubblicazione

- Aprire area snapshot pubblici.
- Verificare preflight asset.
- Verificare procedure download overlay quando disponibili.
- Controllare checklist deploy online.

### Backup

- Verificare apertura area backup.
- Testare export solo se necessario e in ambiente sicuro.

## Test tecnico pre-commit

Eseguire almeno:

```bash
node --check static/zonaorientale/assets/app.js
find static/zonaorientale/assets -name '*.js' -print0 | xargs -0 -n1 node --check
python3 -m json.tool static/zonaorientale/assets/public/config.json >/dev/null
```

## Test Git consigliato

```bash
git status
git diff --stat
git diff -- static/zonaorientale/index.html static/zonaorientale/assets/app.js docs/zonaorientale/CHANGELOG_CONSOLIDATO.md
```

Prima del merge su `master`, verificare che `FUNZIONALITA'.md` non sia cambiato salvo richiesta esplicita.

## Nota V248

Aggiungere al test Presidente: verificare che in DevTools `window.ZonaOrientaleLegacyCleanupV248.legacyTransferCommunicationArtifacts` sia `0` dopo apertura della Dashboard Presidente.


### Admin richieste presidenti V249

- Aprire `Admin -> Richieste presidenti`.
- Cliccare `Aggiorna richieste` e verificare che la lista venga riletta senza errori.
- Su una richiesta `PENDING`, verificare che `Approva` e `Rifiuta` funzionino.
- Su un comunicato `APPROVED` o `REJECTED`, verificare che `Elimina da Firebase` chieda conferma e rimuova solo la richiesta da `teamRequests`.
- Controllare in console `window.ZonaOrientaleTeamRequestsV249`.
