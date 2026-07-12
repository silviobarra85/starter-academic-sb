# AI Assistant Handoff Current - V620

Ultimo overlay: **V620**.

## Scopo
V620 interviene solo su **ioSudo** e rende realmente operativi i tasti sotto la ricerca.

## Modifiche principali

- Sostituiti i vecchi filtri rapidi con viste globali:
  - **SQUADRE**: torna alla griglia squadre;
  - **SOS**: mostra tutti i giocatori infortunati o con problemi fisici;
  - **RUMOR**: mostra lista compatta di trattative/rumors in entrata e in uscita con fonti;
  - **UFFICIALITÀ**: mostra tutte le ufficialità in entrata e in uscita;
  - **AMICHEVOLI**: mostra il calendario globale delle amichevoli.
- Ordinamento:
  - amichevoli in ordine crescente di data;
  - SOS, rumors e ufficialità in ordine decrescente di data.
- La ricerca filtra anche dentro la vista rapida attiva.
- Live rosters V618/V619 mantenute.
- Dati mercato V619 invariati.

## File principali

- `static/iosudo/index.html`
- `static/iosudo/sw.js`
- `static/fanta-engine/js/apps/iosudo-app-v620.js`
- `static/fanta-engine/css/iosudo-app-v620.css`
- `static/fanta-engine/tools/audit-iosudo-v620.mjs`

## Verifiche

```bash
node static/fanta-engine/tools/audit-iosudo-v620.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v620.js
node --check static/iosudo/sw.js
```

Non serve reinstallare ioSudo dopo il deploy.
