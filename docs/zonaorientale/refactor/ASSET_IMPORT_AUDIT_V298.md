# V298 - Audit asset e import orfani

## Scopo

V298 introduce un controllo non distruttivo sugli asset del sito ZonaOrientale. L'obiettivo e' individuare prima di ogni futura pulizia:

- import, `href`, `src` o `url(...)` locali che puntano a file mancanti;
- file CSS/JS versionati vecchi non piu' referenziati;
- possibili candidati orfani da verificare manualmente;
- rischio di rimuovere asset ancora usati da fallback, pagine standalone o codice legacy.

La release non rimuove asset, non modifica dati e non cambia comportamento runtime.

## Tool aggiunto

```bash
static/zonaorientale/tools/audit-assets-v298.sh
```

Uso standard:

```bash
static/zonaorientale/tools/audit-assets-v298.sh
```

Modalita' compatta:

```bash
static/zonaorientale/tools/audit-assets-v298.sh --quiet
```

Il tool analizza HTML, JS e CSS locali, normalizza i path e segnala riferimenti mancanti come errore. I possibili file orfani sono solo warning: non autorizzano cancellazioni automatiche.

## Funzionalita' a rischio e preservazione

### Funzionalita' a rischio

- CSS refactor mobile/rose/tabelle V292.
- Dark mode unico V289 e toggle tema nascosto.
- Listone: colonna `Modifica`, filtro `Modifiche`, usciti storici ed export CSV admin-only.
- Export CSV Listone collegato a `assets/js/utils/shared-helpers-v295.js`.
- Pagine standalone `competition.html` e `player.html`.
- Moduli legacy/fallback importati da `app.js`.
- Moduli Admin, Presidente, Firebase, EmailJS e share news.

### Preservazione applicata

- Nessun file viene eliminato dalla V298.
- Il nuovo tool segnala soltanto; le rimozioni devono restare manuali e motivate.
- I candidati orfani vanno verificati con `grep`, test browser e checklist regressione prima di `git rm`.
- `check-zonaorientale.sh` controlla solo presenza di tool e documento, senza bloccare il lavoro per warning non distruttivi.

## Regola per le pulizie future

Prima di rimuovere un asset CSS/JS:

1. eseguire `static/zonaorientale/tools/audit-assets-v298.sh`;
2. cercare il file con `grep -R "NOME_FILE" static/zonaorientale docs/zonaorientale`;
3. verificare se il file puo' essere richiamato dinamicamente o da pagina standalone;
4. eseguire `static/zonaorientale/tools/check-zonaorientale.sh`;
5. testare manualmente le funzionalita' a rischio;
6. documentare la rimozione in changelog/handoff.

## Test consigliati dopo V298

- Home pubblica.
- Listone pubblico senza export CSV per non Admin.
- Listone Admin con export CSV funzionante.
- Pagina squadra e rose mobile.
- Dashboard Presidente.
- Admin -> Diagnostica dati.
- Admin -> Richieste presidenti.
- `competition.html`.
- `player.html`.
- Mobile bottom nav, menu Altro e pulsante Su.

## Diagnostica runtime

```js
window.ZonaOrientaleAssetImportAuditV298
```

Valori attesi:

```js
window.ZonaOrientaleAssetImportAuditV298.behaviorChange === false
window.ZonaOrientaleAssetImportAuditV298.tool === "tools/audit-assets-v298.sh"
```
