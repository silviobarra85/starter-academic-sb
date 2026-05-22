# AI Handoff ZonaOrientale - V189

## Stato generale

Il sito è una webapp statica HTML/CSS/JS puro in:

```text
static/zonaorientale/
```

Non c'è build system. Gli overlay devono mantenere la struttura completa `static/zonaorientale/...` e ogni versione deve aggiornare:

- `static/zonaorientale/index.html`
- cache-buster asset `?v=XXX`
- Version footer
- checklist deploy expected version in `assets/app.js`
- documento `docs/zonaorientale/REFACTOR_VXXX.md`
- handoff AI `docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_VXXX.md`

Comandi locali richiesti dall'utente:

```bash
cd ..
python3 -m http.server 1313 --bind 0.0.0.0
```

URL locale:

```text
http://localhost:1313/zonaorientale/
```

## Ultima versione

V189 - Avvisi pubblicazione Admin.

Footer atteso:

```text
ZonaOrientale Salerno · V189 avvisi pubblicazione admin · Ultimo aggiornamento 21/05/2026
```

## Architettura letture pubbliche

Ordine attuale:

1. JSON statici GitHub/local statico.
2. Snapshot pubblici Firebase come fallback.
3. Collection Firebase granulari solo da admin completo, dopo click su `Carica dati amministrazione`.

File statici importanti:

```text
assets/public/config.json
assets/snapshots/seasons/manifest.json
assets/snapshots/seasons/<stagione>.json
assets/snapshots/honor.json
assets/listoni/manifest.json
assets/rose/manifest.json
assets/competitions/manifest.json
```

## Cosa ha introdotto V189

Aggiunto sistema locale di promemoria in Admin per evitare disallineamenti Firebase/JSON statici.

Pannello UI:

```text
Admin → Pubblicazione dati
```

Se non ci sono modifiche pendenti mostra “Nessun aggiornamento statico in sospeso”.

Dopo submit/cancellazioni admin registra avvisi in:

```text
localStorage.zonaOrientaleAdminPublicationRemindersV189
```

Gli avvisi indicano cosa scaricare/committare:

- config pubblica
- overlay snapshot stagioni
- honor JSON
- overlay rose/listone/competizioni

Non scrive Firebase e non aumenta le letture.

## Punti tecnici V189

Blocco aggiunto verso fine `assets/app.js`, prima dello startup centralizzato:

```text
/* V189 - Admin publication reminders. */
```

Funzioni principali:

```text
readAdminPublicationRemindersV189
writeAdminPublicationRemindersV189
addAdminPublicationReminderV189
renderAdminPublicationReminderHtmlV189
renderAdminPublicationReminderPanelV189
getAdminPublicationActionsV189
```

Hook principali:

- submit capture globale sui form admin mappati
- click capture su pulsanti di cancellazione admin
- wrapper `renderAdminArea`
- wrapper `renderAdminLightGateV178`
- integrazione nella guida `renderAdminHelpPanelV185`

## Mobile

V189 include CSS injected da JS con:

```text
admin-publication-reminder-v189
admin-publication-grid-v189
admin-publication-actions-v189
```

Su mobile il layout diventa una colonna e i testi lunghi vanno a capo.

## Regole operative importanti

Quando l'utente chiede modifiche al sito:

1. Fare overlay piccolo e testabile.
2. Aggiornare Version footer.
3. Aggiornare cache-buster.
4. Aggiornare checklist expected version.
5. Consegnare zip overlay.
6. Dare comandi Git.
7. Dare comandi per locale.
8. Includere handoff AI aggiornato.

## Comandi Git tipici

```bash
git status
git add static/zonaorientale/index.html static/zonaorientale/assets/app.js docs/zonaorientale/REFACTOR_V189.md docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_V189.md
git commit -m "V189 add admin publication reminders"
git push
```

Per pubblicare su master:

```bash
git checkout master
git pull --ff-only origin master
git merge --no-ff feature/zonaorientale-v187-next
git push origin master
git checkout feature/zonaorientale-v187-next
```

## Prossime funzionalità consigliate

- V190: stato pubblicazione Firebase/JSON con semafori.
- V191: procedura guidata “Pubblica aggiornamenti”.
- V192: dashboard presidente evoluta.
- V193: statistiche storiche/Hall of Fame.
- V194: tasto “Su” uniforme su tutte le pagine lunghe mobile.
