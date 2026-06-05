# Handoff nuovo assistente AI - V343

Versione corrente: V343.

## Sintesi

La V343 aggiunge feedback visibile al pannello Admin `Diagnostica dati`: il tasto `Aggiorna diagnostica` ora mostra data e ora italiana dell'ultimo refresh nella sessione corrente. La modifica e solo UI/diagnostica e non scrive su Firebase.

La V343 prepara anche la pulizia controllata dei CSS refactor versionati V291/V292 tramite tool dedicato. Nessuna funzionalita deve essere persa.

## File runtime principali modificati

```text
static/zonaorientale/assets/app.js
static/zonaorientale/tools/check-zonaorientale.sh
static/zonaorientale/tools/cleanup-css-legacy-v343.sh
static/zonaorientale/tools/audit-admin-functions-v343.mjs
static/zonaorientale/index.html
static/zonaorientale/competition.html
static/zonaorientale/player.html
```

## Marker runtime

```js
window.ZonaOrientaleAdminDiagnosticsV343
window.ZonaOrientaleCssLegacyCleanupV343
```

## Regole obbligatorie

- Non modificare `docs/zonaorientale/FUNZIONALITA'.md` senza richiesta esplicita.
- Preservare tutte le funzionalita presenti fino a V342/V343.
- Non rimuovere altri file legacy senza grep, audit, check e conferma.
- Se si rimuovono i CSS legacy V291/V292, usare prima il dry-run del tool V343.

## Verifica Admin

Comandi utili:

```bash
static/zonaorientale/tools/audit-admin-functions-v343.mjs
static/zonaorientale/tools/check-zonaorientale.sh
```

Verifica browser:

1. entra come Admin;
2. apri il pannello `Diagnostica dati`;
3. premi `Aggiorna diagnostica`;
4. controlla che vicino al tasto appaia data/ora italiana aggiornata;
5. controlla che il pannello si possa ancora espandere/ridurre.

## Prossimo passo consigliato

V344: rimuovere o consolidare un solo gruppo JS legacy dopo audit, partendo dai vecchi moduli Calciomercato player matching V335/V337, solo se non importati e dopo test della timeline giocatore V340.
