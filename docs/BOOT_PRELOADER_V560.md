# V560 - Boot preloader interactive-ready

## Obiettivo

Correggere la V559: il preloader non deve sparire quando i tasti non sono ancora effettivamente pronti. La percentuale deve restare ferma mentre ruota solo l'anello della rotellina.

## Cosa cambia

- Nuovo CSS comune: `static/fanta-engine/css/boot-preloader-v560.css`.
- Nuovo controller comune: `static/fanta-engine/js/ui/boot-preloader-v560.js`.
- Aggiornate entrambe le home `index.html` a V560 con cache-buster `?v=560`.
- Aggiornati entrambi gli `assets/app.js` per inviare `fanta:app-rendered-v560` solo dopo render, due frame grafici, idle del main thread e nuovo frame grafico.
- Il preloader V560 non si chiude piu' sul solo `window.load`: aspetta `DOMContentLoaded`, `window.load`, evento app-rendered, controlli DOM essenziali e quiet frame.
- Timeout di sicurezza mantenuti per evitare overlay bloccati in caso di errore anomalo.

## Comportamento

La rotellina resta visibile fino alla stabilizzazione dell'interfaccia. La percentuale cresce in base ai gate raggiunti ma non ruota: ruota solo l'anello esterno. La chiusura avviene dopo il primo render dati/auth e dopo un breve momento idle del main thread, cosi' i tap/click sui pulsanti risultano disponibili appena l'overlay scompare.

## Guardrail

- Nessun preload/autoload pesante reintrodotto.
- Nessuna modifica a Firebase, EmailJS, Netlify Functions, router locale o dati.
- Nessuna modifica a `docs/zonaorientale/FUNZIONALITA'.md`.
- V559 resta come storico; V560 e' il riferimento attivo.

## Audit

```bash
node static/fanta-engine/tools/audit-boot-preloader-v560.mjs
```

## Verifica manuale consigliata

- Aprire `/zonaorientale/` in finestra anonima o con cache pulita.
- Controllare che ruoti solo l'anello della rotellina, non il numero percentuale.
- Appena il preloader scompare, provare subito i tasti principali: Dashboard, Competizioni, Listone, menu mobile Altro, Area admin.
- Ripetere la stessa prova su `/fantapetillomantramanager/`.
- Verificare che navigazione, Firebase/Auth, Admin, Presidente, Listone e Calciomercato non abbiano regressioni.
