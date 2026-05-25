# REFACTOR V191 - Procedura guidata Pubblica aggiornamenti

## Obiettivo

Aggiungere una procedura guidata admin per trasformare promemoria e semafori di pubblicazione in passaggi operativi chiari, fruibili anche da mobile.

## File modificati

- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/app.js`
- `docs/zonaorientale/REFACTOR_V191.md`
- `docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_V191.md`

## Funzionalità aggiunta

In Admin compare il pannello:

```text
Procedura guidata Pubblica aggiornamenti
```

Il pannello guida l'admin nei passaggi:

1. Caricare i dati amministrativi e modificare i dati.
2. Premere `Snapshot pubblici -> Aggiorna tutto`.
3. Scaricare i JSON/static overlay richiesti.
4. Applicare gli overlay nella repo.
5. Eseguire commit, push e merge su master.
6. Eseguire `Controlla asset pubblici` e `Checklist online finale`.

## Integrazione con V189 e V190

La procedura legge i promemoria V189 tramite `readAdminPublicationRemindersV189()` e le azioni suggerite tramite `getAdminPublicationActionsV189()`.

Quando premi `Genera piano pubblicazione`, esegue anche lo stato V190 con `runPublicationStatusV190({ silent: true })`, così il piano mostra un riepilogo aggiornato di OK/warning/errori.

## Comandi copiabili

Sono stati aggiunti due pulsanti:

- `Copia flusso`
- `Copia comandi Git`

I comandi sono intenzionalmente ampi e usano `git add -f` per i percorsi statici potenzialmente ignorati da `.gitignore`.

## Mobile

Il pannello è card-based, senza tabelle:

- griglia a 1 colonna su mobile;
- bottoni a larghezza piena;
- testi lunghi a capo;
- blocchi codice con wrap e scroll orizzontale di sicurezza.

## Versione

Footer e cache-buster aggiornati a V191.

La checklist online finale ora si aspetta la versione `191`.

## Test

Eseguiti:

```bash
node --check static/zonaorientale/assets/app.js
find static/zonaorientale/assets -type f -name '*.js' -print0 | xargs -0 -n 1 node --check
find static/zonaorientale/assets -type f -name '*.json' -print0 | xargs -0 -n 1 python3 -m json.tool
```

Esito: ok.
