# Audit Matrix V370 - Centro notifiche presidente

## Controlli obbligatori

- `DEPLOY_EXPECTED_VERSION_V181 >= 370`.
- Footer e cache-buster allineati alla versione corrente.
- Marker `window.ZonaOrientalePresidentNotificationCenterV370` presente.
- Wrapper conservativo `renderUserAreaApprovedBeforeV370` presente.
- Dashboard Presidente V369 ancora presente.
- Dashboard Admin V368 ancora presente.
- Smoke test V367 ancora presente.
- Hardening trattative V366 ancora presente.
- Pulsanti Accetta/Rifiuta trattative ancora presenti.
- `FUNZIONALITA'.md` non richiesto/modificato.

## Esito atteso

`node static/zonaorientale/tools/audit-president-notification-center-v370.mjs` deve chiudere senza errori.
