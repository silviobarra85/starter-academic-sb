# FantaPetilloMantraManager - sandbox multi-lega V448

Questo documento descrive il clone sandbox creato in V447 e auditato in V448.

## Stato

- Percorso sito: `static/fantapetillomantramanager/`
- Percorso docs: `docs/fantapetillomantramanager/`
- Nome provvisorio: `FantaPetilloMantraManager`
- Il nome puo' cambiare.
- Stato: sandbox statico, non produzione.

## Protezioni

- Firebase e' disabilitato in `static/fantapetillomantramanager/assets/firebase.js`.
- Le scritture Firebase lanciano errore esplicito.
- Le letture Firebase ritornano vuote.
- Non viene usato il progetto Firebase ZonaOrientale.

## Dati inclusi

Il clone contiene solo dati placeholder minimi:

- `assets/public/config.json`
- `assets/snapshots/seasons/manifest.json`
- `assets/snapshots/seasons/2025-2026.json`
- `assets/snapshots/honor.json`
- manifest vuoti per listoni, rose, competizioni e calciomercato.

## Prima della produzione

1. Decidere il nome definitivo della lega.
2. Creare/configurare Firebase dedicato.
3. Aggiornare `assets/firebase.js` con credenziali nuove.
4. Definire security rules della nuova lega.
5. Sostituire i placeholder con dati reali.
6. Configurare eventuali redirect Netlify per share news se necessari.

## Test

Dalla root del clone:

```bash
bash tools/check-fantapetillomantramanager.sh
```

Dal sito ZonaOrientale, il gate principale controlla anche il clone:

```bash
bash tools/check-zonaorientale.sh
```


## Aggiornamento V448

- Aggiunto audit clone runtime `tools/audit-clone-runtime-qa-v448.mjs`.
- Aggiunto guard runtime `assets/js/core/fanta-petillo-sandbox-v448.js` con banner sandbox, `noindex,nofollow` e hiding degli entrypoint Admin/Area Squadra.
- Firebase project creato ma non collegato: il runtime continua a usare lo stub `assets/firebase.js`.
- Nessuna credenziale/config Firebase reale e' presente nel clone V448.

## Firebase dedicato

Il progetto Firebase dedicato da usare in V449 e' `fantapetillomantramanager`. La configurazione web e' stata raccolta fuori dal runtime, ma non va inserita manualmente in V448: verra' applicata con una patch dedicata e audit anti-contaminazione.


## V449 - Firebase reale dedicato

Il clone ora punta al progetto Firebase dedicato `fantapetillomantramanager` tramite:

```text
static/fantapetillomantramanager/assets/firebase.js
```

Stato operativo:

- Firebase reale collegato in modalita bootstrap protetta.
- Admin e Area Squadra ancora nascosti dal guard V449.
- Produzione non pronta: dati placeholder, noindex attivo, rules Firestore da applicare.
- Firebase ZonaOrientale non e' importato nel clone.

File rules da copiare nella console Firebase:

```text
static/fantapetillomantramanager/tools/firestore-rules-v449.rules
```

Documento operativo:

```text
docs/fantapetillomantramanager/FIREBASE_SETUP_V449.md
```


## V450 - Admin bootstrap

Il clone ora permette l'accesso Admin per inizializzare dati e configurazione, dopo la creazione manuale dell'utente admin e del documento `admins/{uid}`.

Stato operativo:

- Firebase dedicato: `fantapetillomantramanager`.
- Rules consigliate: `static/fantapetillomantramanager/tools/firestore-rules-v450.rules`.
- Admin bootstrap: abilitato.
- Area Squadra presidenti: ancora protetta.
- Produzione: non pronta, dati ancora placeholder e `noindex` attivo.


## V451 - Onboarding dati

Aggiunta una checklist nell'Admin del clone per guidare il primo inserimento dati: stagione, presidenti, squadre, squadre stagione, stadi e snapshot pubblici.

Il helper V451 e' read-only: non scrive su Firebase e non sblocca Area Squadra presidenti.
