# AI Assistant Handoff V751

## Stato

Overlay per sito ZonaOrientale, non ioSudo.

Problemi affrontati:

1. Nel browser il fetch pubblico di `/zonaorientale/assets/snapshots/seasons/2026-2027.json` restituiva alcune righe `SVINCOLO` con descrizione generica `SVINCOLI LUGLIO 2026`, mentre nel sito corrente allegato dall'utente la copia locale aveva descrizioni complete.
2. `index.html` del sito allegato caricava ancora `app.js?v=698`, quindi le patch successive potevano non entrare nel runtime.
3. In `Tutte le Rose`, il click sulle squadre non apriva sempre la pagina squadra e il pulsante espandi/riduci non risultava affidabile.

## File modificati

- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/assets/league-config.json`
- `static/zonaorientale/assets/snapshots/seasons/2026-2027.json`
- `docs/OVERLAY_V751_APPLY.md`
- `docs/AI_ASSISTANT_HANDOFF_V751.md`
- `docs/AI_ASSISTANT_HANDOFF_CURRENT.md`

## Dettagli tecnici

`app.js` include blocco finale `fantaSiteRosterSvincoliAndNavigationV751`:

- mappa canonica `CANONICAL_SVINCOLI` per tutte le 10 squadre;
- funzione `window.enforceStaticSvincoliV751(source)`;
- riparazione automatica prima di `renderTeamsTable` e `renderClubRostersPublic`;
- listener `window` in capture phase per `[data-toggle-roster-club]` e `[data-open-team-profile]`;
- footer V751.

## Verifiche consigliate

Nel browser:

```js
document.querySelector('script[src*="app.js"]')?.src
window.enforceStaticSvincoliV751('manual')
window.ZonaOrientaleStaticSvincoliV751
```

Atteso:

- script con `app.js?v=751`;
- `changed` maggiore di zero se il runtime aveva dati generici;
- in `Tutte le Rose`, pulsante espandi funzionante e click sul nome squadra apre la pagina squadra.

## Note importanti

Se dopo il deploy il fetch diretto del JSON continua a restituire descrizioni generiche, significa che il deploy sta pubblicando un file diverso da quello applicato localmente, oppure Netlify/GitHub sta usando un'altra root/branch. In quel caso verificare commit e deploy con:

```bash
grep -n "app.js?v=" static/zonaorientale/index.html
grep -n "Malinovskyi" static/zonaorientale/assets/snapshots/seasons/2026-2027.json
git status
git log --oneline -5
```
