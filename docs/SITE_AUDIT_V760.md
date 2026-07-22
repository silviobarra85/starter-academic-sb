# Audit tecnico bootstrap e deploy - V760

Data: 22/07/2026.

## Esito della diagnosi

La presenza della scritta `V759` nel footer dimostra soltanto che il nuovo `index.html` e stato pubblicato o servito dalla cache. Non dimostra che il resto della release sia coerente.

La V759, applicata integralmente in locale, riesce a leggere configurazione e snapshot anche con Firebase bloccato. Il comportamento osservato sul sito pubblicato e quindi compatibile soprattutto con una release mista o incompleta:

1. `index.html` V759 presente;
2. uno o piu moduli JavaScript V759 assenti, vecchi o non raggiungibili;
3. oppure uno dei JSON essenziali assente/non valido;
4. il footer appare comunque, mentre il grafo moduli o il caricamento dati si interrompe prima del render.

Il punto piu fragile introdotto in V759 era l'import statico del nuovo file condiviso:

`/fanta-engine/js/core/static-first-bootstrap-v759.js?v=759`

Se il file non veniva copiato/pubblicato insieme a `app.js`, il browser interrompeva l'intero modulo applicativo. Inoltre, quando config o snapshot statici mancavano, i loader storici potevano ancora tentare un fallback Firebase: questo contraddiceva il contratto static-first e poteva lasciare la pagina apparentemente in attesa.

## Correzione strutturale V760

### 1. Avvio pubblico realmente indipendente da Firebase

Il percorso iniziale usa esclusivamente:

- `assets/public/config.json`;
- `assets/snapshots/seasons/manifest.json`;
- lo snapshot della stagione corrente;
- `assets/snapshots/honor.json`.

Non esiste piu un fallback Firebase durante il bootstrap pubblico. Se un file obbligatorio manca, il sito mostra un errore preciso e termina rapidamente il tentativo invece di restare bloccato.

Firebase viene importato soltanto dopo il primo render, per autenticazione, ruoli e amministrazione.

### 2. Nessun nuovo single point of failure cross-root

`app.js` non importa staticamente il coordinatore V760 appena aggiunto in FantaEngine. Contiene una facade minima di sicurezza per il proprio avvio. Il contratto canonico condiviso resta pubblicato in:

`/fanta-engine/js/core/static-first-bootstrap-v760.js`

In questo modo FantaEngine resta il riferimento architetturale condiviso, ma l'assenza accidentale di un singolo nuovo modulo del motore non rende inutilizzabile la lega pubblica.

### 3. Primo render piu rapido

Prima del primo render vengono caricati solo config, stagione e albo. Listoni, rose archiviate e calendari complementari vengono caricati in background e producono un secondo render.

Eventi diagnostici:

- `fanta:public-core-ready-v760`;
- `fanta:static-assets-ready-v760`.

Lo stato e disponibile anche in:

- `window.ZonaOrientaleModuleEntryV760`;
- `window.ZonaOrientaleBootstrapV760`;
- `window.ZonaOrientaleFirebaseRuntimeV760`;
- `state.staticAssetsStatusV760`.

### 4. Errori del grafo moduli visibili

L'entrypoint della home usa un `import()` osservabile. Se `app.js` o un suo import non esiste, la pagina non rimane vuota: `#errorBox` indica che il deploy V760 e incompleto e riporta il messaggio del browser.

### 5. Deploy bloccato quando la release non e coerente

`netlify/build-hugo-0.80.sh` esegue l'audit V760:

1. sui sorgenti prima della build;
2. su `public/` dopo la build Hugo.

La pubblicazione fallisce se mancano config, snapshot, modulo corrente, import diretti o riferimenti V760. Questo trasforma un errore di copia in un errore di build, prima che raggiunga gli utenti.

### 6. Controllo post-deploy reale

Il nuovo comando interroga il sito pubblicato, elude la cache e controlla home, app, config, manifest, snapshot, FantaEngine e tutti gli import statici diretti di `app.js`:

```bash
node static/zonaorientale/tools/check-live-v760.mjs https://silviobarra.com
```

Il comando termina con codice 1 e indica esattamente l'URL mancante o incoerente.

### 7. Cache degli entrypoint

Sono impostate regole `max-age=0, must-revalidate` per:

- `/zonaorientale/assets/app.js`;
- `/zonaorientale/assets/league-config.json`;
- JSON pubblici e snapshot;
- contratto FantaEngine V760.

I cache-buster V760 sono allineati nelle pagine e nei consumer del modulo di configurazione.


### 8. Manifest di release

`/zonaorientale/release.json` dichiara versione, entrypoint e file essenziali della release. Viene validato sia in build sia dal controllo live e deve essere aggiornato insieme a ogni nuova versione.

## Ruolo di FantaEngine

FantaEngine e il livello comune della piattaforma:

- contratti di bootstrap e diagnostica;
- componenti e moduli condivisi;
- resolver dei path;
- dataset e asset condivisi;
- infrastruttura riutilizzabile dalle diverse leghe.

Non deve essere proprietario dei dati specifici della lega e non deve diventare un requisito remoto aggiuntivo per mostrare uno snapshot gia presente nella cartella della lega. V760 separa quindi il **contratto condiviso** dalla **capacita minima di avvio locale**.

## Ruolo di ioSudo

ioSudo resta una PWA autonoma, principalmente read-only, che consuma i dataset normalizzati del FantaEngine. Non partecipa al bootstrap della home ZonaOrientale e non e la causa del mancato caricamento attuale.

La dipendenza corretta e:

`dataset FantaEngine -> ioSudo`

non:

`bootstrap ZonaOrientale -> ioSudo` oppure `ioSudo -> Firebase ZonaOrientale`.

## Problemi non risolti da nascondere

V760 rende l'avvio affidabile, ma restano debiti tecnici:

- `app.js` e ancora un monolite molto grande con ridefinizioni storiche;
- troppi moduli e fogli CSS sono caricati dalla home;
- gli snapshot devono essere generati e pubblicati automaticamente dopo le modifiche admin;
- FantaEngine contiene molte copie storiche da separare dal runtime corrente;
- serve un E2E browser nel CI reale, oltre agli audit deterministici.

La prossima estrazione consigliata e spostare bootstrap, auth e public-data loading fuori dal monolite, mantenendo un entrypoint stabile e testato.
