# AI Handoff ZonaOrientale - V198

## Stato corrente

Il progetto è sul ciclo funzionale V187-V198, dopo il grande lavoro di riduzione letture Firebase e consolidamento JSON/static snapshot. La versione corrente dell'app è:

```text
V198 riepilogo aggiornamenti
```

## Branch di lavoro consigliato

Il branch operativo usato dall'utente è:

```text
feature/zonaorientale-v187-next
```

La pubblicazione avviene tramite merge/push su `master` quando l'utente lo richiede.

## Regole operative da rispettare

1. Ogni overlay applicativo deve aggiornare la Version nel footer.
2. Ogni overlay deve aggiornare i cache-buster in `index.html`.
3. Ogni overlay deve aggiornare la versione attesa dalla Checklist online finale in `assets/app.js`.
4. Ogni overlay deve includere anche un handoff AI dedicato.
5. Ogni risposta di consegna overlay deve includere:
   - link zip overlay
   - file modificati
   - test eseguiti
   - comandi per applicare overlay
   - comandi per lanciare in locale
   - comandi Git

## Comandi locali da includere sempre

Se l'utente è dentro `static/zonaorientale`:

```bash
cd ..
python3 -m http.server 1313 --bind 0.0.0.0
```

Poi aprire:

```text
http://localhost:1313/zonaorientale/
```

## Architettura dati attuale

Ordine di lettura pubblico:

1. JSON statici GitHub/local statico.
2. Snapshot Firebase come fallback.
3. Collection Firebase granulari solo admin su richiesta.

File statici importanti:

```text
static/zonaorientale/assets/public/config.json
static/zonaorientale/assets/snapshots/honor.json
static/zonaorientale/assets/snapshots/seasons/manifest.json
static/zonaorientale/assets/snapshots/seasons/*.json
static/zonaorientale/assets/rose/manifest.json
static/zonaorientale/assets/rose/*.json
static/zonaorientale/assets/listoni/manifest.json
static/zonaorientale/assets/listoni/*.json
static/zonaorientale/assets/competitions/manifest.json
```

## Funzionalità V187-V198

- V187/V188: convertitore Excel rose statiche senza normalizzazione nomi squadra.
- V189: promemoria admin post-modifica dati.
- V190: stato pubblicazione Firebase/JSON con semafori.
- V191: procedura guidata pubblicazione aggiornamenti.
- V192: dashboard presidente evoluta.
- V193: pagina statistiche storiche.
- V194: tasto mobile globale "Su".
- V195: pagina confronta squadre.
- V196: archivio stagioni evoluto.
- V197: generatore comunicati automatici.
- V198: release notes e checklist validazione finale.

## Attenzione importante

Se l'utente modifica dati da Admin, dopo `Aggiorna tutto` deve scaricare e committare anche i JSON statici corrispondenti, altrimenti dopo refresh/logout il sito pubblico può tornare ai dati vecchi. In particolare:

- Squadre/stagioni/competizioni/risultati/rose/news stagionali → overlay snapshot stagioni.
- Albo/Palmarès/FIFA Ranking → `honor.json`.
- Stagione corrente/config → `config.json`.
- Rose Excel → overlay rose, poi inizializzazione rose statiche, poi snapshot stagioni.
