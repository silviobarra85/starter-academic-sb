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
