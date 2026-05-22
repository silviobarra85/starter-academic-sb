# V139 - Hotfix Admin Accetta utenti getTeamById

Data: 2026-05-20
Branch consigliato: feature/zonaorientale-competizioni-statiche

## Problema

Dopo V138 la pagina poteva bloccarsi con:

```text
Non riesco a caricare i dati. getTeamById is not defined
```

Il problema era nel pannello Admin -> Accetta utenti: il renderer degli utenti approvati usava `getTeamById`, ma la funzione non era disponibile nello scope globale di `app.js` dopo il refactor.

## Correzione

- Aggiunta funzione globale `getTeamById(teamId)` accanto a `getSeasonTeamById`.
- Reso più difensivo il renderer degli utenti approvati, sia in `app.js` sia nel modulo `assets/js/admin/admin-users.js`.
- Aggiornato cache busting di `app.js` a `v=139`.

## Test

- Aprire `/zonaorientale/#admin`.
- Espandere `Utenti e comunicazioni -> Accetta utenti`.
- Verificare che siano visibili richieste in attesa e accessi approvati.
- Rifiutare una richiesta di test e verificare che sparisca dalla UI e da `pendingUsers/{uid}`.
