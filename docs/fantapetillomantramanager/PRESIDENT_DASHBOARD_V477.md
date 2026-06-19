# V477 - Dashboard presidente FantaMantraManager

## Ambito

Intervento limitato a `static/fantapetillomantramanager/` e `docs/fantapetillomantramanager/`.
ZonaOrientale non viene toccato.

## Richiesta

- Nascondere dalla dashboard/Area Squadra presidente la card `Svincola Giocatori`.
- Nascondere la card `Comunicato avvenuto scambio`.
- Non mostrare la Dashboard Presidente quando il login corrente e Admin.

## Implementazione

La patch aggiunge un layer runtime V477 in `assets/app.js` che:

- rimuove eventuali pannelli legacy `#teamPlayerReleasePanelV261` e `#teamTransferCommunicationPanelV242` se vecchi wrapper li iniettano comunque;
- trasforma gli enhancer dedicati a svincolo e comunicato scambio in no-op conservativi con cleanup DOM;
- fa ritornare stringa vuota a `renderPresidentDashboardV369` quando `state.isAdmin` e vero;
- applica la stessa protezione al centro notifiche presidente, essendo parte del blocco operativo presidente;
- conserva Area Squadra visibile, login, teamUsers, Admin e flussi Firebase esistenti.

## File principali

- `static/fantapetillomantramanager/assets/app.js`
- `static/fantapetillomantramanager/assets/league-config.json`
- entrypoint HTML FantaMantraManager aggiornati a cache-buster/footer V477
- `static/fantapetillomantramanager/tools/audit-president-area-v477.mjs`

## Audit

```bash
cd static/fantapetillomantramanager
node tools/audit-president-area-v477.mjs
```

Esito atteso: tutti i controlli OK.

## Funzionalita preservate

- Area Squadra rimane visibile come da V476.
- Login presidente e mappatura `teamUsers` non cambiano.
- Admin non viene disabilitato.
- Nessun file ZonaOrientale incluso o modificato.
