# AI HANDOFF - ZonaOrientale V191

## Contesto

Il progetto ZonaOrientale è una webapp statica HTML/CSS/JS in:

```text
static/zonaorientale/
```

Non c'è build system. Gli overlay vanno consegnati con struttura completa sotto `static/zonaorientale` e `docs/zonaorientale`.

Il branch di lavoro corrente dell'utente è:

```text
feature/zonaorientale-v187-next
```

Il comando locale richiesto dall'utente va sempre incluso:

```bash
cd ..
python3 -m http.server 1313 --bind 0.0.0.0
```

Poi aprire:

```text
http://localhost:1313/zonaorientale/
```

Ad ogni overlay bisogna aggiornare anche la Version nel footer e i cache-buster.

## Stato fino a V191

Versione corrente:

```text
V191 procedura guidata pubblicazione
```

Principali ottimizzazioni già fatte:

- pubblico legge prima JSON statici GitHub;
- config pubblica da `assets/public/config.json`;
- snapshot stagioni statici da `assets/snapshots/seasons/`;
- honor statico da `assets/snapshots/honor.json`;
- admin leggero all'avvio;
- fantamercato lazy;
- diagnostica letture Firebase;
- preflight asset pubblici;
- checklist online finale;
- avvisi admin post-modifica V189;
- semafori Firebase/JSON V190;
- procedura guidata Pubblica aggiornamenti V191.

## Modifica V191

Aggiunto pannello admin:

```text
Procedura guidata Pubblica aggiornamenti
```

Funzioni principali aggiunte in `assets/app.js`:

```text
getPublishWizardPendingItemsV191()
getPublishWizardActionsV191()
getPublishWizardCommandsV191()
getPublishWizardRuntimeV191()
renderPublishWizardHtmlV191()
buildPublishWizardPayloadV191()
renderPublishWizardPanelV191()
injectPublishWizardStylesV191()
window.ZonaOrientalePublishWizard
```

API console disponibile:

```js
ZonaOrientalePublishWizard.build()
ZonaOrientalePublishWizard.last()
ZonaOrientalePublishWizard.commands()
ZonaOrientalePublishWizard.copy('flow')
ZonaOrientalePublishWizard.copy('commands')
```

Il pannello si integra con:

```text
V189 readAdminPublicationRemindersV189 / getAdminPublicationActionsV189
V190 runPublicationStatusV190 / readPublicationStatusV190
V180 runDeployChecklistV180 indirettamente via flusso admin esistente
```

## UX mobile

La nuova funzionalità usa card e non tabelle.

Requisiti da rispettare in futuro:

- niente overflow laterale mobile;
- bottoni a larghezza piena sotto 760px;
- testi lunghi e comandi Git sempre wrappati;
- non introdurre tabelle larghe nei pannelli admin mobile.

## Attenzione operativa

Il sito pubblico segue questa priorità:

```text
JSON statici GitHub
snapshot Firebase fallback
collection Firebase granulari solo admin su richiesta
```

Quando si modifica un dato in Admin:

1. `Carica dati amministrazione`.
2. Modifica dato.
3. `Snapshot pubblici -> Aggiorna tutto`.
4. Scarica JSON/overlay interessati.
5. Applica nella repo.
6. Commit/push.
7. Merge/push su master se devi pubblicare.

## Git per V191

Comandi suggeriti all'utente:

```bash
git status
git add static/zonaorientale/index.html static/zonaorientale/assets/app.js docs/zonaorientale/REFACTOR_V191.md docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_V191.md
git commit -m "V191 add guided publishing workflow"
git push
```
