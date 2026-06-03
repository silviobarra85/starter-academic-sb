## Aggiornamento V299 - CSS refactor stabile

Versione runtime corrente: **V299 CSS refactor stabile**. Leggere anche `refactor/CSS_REFACTOR_STABLE_V299.md`. La release consolida i CSS refactor V292 usando nomi stabili: `assets/css/refactor/mobile-controls.css`, `assets/css/refactor/rosters-tables.css` e `assets/css/refactor/theme-light-suspended.css`. I primi due sono importati dagli HTML, il file Light resta sospeso e non importato. Funzionalita da preservare: Listone con Modifica/filtro/export admin-only, Rose e prima colonna sticky, Dashboard Presidente, bottom nav/menu Altro/pulsante Su, Dark mode unico, `competition.html` e `player.html`.

## Aggiornamento V298 - Audit asset/import orfani

Versione runtime corrente: **V298 audit asset/import orfani**. Leggere anche `refactor/ASSET_IMPORT_AUDIT_V298.md`. La release aggiunge lo script non distruttivo `static/zonaorientale/tools/audit-assets-v298.sh` per segnalare import/href/src/url locali mancanti, file versionati superati e possibili asset CSS/JS orfani. Non rimuove file e non cambia funzionalita'. Prima di qualsiasi `git rm` su asset CSS/JS verificare esplicitamente Listone, Rose, Dashboard Presidente, Admin, pagine standalone, mobile nav e Dark mode.

## Aggiornamento V296

Versione runtime corrente: **V296 export modifiche solo admin**. Leggere anche `refactor/LISTONE_EXPORT_ADMIN_ONLY_V296.md`. Il pulsante `Esporta modifiche CSV` del Listone e' ora riservato agli Admin. La UI pubblica mantiene Listone, colonna `Modifica`, filtro `Modifiche` e usciti storici, ma non mostra il download CSV.

## Aggiornamento V295 - Primo collegamento helper puri app.js

Versione runtime corrente: **V295 primo helper app.js**. Leggere anche `refactor/APP_HELPER_REWIRE_V295.md`. La release collega solo `csvEscapeV278` al modulo `assets/js/utils/shared-helpers-v295.js`; non sposta render, Firebase, Admin, Listone, Rose o mobile chrome. Funzionalita da preservare e testare: export CSV modifiche Listone, filtro Modifiche, usciti storici, rose/pagina squadra, Dashboard Presidente, Admin e mobile nav.

## Aggiornamento V293 - Audit mirato app.js

Versione runtime corrente: **V293 audit mirato app.js**. Leggere anche `refactor/APP_JS_AUDIT_V293.md`. La release non cambia funzionalita' e non estrae ancora codice: mappa le aree sicure/rischiose di `assets/app.js` prima di una futura V294. Regola: ogni refactor JS deve dichiarare le funzionalita a rischio, come vengono preservate e i test necessari.

## Aggiornamento V292

Versione runtime corrente: **V292 pulizia CSS Light sospeso**. Leggere anche `refactor/CSS_CLEANUP_V292.md`. La release non cambia funzionalita': sposta le regole Light recenti V285-V288 fuori dai CSS attivi e le conserva in `assets/css/refactor/theme-light-suspended-v292.css`, non importato. Restano attivi Dark mode unico, controlli mobile, rose/tabelle e fix V289.

## Aggiornamento V291

Versione runtime corrente: **V292 pulizia CSS Light sospeso**. Leggere anche `refactor/CSS_REFACTOR_V291.md`. La release non cambia funzionalita': sposta i blocchi CSS V285-V289 da `styles.css` in due file dedicati sotto `assets/css/refactor/`, mantenendo lo stesso ordine di override e aggiungendo controlli nello script pre-push.

## Aggiornamento V290 - Audit styles.css e app.js

