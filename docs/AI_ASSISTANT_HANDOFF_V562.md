# AI Assistant handoff V562 - Svincola Giocatori ZonaOrientale

## Obiettivo

Riattivare immediatamente la funzionalita' presidente `Svincola Giocatori` su ZonaOrientale, mantenendo invariata la disattivazione Calciomercato introdotta in V561.

## File modificati

- `static/zonaorientale/assets/league-config.json`
- `static/zonaorientale/assets/js/core/league-config-v443.js`
- `static/zonaorientale/index.html`
- `static/fanta-engine/tools/audit-zona-release-players-v562.mjs`
- documentazione V562 e handoff.

## Modifiche funzionali

- `features.presidentReleasePlayers` attivato per ZonaOrientale.
- Card registry `release-players` riattivato con `enabled: true`.
- Card collegata a `featureKey: presidentReleasePlayers` e mantenuta con `visibility: president`.
- Fallback config JS aggiornato a V562.
- Cache-buster e footer della home ZonaOrientale aggiornati a V562.
- Metadata stagione ZonaOrientale allineati a `2026-2027` anche in `multiSeasonDataAdapterV526`.

## Guardrail preservati

- Nessun import o fetch Calciomercato riattivato.
- Sezione Calciomercato resta assente dalla navigazione.
- Netlify Function `calciomercato-feed` resta disabilitata dalla V561.
- Nessuna modifica a Firebase rules o struttura Firestore.
- Nessuna modifica a EmailJS: la funzione usa il flusso gia' presente nel runtime.
- Nessuna modifica a `docs/zonaorientale/FUNZIONALITA'.md`.

## Audit

```bash
node static/fanta-engine/tools/audit-zona-release-players-v562.mjs
```

## Checklist manuale

- Login come presidente ZonaOrientale attivo.
- Aprire Area Presidente / Area Squadra.
- Verificare comparsa del pannello `Svincola Giocatori`.
- Selezionare uno o piu' giocatori dalla rosa.
- Verificare generazione preview email.
- Non inviare email reali se non necessario; in caso di test reale verificare destinatario e oggetto.
- Verificare che Calciomercato resti assente dalla nav e che non parta `calciomercato-feed` nel Network.
