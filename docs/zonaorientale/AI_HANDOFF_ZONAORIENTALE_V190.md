# AI Handoff ZonaOrientale - V190

## Stato progetto

Branch di lavoro indicato dall'utente: `feature/zonaorientale-v187-next`.

Il sito e una webapp statica HTML/CSS/JS in:

```text
static/zonaorientale/
```

Non usare build system. Applicare gli overlay copiando i file nei percorsi finali.

## Novita V190

V190 aggiunge in Admin il pannello:

```text
Stato Firebase / JSON
```

Il pannello aiuta l'utente a capire se i dati modificati su Firebase sono gia allineati con i JSON statici che il pubblico legge dopo refresh/logout.

## File toccati

- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/app.js`
- `docs/zonaorientale/REFACTOR_V190.md`
- `docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_V190.md`

## Dettagli tecnici

Il blocco V190 e stato inserito in fondo ad `assets/app.js`, prima di:

```js
startZonaOrientaleAppV173();
```

Funzioni principali:

```js
runPublicationStatusV190()
renderPublicationStatusPanelV190()
buildPublicationStatusRowsV190()
```

API console:

```js
ZonaOrientalePublicationStatus.check()
ZonaOrientalePublicationStatus.last()
ZonaOrientalePublicationStatus.rows()
```

Il controllo usa `runPublicAssetsPreflightV179({ silent: true })` e i promemoria locali V189 tramite `readAdminPublicationRemindersV189()`.

Non scrive su Firebase.

## UX/mobile

Il report e a card responsive, non a tabella. Questo evita overflow da mobile.

Su mobile:

- card a una colonna;
- bottoni a larghezza piena;
- testi lunghi con wrap nella card;
- nessun layout orizzontale forzato.

## Regole da rispettare nei prossimi overlay

- Aggiornare sempre la Version nel footer.
- Aggiornare sempre i cache-buster a `v=XXX`.
- Includere sempre un handoff AI nella cartella docs.
- Includere sempre i comandi locali:

```bash
cd ..
python3 -m http.server 1313 --bind 0.0.0.0
```

- Non normalizzare i nomi squadra nei convertitori rose Excel.
- Ricordare che il pubblico legge prima JSON statici, poi snapshot Firebase come fallback.
- Dopo modifiche dati admin, servono snapshot Firebase e JSON GitHub aggiornati.

## Prossimo step consigliato

V191: procedura guidata `Pubblica aggiornamenti`, con passi operativi e comandi da copiare per applicare overlay statici, commit/push e merge su master.