V290 aggiunge un audit conservativo di `assets/styles.css` e `assets/app.js` prima di qualunque refactor reale. Non cambia comportamento runtime: aggiorna versione/cache-buster, aggiunge diagnostica `window.ZonaOrientaleStylesAppAuditV290` e documenta funzionalita a rischio da preservare in `docs/zonaorientale/refactor/AUDIT_STYLES_APP_V290.md`. Regola operativa: ogni refactor successivo deve dichiarare cosa rischia di perdere e come lo preserva.

## Aggiornamento V289 - Dark mode e rose mobile

V289 sospende temporaneamente la modalita Light: il sito forza il tema Dark anche se nel browser era salvato Light e il pulsante cambio tema viene nascosto. Corregge inoltre le tabelle Rosa da mobile in modalita Dark, compattando le righe e centrando verticalmente la prima colonna nelle rose pubbliche e nella pagina squadra. Documento: `docs/zonaorientale/audit/DARK_MODE_ROSE_MOBILE_V289.md`. Diagnostica: `window.ZonaOrientaleDarkModeOnlyV289`.

## Aggiornamento V288 - Fix rose mobile Light

Versione corrente: V288 fix rose mobile Light. Leggere anche `audit/FIX_ROSE_MOBILE_LIGHT_V288.md`. La release corregge la prima colonna della tabella Rosa nella pagina squadra da smartphone in tema Light: testo chiaro su sfondo scuro, nome giocatore leggermente piu' grande, centratura verticale e righe piu' compatte. Intervento solo CSS/UI, senza modifiche a Firebase, EmailJS, dati JSON o logiche runtime.

## Aggiornamento V287 - Rifinitura controlli mobile

Versione corrente: V287 rifinitura controlli mobile. Leggere anche `audit/RIFINITURA_CONTROLLI_MOBILE_V287.md`. La release applica una patch CSS/UI mirata a form, filtri, bottoni, menu e aree scrollabili da smartphone. Non modifica Firebase, EmailJS, dati JSON o logiche runtime.

## Aggiornamento V286 - Fix prima colonna mobile Light

Versione corrente: V286 fix prima colonna mobile. Leggere anche `audit/FIX_PRIMA_COLONNA_MOBILE_LIGHT_V286.md`. La release corregge il contrasto della prima colonna sticky in tema Light/mobile per Listone e tabelle rose, evitando il caso nome giocatore nero su sfondo scuro. Intervento solo CSS/UI, senza modifiche a Firebase, EmailJS, dati JSON o logiche runtime.

## Aggiornamento V285 - Fix mirati mobile

Versione corrente: V285 fix mirati mobile. Leggere anche `audit/FIX_MOBILE_MIRATI_V285.md`. La release applica correzioni CSS conservative per migliorare leggibilita' mobile in tema Light, tabelle scrollabili, prima colonna sticky, badge/pill/bottoni secondari e bottom navigation. Nessuna modifica funzionale a Firebase, EmailJS, dati JSON o logiche runtime.

## Aggiornamento V284 - Audit mobile completo

Versione corrente: V287 rifinitura controlli mobile. Leggere anche `audit/AUDIT_MOBILE_COMPLETO_V284.md`. La release introduce una checklist operativa per verificare mobile, tema Light/Dark, tabelle, form, Dashboard Presidente e Admin prima dei prossimi fix CSS. Nessuna modifica funzionale a Firebase, EmailJS o dati runtime.

## Aggiornamento V283 - Pulizia file macOS/residui

Versione corrente: V283 pulizia file macOS. Leggere anche `release/PULIZIA_MACOS_V283.md`. La release aggiunge lo script `static/zonaorientale/tools/cleanup-macos-artifacts-v283.sh` e aggiorna i controlli pre-push V282 per riconoscere ulteriori metadata macOS. Nessuna modifica funzionale a Firebase, EmailJS o dati runtime.

## Aggiornamento V282 - Controlli pre-push

Versione corrente: V283 pulizia file macOS. Leggere anche `release/CONTROLLI_PRE_PUSH_V282.md`. Prima di ogni commit/push usare `static/zonaorientale/tools/check-zonaorientale.sh`.

