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

## V452 - Favicon e icone stagione 2026-2027

La V452 aggiorna favicon e icone PWA/social del clone con sigla `FPMM` e stagione `2026-2027`. Sono stati aggiornati `favicon.ico`, le PNG in `assets/icons/` e aggiunto il sorgente `fantapetillo-favicon-source.svg`.

La modifica non tocca Firebase, Admin, rules o Area Squadra. L'Admin onboarding V451 resta attivo e Area Squadra resta guardata fino a inserimento dati reali e `teamUsers`.


## V453 - Regolamento 2026-2027

La sezione `Regolamento` del clone e' stata sostituita con una struttura dedicata al regolamento ufficiale `Fantacalcio MANTRA® Manageriale 2026-2027`.

Sono stati aggiunti:

- PDF pubblico scaricabile in `assets/regolamento/regolamento-fantapetillo-mantra-manager-2026-2027.pdf`;
- pulsanti `Scarica PDF` e `Apri PDF` nella sezione `/#regolamento`;
- riepilogo navigabile degli articoli e dei parametri principali;
- audit `tools/audit-regolamento-v453.mjs`.

La modifica non tocca Firebase, Admin, rules, snapshot o Area Squadra.

## V454 - Selettore card Admin e QA opzionale

La V454 aggiunge nell'Admin del clone un menu di visibilita' sotto il titolo della sezione.

Comportamento:

- tutte le card Admin partono deselezionate e non visibili;
- l'admin puo' mostrare solo le card necessarie;
- sono disponibili i pulsanti `Mostra tutte` e `Nascondi tutte`;
- la `Checklist QA Admin` in basso e' nascosta di default e si abilita dal checkbox dedicato nello stesso menu;
- la preferenza e' salvata nel browser tramite localStorage, separata per slug della lega.

La modifica non tocca Firebase, rules, dati statici, snapshot o Area Squadra presidenti.

## V455 - Fix selettore Admin e favicon cache-proof

- Il selettore Admin V455 sostituisce il runtime V454.
- Nessuna card Admin e visibile di default finche non viene spuntata dal menu.
- La Checklist QA Admin in basso resta nascosta di default e si mostra dal checkbox dedicato.
- Le favicon ora usano file con nome V455 per aggirare la cache del browser.

Documento tecnico: `ADMIN_UI_V455.md`.

## V456 - Hotfix selettore card Admin

Il selettore card Admin usa ora il runtime V456. I pulsanti sono sempre cliccabili e il Generatore comunicati automatici e incluso nella lista delle card selezionabili. La Checklist QA Admin resta nascosta di default e si mostra solo dal checkbox dedicato.
