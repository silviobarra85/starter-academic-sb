# Handoff nuovo assistente - V365

## Stato

La V365 e' una stabilizzazione protetta post V364. Non cambia logiche, non rimuove file runtime e non modifica flussi Firebase/localStorage. Serve a riallineare la base prima di procedere con hardening e refactor mirati.

## Modifiche effettuate

- Cache-buster aggiornati a V365 su `index.html`, `competition.html`, `player.html`.
- Footer aggiornati a V365 sulle tre pagine.
- `DEPLOY_EXPECTED_VERSION_V181` aggiornato a `365`.
- Aggiunto marker `window.ZonaOrientaleProtectedStabilizationV365`.
- Aggiornato handoff corrente e creato `CURRENT_STATE.md`.

## Vincoli da rispettare

- Non modificare `FUNZIONALITA'.md` senza richiesta esplicita.
- Non staccare funzionalita' esistenti.
- Non confondere trattative reali Firebase e simulazioni local-only.
- Non rimuovere file legacy senza release dedicata e comandi `rm` espliciti.

## Prossima attivita consigliata

V366 hardening trattative/notifiche:

1. Mappare tutti gli status usati dalle trattative.
2. Creare helper centralizzati per normalizzazione e badge.
3. Separare chiaramente righe Firebase e righe local-only.
4. Conservare i percorsi esistenti e aggiungere smoke test manuale mirato.

## Smoke test rapido

```js
window.ZonaOrientaleProtectedStabilizationV365.runSmokeTest()
```

Deve restituire `ok: true` dopo caricamento completo della home.