## Aggiornamento V275

Versione corrente: V275 funzionalita V271-274. Dopo i documenti V272 leggere anche `FUNZIONALITA'V271-274.md`, `listoni/LISTONE_TEST_REALE_V273.md` e `listoni/LISTONE_CODICI_SQUADRA_V274.md`.

# START HERE - ZonaOrientale V272

Questo file e' l'indice operativo aggiornato al ramo:

```text
refactor/260528-zonaorientale-next
```

Versione runtime attesa dopo l'overlay:

```text
V293 audit mirato app.js
```

## Documenti principali da leggere

1. `handoff/HANDOFF_NUOVO_ASSISTENTE_V272.md`  
   Istruzioni complete per un nuovo assistente AI.

2. `audit/VERIFICA_FUNZIONALITA_V272.md`  
   Controllo delle funzionalita che potrebbero perdersi e stato dei moduli collegati.

3. `audit/AUDIT_FILE_E_LEGACY_V272.md`  
   File legacy, duplicati e aree da non eliminare senza test mirati.

4. `pianificazione/PROSSIME_ATTIVITA_V272.md`  
   Backlog organizzato: nuove funzionalita, correzioni, pulizia, refactor e dati esterni.

5. `release/PUSH_MASTER_E_RITORNO_BRANCH_V272.md`  
   Procedura Git per fondere il branch su `master` e poi tornare al branch di lavoro.

## Documenti storici da preservare

- `FUNZIONALITA'.md` resta il registro funzionale principale e va modificato solo su richiesta esplicita dell'utente.
- `FUNZIONALITA'V240-255.md`, `FUNZIONALITA'V256-262.md`, `FUNZIONALITA'V263-270.md` sono registri incrementali.
- `REGRESSION_TESTS.md` resta la checklist da usare prima di merge/deploy.
- `AI_HANDOFF_ZONAORIENTALE_CURRENT.md` resta il file handoff storico cumulativo.

## Regola operativa

Ogni modifica deve continuare a essere consegnata come unico zip con radici:

```text
zonaorientale/
docs/
```

Nella repo reale:

```text
zonaorientale/ -> static/zonaorientale/
docs/ -> docs/
```


Nota V273: leggere anche `listoni/LISTONE_TEST_REALE_V273.md` per l'esito dei test Listone con Excel reale.


## V274 - Codici squadra canonici nel Listone

I listoni possono arrivare con sigle o nomi estesi delle squadre reali. Il sistema accetta entrambi, ma salva/visualizza la sigla canonica a 3 lettere e conserva l’originale come metadato quando disponibile.

## V276-V277

- V276: pannello Admin `Diagnostica dati`.
- V277: filtro `Modifiche` nel Listone.


## V280 - UI Listone semplificata

- La sezione pubblica `Storico listoni` e' nascosta/rimossa dalla UI.
- Restano attive le logiche di confronto storico usate da colonna `Modifica`, filtro `Modifiche`, usciti storici ed export CSV.
- Nuovo documento: `listoni/LISTONE_UI_SEMPLIFICATA_V280.md`.
- Primo audit contrasto mobile Light: `audit/AUDIT_MOBILE_LIGHT_CONTRAST_V280.md`.


## V281 - Contrasto mobile Light

- Patch grafica mirata per migliorare la leggibilita in tema Light da smartphone.
- Intervento solo CSS + diagnostica runtime, senza modifiche a Firebase, EmailJS o dati JSON.
- Nuovo documento: `audit/AUDIT_MOBILE_LIGHT_CONTRAST_V281.md`.
- Diagnostica: `window.ZonaOrientaleMobileLightContrastV281`.

## V294 - Helper puri app.js

- Aggiunto `assets/js/utils/shared-helpers-v294.js` come modulo non invasivo di helper puri.
- Nessuna funzione storica di `app.js` viene rimossa o riscritta.
- Funzionalita da preservare esplicitamente: Listone, rose, Dashboard Presidente, Admin, news share, mobile chrome e Dark mode unico.
- Documento tecnico: `refactor/APP_HELPERS_EXTRACTION_V294.md`.
- Diagnostica: `window.ZonaOrientaleAppHelpersExtractionV294`.


