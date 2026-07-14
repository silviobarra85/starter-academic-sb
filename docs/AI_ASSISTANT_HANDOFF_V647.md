# Overlay V647 - Disattiva sezione pubblica Per i SUDATORI

Data: 2026-07-14

## Obiettivo

Disattivare la sezione pubblica `Per i SUDATORI` dal sito delle leghe, mantenendo invece attivi dataset e app `ioSudo`.

## Modifiche

- Rimosso il caricamento di `sudatori-section-v646.css?v=646` da:
  - `static/zonaorientale/index.html`
  - `static/fantapetillomantramanager/index.html`
- Rimosso il caricamento di `sudatori-section-v646.js?v=646` dalle stesse due pagine.
- Non sono stati rimossi dati, JSON, manifest, app ioSudo, service worker, listoni o rose.
- Il dataset `static/fanta-engine/data/sudatori/current/` resta disponibile per `ioSudo`.

## Nota tecnica

La sezione pubblica `Per i SUDATORI` veniva aggiunta al menu e alla navigazione dal modulo `sudatori-section-v646.js`. Rimuovendo lo script dalle shell delle leghe, la voce non viene piu iniettata e la pagina non viene attivata. I file del modulo restano nel repository per compatibilita/storico e per evitare rotture su cache o riferimenti passati.

## Verifica

```bash
node static/fanta-engine/tools/audit-disable-sudatori-site-v647.mjs
```

Output atteso:

```text
Audit disable Sudatori V647 OK {"leaguePages":2,"sudatoriPublicSection":false,"iosudoDataKept":true}
```
