# Funzionalita V368 - Dashboard pubblicazione Admin protetta

## Nuova funzionalita

La V368 aggiunge in Admin un pannello `Cruscotto pre-deploy` mostrato in alto, sopra i controlli di pubblicazione esistenti.

Il pannello riassume:

- allineamento versione runtime, footer e cache-buster;
- smoke test runtime protetto V367;
- stato Firebase/JSON V190;
- promemoria locali di pubblicazione V189;
- presenza dei pannelli Promemoria, Semafori e Wizard V191;
- checklist copiabile prima del deploy.

## Cosa non cambia

- Nessuna modifica allo schema Firebase.
- Nessuna nuova scrittura Firebase.
- Nessuna rimozione file runtime.
- Nessuna modifica alle trattative reali.
- Nessuna modifica alle simulazioni trade local-only.
- Nessuna modifica alle sezioni pubbliche.
- Nessuna modifica a `FUNZIONALITA'.md`.

## Marker runtime

```js
window.ZonaOrientaleAdminPublicationDashboardV368
```

## Test console

```js
ZonaOrientaleAdminPublicationDashboardV368.runSmokeTest()
```
