# Novità ZonaOrientale - dalla V187 alla V198

## V187 - Convertitore rose Excel

Aggiunto in Admin il convertitore rose da Excel a JSON statici. Il flusso permette di caricare il file Excel delle rose e generare un overlay con:

```text
static/zonaorientale/assets/rose/manifest.json
static/zonaorientale/assets/rose/<stagione>-<data>.json
```

La conversione non scrive su Firebase: serve a preparare i file statici da committare su GitHub.

## V188 - Nomi squadre rose preservati

Corretto il convertitore rose: i nomi squadra non vengono più normalizzati o reinterpretati. Il JSON mantiene il nome scritto nell'Excel, con sola pulizia minima degli spazi.

## V189 - Avvisi admin post-modifica

Aggiunto il pannello `Pubblicazione dati` in Admin. Dopo modifiche o cancellazioni, il sito ricorda quali snapshot/JSON statici devono essere aggiornati per evitare che dopo refresh/logout ricompaiano dati vecchi.

## V190 - Stato Firebase / JSON

Aggiunto il pannello `Stato Firebase / JSON`, con semafori per controllare:

- promemoria pendenti;
- config pubblica;
- manifest snapshot stagioni;
- honor JSON;
- manifest rose;
- manifest listoni;
- manifest competizioni;
- letture Firebase stimate nella sessione.

## V191 - Procedura guidata Pubblica aggiornamenti

Aggiunta una procedura guidata in Admin che produce un piano operativo dopo modifiche dati:

1. carica dati amministrazione;
2. modifica dati;
3. aggiorna snapshot pubblici;
4. scarica JSON/overlay richiesti;
5. applica nella repo;
6. commit e push;
7. merge/push su master;
8. controlli finali.

Include pulsanti per copiare flusso e comandi Git.

## V192 - Dashboard presidente evoluta

L'Area squadra per presidenti mostra ora una dashboard più ricca con:

- saldo FM;
- giocatori in rosa;
- giocatori in vendita;
- trattative aperte;
- ultimi movimenti FM;
- partite della squadra;
- comunicati squadra;
- azioni rapide verso pagina squadra, rose e mercato.

La dashboard non forza letture mercato: il mercato resta lazy.

## V193 - Statistiche storiche

Aggiunta la nuova pagina pubblica `Statistiche`, accessibile da:

```text
/zonaorientale/#stats
```

Mostra:

- metriche storiche generali;
- club più vincenti;
- podi Campionato all-time;
- presidenti vincenti;
- ultimi titoli assegnati;
- Top FIFA Ranking.

## V194 - Tasto mobile globale “Su”

Aggiunto un tasto flottante mobile `↑ Su` per tornare rapidamente in alto nelle pagine lunghe. Compare solo su mobile, dopo scroll e quando la pagina è abbastanza lunga.

## V195 - Confronta squadre

Aggiunta la nuova pagina pubblica `Confronta`, accessibile da:

```text
/zonaorientale/#compare
```

Permette di confrontare due squadre su:

- titoli principali;
- podi Campionato;
- stagioni disputate;
- ranking FIFA;
- partite giocate;
- gol fatti/subiti;
- presidenti storici;
- ultimi titoli;
- scontri diretti.

## V196 - Archivio stagioni evoluto

Aggiunta la nuova pagina pubblica `Archivio`, accessibile da:

```text
/zonaorientale/#archive
```

Permette di selezionare una stagione e vedere:

- metriche generali;
- squadre partecipanti;
- presidenti;
- saldi FM;
- stadi;
- numero giocatori in rosa;
- movimenti FM;
- albo della stagione;
- partite recenti;
- competizioni;
- timeline sintetica.

## V197 - Generatore comunicati automatici

Aggiunto in Admin il `Generatore comunicati automatici`, con template per:

- risultati/riepilogo giornata;
- vincitore competizione;
- aggiornamento mercato;
- focus squadra;
- Albo d'Oro/Palmarès;
- aggiornamento dati pubblici.

Il generatore crea solo bozze. Non salva automaticamente su Firebase: il testo va rivisto e poi salvato dal form Comunicati.

## V198 - Riepilogo e validazione finale

Aggiornati footer/cache-buster/checklist e aggiunti documenti finali:

- release notes V187-V198;
- checklist di validazione;
- handoff AI V198.

## Nota comune sulle letture Firebase

Le nuove funzionalità pubbliche V193, V195 e V196 non aggiungono nuove letture Firebase dirette: usano dati già presenti nello stato del sito, arrivati da JSON statici, snapshot pubblici o fallback già previsti.
