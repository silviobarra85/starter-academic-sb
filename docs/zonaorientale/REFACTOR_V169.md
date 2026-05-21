# Refactor V169 - Helper Rose mobile

Data: 2026-05-21
Branch: `feature/zonaorientale-competizioni-statiche`

## Obiettivo

Ridurre gradualmente `assets/app.js` senza modificare il comportamento della webapp.

## Modifica

Estratti gli helper della sezione Rose mobile e della formattazione date mobile in:

```text
static/zonaorientale/assets/js/mobile/mobile-rosters.js
```

Il file contiene:

- formattazione compatta date mobile `GG-MM-AA`;
- rendering griglia Rose mobile;
- rendering dettaglio rosa mobile;
- rendering tabella Rose desktop usata nello stesso flusso;
- helper per applicare le date compatte solo in UX mobile.

`assets/app.js` resta responsabile di:

- stato globale;
- apertura/chiusura rose;
- orchestrazione `renderTeamsTable`;
- dati Firebase/statici.

## Rischio

Basso: refactor meccanico con dependency injection. Nessun cambio a Firebase, rules, dati o contenuti.

## Test consigliati

```text
/zonaorientale/#clubs
/zonaorientale/#dashboard
/zonaorientale/#teamarea
```

Da verificare soprattutto da mobile:

- griglia Rose;
- apertura e riduzione di una rosa;
- scroll tabella giocatori;
- date compatte `GG-MM-AA`.