## Aggiornamento V297

V297 completa la pulizia del primo helper estratto: `shared-helpers-v294.js` e' obsoleto e va rimosso con `git rm`; `shared-helpers-v295.js` resta il modulo attivo. Verificare export CSV Listone admin-only prima del push.

## Aggiornamento V300

V300 introduce l'audit CSS non distruttivo `tools/audit-css-v300.sh` e il documento `refactor/CSS_AUDIT_V300.md`. Prima di pulire `styles.css`, verificare sempre le funzionalita a rischio: Listone, rose, Dashboard Presidente, mobile navigation, Dark mode unico, Admin, `competition.html` e `player.html`.

## Aggiornamento V301

V301 aggiunge la pulizia controllata dei CSS refactor residui tramite `tools/cleanup-css-refactor-v301.sh` e il documento `refactor/CSS_CLEANUP_V301.md`. Prima di rimuovere vecchi CSS V291/V292, eseguire sempre il dry-run e verificare che Listone, rose/pagina squadra, Dashboard Presidente, mobile navigation, Dark mode unico, `competition.html` e `player.html` restino collegati.

## Aggiornamento V302

- Versione runtime: `V302 helper CSV condiviso`.
- Secondo micro-collegamento helper JS: `buildListoneChangeExportCsvV278` usa `ZonaOrientaleSharedHelpersV295.rowsToCsv` con fallback legacy.
- Export modifiche Listone resta riservato agli Admin.
- La Light mode resta sospesa; non e' previsto recupero nel ciclo corrente.
- Studio fattibilita' futura sezione `Calciomercato`: `docs/zonaorientale/pianificazione/CALCIOMERCATO_AGGREGATORE_V302.md`.

## Aggiornamento V303

V303 estende il pannello `Admin -> Diagnostica dati` con controlli di qualita non distruttivi su Listoni, Rose, Competizioni e News. Non modifica Firebase, EmailJS, dati JSON o logiche runtime critiche. Prima di ulteriori refactor verificare sempre che Listone, Rose, Dashboard Presidente, Admin e mobile navigation restino agganciati.



## Aggiornamento V304

V304 aggiunge la review mobile finale e il checkpoint pre-Calciomercato: `docs/zonaorientale/audit/MOBILE_REVIEW_FINALE_V304.md`.

Prima di iniziare la nuova sezione Calciomercato verificare: check pre-push, Listone pubblico/Admin, Rose/pagina squadra, Dashboard Presidente, Admin Diagnostica/Richieste, mobile navigation, `competition.html`, `player.html` e Dark mode unico.

## Nota V305 - Calciomercato base statico

La sezione `Calciomercato` e' stata aggiunta come base statica/manuale. I dati sono in `static/zonaorientale/assets/calciomercato/links.json`. Non recupera automaticamente articoli da siti esterni e non modifica Firebase/EmailJS. Per evoluzioni automatiche usare una futura Netlify Function o altra sorgente server-side, evitando fetch diretti dal browser verso siti terzi.

## V306 - Calciomercato giocatori

La sezione `Calciomercato` supporta ora, per ogni articolo statico, l'elenco dei giocatori interessati tramite `players`/`giocatori`. La funzione e' solo statica/manuale: niente scraping, niente Netlify Function e niente Firebase. Preservare sempre Fantamercato interno, Listone, Rose, Dashboard Presidente e Admin.
## V307 - Calciomercato nome sezione

La sezione pubblica introdotta come `Calcio mercato` viene rinominata in `Calciomercato` in UI e documentazione. La route interna resta `#calciomercato` e il file dati resta `assets/calciomercato/links.json`. Nessuna modifica a Fantamercato interno, Listone, Rose, Admin, Firebase o EmailJS.

