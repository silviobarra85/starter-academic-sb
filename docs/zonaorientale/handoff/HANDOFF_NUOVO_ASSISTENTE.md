## Aggiornamento V298 - Audit asset/import orfani

Leggere `docs/zonaorientale/refactor/ASSET_IMPORT_AUDIT_V298.md` prima di rimuovere asset CSS/JS. Il tool `static/zonaorientale/tools/audit-assets-v298.sh` segnala import mancanti e candidati orfani ma non effettua rimozioni. Ogni file candidato va verificato con grep e test browser, preservando esplicitamente Listone, Rose, Dashboard Presidente, Admin, pagine standalone, mobile nav, Dark mode unico e helper CSV V295.

## Aggiornamento V296 - Export modifiche Listone solo Admin

Il pulsante `Esporta modifiche CSV` e' riservato agli Admin tramite `state.isAdmin`. Non rimuovere le funzioni V269-V278: servono ancora a colonna `Modifica`, filtro `Modifiche`, usciti storici e calcolo CSV. Documento: `docs/zonaorientale/refactor/LISTONE_EXPORT_ADMIN_ONLY_V296.md`. Diagnostica: `window.ZonaOrientaleListoneExportAdminOnlyV296`.

## Aggiornamento V295 - Primo collegamento helper puri app.js

Leggere anche `docs/zonaorientale/refactor/APP_HELPER_REWIRE_V295.md`. La release collega un solo call-site storico (`csvEscapeV278`) al nuovo modulo `assets/js/utils/shared-helpers-v295.js`. Non spostare altri call-site senza dichiarare funzionalita a rischio, preservazione e test. In particolare non perdere: export CSV modifiche Listone, filtro Modifiche, usciti storici, Rose, Dashboard Presidente, Admin, news share e mobile chrome.

## Aggiornamento V293 - Audit mirato app.js

Leggere anche `docs/zonaorientale/refactor/APP_JS_AUDIT_V293.md` prima di qualunque refactor di `assets/app.js`. La release non cambia funzionalita': documenta cosa non spostare subito e quali helper puri potrebbero essere estratti in una futura V294. Ogni proposta di refactor deve includere una sezione `Funzionalita a rischio e preservazione`.

## Aggiornamento V292

La versione corrente documentata e' **V292 pulizia CSS Light sospeso**. I CSS attivi del refactor sono `assets/css/refactor/mobile-controls-v292.css` e `assets/css/refactor/rosters-tables-v292.css`. Il file `assets/css/refactor/theme-light-suspended-v292.css` conserva le patch Light recenti ma non deve essere importato finche la Light mode non viene ricostruita e testata. Prima di ulteriori refactor verificare esplicitamente che non si perdano Listone Modifica/export, rose/pagina squadra, Dashboard Presidente, bottom navigation e Dark mode unico.

## Aggiornamento V291 - Refactor CSS prudente

V291 separa i blocchi CSS mobile/rose/tabelle V285-V289 da `assets/styles.css` nei file `assets/css/refactor/mobile-controls-v291.css` e `assets/css/refactor/rosters-tables-v291.css`. Il caricamento avviene dopo i CSS storici per preservare gli override. Non cambia logiche JS, Firebase, EmailJS o dati. Prima di ulteriori pulizie verificare che non si perdano: Listone Modifica/export, rose e pagina squadra, Dashboard Presidente, bottom navigation mobile e Dark mode unico V289. Documento: `docs/zonaorientale/refactor/CSS_REFACTOR_V291.md`. Diagnostica: `window.ZonaOrientaleCssRefactorV291`.

## Aggiornamento V290 - Audit styles.css e app.js

V290 aggiunge un audit conservativo di `assets/styles.css` e `assets/app.js` prima di qualunque refactor reale. Non cambia comportamento runtime: aggiorna versione/cache-buster, aggiunge diagnostica `window.ZonaOrientaleStylesAppAuditV290` e documenta funzionalita a rischio da preservare in `docs/zonaorientale/refactor/AUDIT_STYLES_APP_V290.md`. Regola operativa: ogni refactor successivo deve dichiarare cosa rischia di perdere e come lo preserva.

## Aggiornamento V289 - Dark mode e rose mobile

V289 sospende temporaneamente la modalita Light: il sito forza il tema Dark anche se nel browser era salvato Light e il pulsante cambio tema viene nascosto. Corregge inoltre le tabelle Rosa da mobile in modalita Dark, compattando le righe e centrando verticalmente la prima colonna nelle rose pubbliche e nella pagina squadra. Documento: `docs/zonaorientale/audit/DARK_MODE_ROSE_MOBILE_V289.md`. Diagnostica: `window.ZonaOrientaleDarkModeOnlyV289`.

## Aggiornamento V288 - Fix rose mobile Light

V288 e' una patch CSS/UI puntuale per la pagina squadra/rose in tema Light mobile. Corregge il caso nome giocatore nero su sfondo scuro nella prima colonna sticky della tabella Rosa, aumenta leggermente la leggibilita' del nome, centra verticalmente il contenuto e compatta le righe. Documento: `docs/zonaorientale/audit/FIX_ROSE_MOBILE_LIGHT_V288.md`. Diagnostica: `window.ZonaOrientaleRosterMobileLightV288`.

## Aggiornamento V287 - Rifinitura controlli mobile

V287 e' una patch CSS/UI conservativa per controlli mobile: input/select/textarea a target touch piu' comodo, font-size 16px per ridurre zoom iOS, bottoni/pill/menu piu' leggibili, focus ring Light e scroll tabelle piu' fluido. Non cambia dati, Firebase, EmailJS o logiche runtime. Documento: `docs/zonaorientale/audit/RIFINITURA_CONTROLLI_MOBILE_V287.md`. Diagnostica: `window.ZonaOrientaleMobileControlsV287`.

## Aggiornamento V286

- Versione runtime recente: `V286 fix prima colonna mobile`.
- Corretto contrasto della prima colonna sticky in tema Light/mobile per Listone e tabelle rose.
- Intervento solo CSS/UI: nessuna modifica a Firebase, EmailJS, dati JSON o logiche Listone/rose.
- Documento: `docs/zonaorientale/audit/FIX_PRIMA_COLONNA_MOBILE_LIGHT_V286.md`.
- Diagnostica runtime: `window.ZonaOrientaleStickyColumnContrastV286`.
- Test prioritari: Listone e rose da smartphone in tema Light, con scroll orizzontale.

## Aggiornamento V285

- Versione runtime recente: `V285 fix mirati mobile`.
- Migliorata la leggibilita' mobile in tema Light con correzioni CSS conservative.
- Tabelle mobile: indicazione `Scorri`, corpo piu' leggibile e prima colonna sticky rafforzata.
- Controlli, badge/pill, bottoni secondari e bottom navigation piu' contrastati.
- Documento: `docs/zonaorientale/audit/FIX_MOBILE_MIRATI_V285.md`.
- Diagnostica runtime: `window.ZonaOrientaleMobileFixesV285`.
- Nessuna modifica a Firebase, EmailJS, dati JSON o logiche runtime.

## Aggiornamento V284

- Versione runtime recente: `V284 audit mobile completo`.
- Nuovo documento: `docs/zonaorientale/audit/AUDIT_MOBILE_COMPLETO_V284.md`.
- Lo script pre-push segnala la presenza dell'audit mobile.
- Diagnostica runtime: `window.ZonaOrientaleMobileAuditV284`.
- Nessuna modifica funzionale a Firebase, EmailJS o dati JSON.

## Aggiornamento V283

- Versione runtime recente: `V284 audit mobile completo`.
- Nuovo script: `static/zonaorientale/tools/cleanup-macos-artifacts-v283.sh`.
- Lo script e' dry-run di default; usare `--apply` e `--git-rm` solo dopo controllo elenco.
- Documento operativo: `docs/zonaorientale/release/PULIZIA_MACOS_V283.md`.
- Diagnostica runtime: `window.ZonaOrientaleMacOsCleanupV283`.
- Nessuna modifica funzionale a Firebase, EmailJS o dati JSON.

# Handoff nuovo assistente AI - ZonaOrientale Salerno

> File canonico creato in V279 accorpando e aggiornando `HANDOFF_NUOVO_ASSISTENTE_V272.md` e `ISTRUZIONI_NUOVO_ASSISTENTE_260528.md`.
>
> Da usare come primo file da consegnare/leggere quando un nuovo assistente AI deve subentrare nel progetto.


## Aggiornamento V282

- Aggiunto `static/zonaorientale/tools/check-zonaorientale.sh`.
- Lo script esegue controlli pre-push su JS, JSON, versioni/cache-buster/footer e file macOS indesiderati.
- Documento operativo: `docs/zonaorientale/release/CONTROLLI_PRE_PUSH_V282.md`.
- Diagnostica runtime: `window.ZonaOrientalePrePushChecksV282`.
- Nessuna modifica a Firebase, EmailJS o dati runtime.

## 1. Stato corrente sintetico

- Repo reale: `starter-academic-sb`.
- Webapp: `static/zonaorientale/`.
- Documentazione: `docs/zonaorientale/`.
- Branch di lavoro corrente: `refactor/260528-zonaorientale-next`.
- Versione runtime recente: `V284 audit mobile completo`.
- Branch di produzione/deploy: `master`.

## 2. Regole operative obbligatorie

1. Consegnare sempre un solo zip overlay.
2. Lo zip deve contenere le radici `zonaorientale/` e `docs/`.
3. Nella repo copiare `zonaorientale/ -> static/zonaorientale/` e `docs/ -> docs/`.
4. Dopo ogni modifica a codice o UI aggiornare sempre:
   - footer `Version` negli HTML;
   - cache-buster `?v=...`;
   - `DEPLOY_EXPECTED_VERSION_V181` in `assets/app.js`;
   - handoff, changelog e documentazione operativa.
5. Fornire sempre comandi Git e messaggio commit.
6. `docs/zonaorientale/FUNZIONALITA'.md` era protetto, ma e' stato aggiornato esplicitamente su richiesta dell'utente in V279. In futuro modificarlo solo su richiesta esplicita.
7. Non eliminare codice legacy senza audit e test: il progetto contiene molte patch storiche Vxx.

## 3. File da chiedere sempre all'utente

Per ripartire correttamente chiedere:

```text
zonaorientale.zip
docs.zip
```

Se il task riguarda listoni, chiedere anche l'Excel reale usato in `Admin -> Converti listone Excel`.

Se il task riguarda notifiche trattative/Firebase, chiedere anche:

```text
docs/zonaorientale/firebase/FIREBASE_RULES_ZONAORIENTALE_FULL_V257.rules
docs/zonaorientale/firebase/FIREBASE_RULES_PATCH_V257_TRANSFER_NOTIFICATIONS.rules
```

## 4. File da leggere subito

```text
docs/zonaorientale/00_START_HERE_V272.md
docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_CURRENT.md
docs/zonaorientale/handoff/HANDOFF_NUOVO_ASSISTENTE.md
docs/zonaorientale/FUNZIONALITA'.md
docs/zonaorientale/REGRESSION_TESTS.md
docs/zonaorientale/CHANGELOG_CONSOLIDATO.md
docs/zonaorientale/PROSSIME_ATTIVITA_260528.md
docs/zonaorientale/pianificazione/PROSSIME_ATTIVITA_V272.md
```

Per Listone/convertitore leggere anche:

```text
docs/zonaorientale/listoni/LISTONE_TEST_REALE_V273.md
docs/zonaorientale/listoni/LISTONE_CODICI_SQUADRA_V274.md
docs/zonaorientale/listoni/LISTONE_FILTRO_MODIFICHE_V277.md
docs/zonaorientale/listoni/LISTONE_EXPORT_MODIFICHE_V278.md
static/zonaorientale/assets/js/admin/listone-converter.js
```

## 5. Comandi locali standard

```bash
cd starter-academic-sb
cd static/zonaorientale
cd ..
python3 -m http.server 1313 --bind 0.0.0.0
```

Aprire:

```text
http://localhost:1313/zonaorientale/
```

## 6. Comandi Git ricorrenti

Branch corrente:

```bash
cd starter-academic-sb
git checkout refactor/260528-zonaorientale-next
git pull origin refactor/260528-zonaorientale-next
```

Applicazione overlay:

```bash
mkdir -p /tmp/zo_overlay
unzip ~/Downloads/NOME_OVERLAY.zip -d /tmp/zo_overlay
rsync -av /tmp/zo_overlay/zonaorientale/ static/zonaorientale/
rsync -av /tmp/zo_overlay/docs/ docs/
```

Commit:

```bash
git status
git add <file modificati>
git commit -m "tipo: descrizione"
git push origin refactor/260528-zonaorientale-next
```

Merge futuro su master, solo dopo test completi:

```bash
git checkout master
git pull origin master
git merge --no-ff refactor/260528-zonaorientale-next -m "merge: integra aggiornamenti zonaorientale"
git push origin master
git checkout refactor/260528-zonaorientale-next
git merge master
git push origin refactor/260528-zonaorientale-next
```

## 7. Funzionalita critiche da non perdere

### Pubblico

- Dashboard stagione.
- News e comunicati.
- Link WhatsApp news via `/zonaorientale/share/news/<id>`.
- Home con anteprima WhatsApp generica, non ultima news.
- Rose, movimenti, fantamercato, listone, competizioni, statistiche, archivio, confronto, regolamento.
- Listone con colonna `Modifica`, ricerca storica, usciti storici, filtro `Modifiche` ed export CSV.

### Presidente

- Login email/password e Google.
- Dashboard Presidente.
- Comunicati squadra.
- Comunicati avvenuto scambio con EmailJS e richiesta Admin `TRANSFER_NEWS`.
- `Svincola Giocatori`: email a `caparrotti86@yahoo.it`, senza scrittura Firebase.
- Fantamercato/trattative.
- Notifiche trattative: proposta ricevuta, esito proposta inviata, lettura sincronizzata con Firebase quando le rules V257 sono pubblicate.

### Admin

- Accetta utenti stabile anti-duplicati.
- Richieste presidenti: aggiorna, approva, rifiuta, elimina da Firebase comunicati approvati/rifiutati/accepted.
- Generatore comunicati automatici.
- Workflow pubblicazione Admin inline.
- Diagnostica dati Admin.
- Converti listone Excel: formato storico `Tutti/Ceduti` e formato Classic `Lista calciatori`.
- Snapshot, backup, competizioni, rose, albo, FIFA ranking, stadi, club.

## 8. Stato Listone e convertitore

- V268 supporta due formati Excel: storico `Tutti/Ceduti` e Classic a foglio singolo.
- V269 aggiunge confronto/storico listoni e ricerca anche in altri listoni.
- V270 aggiunge colonna opzionale `Modifica` e righe `Uscito` con ultimo listone contenente il giocatore.
- V273 ha testato Excel reale: 663 giocatori convertibili, 532 in listone, 131 asteriscati, 299 con FantaSquadra valorizzata.
- V274 normalizza la squadra reale: input accettato sia come nome esteso sia come sigla, output canonico a tre lettere.
- V277 aggiunge filtro `Modifiche`.
- V278 aggiunge export CSV delle modifiche del listone.

Non rimuovere queste logiche senza ripetere test con Excel reale.

## 9. Stato EmailJS

Flussi EmailJS attivi:

- `Comunicato avvenuto scambio`.
- `Svincola Giocatori`.

V266 ha migliorato oggetto, firma, mittente logico e Reply-To. La deliverability vera dipende da template EmailJS e dominio mittente autenticato SPF/DKIM/DMARC o futura migrazione a Netlify Function + provider transazionale.

## 10. Stato Firebase Rules

Le rules V257 servono per sincronizzare la lettura esiti trattative tra dispositivi.

File:

```text
docs/zonaorientale/firebase/FIREBASE_RULES_ZONAORIENTALE_FULL_V257.rules
docs/zonaorientale/firebase/FIREBASE_RULES_PATCH_V257_TRANSFER_NOTIFICATIONS.rules
```

Non vengono applicate automaticamente da Netlify: vanno pubblicate da Firebase Console o CLI.

## 11. Cose da non eliminare senza audit

```text
assets/js/domain/competitions.js
assets/js/refactor/admin-publication-workflow-v213.js
news.html
comunicati/*.html
tools/generate-news-share-pages.mjs
vecchi fallback inline di Richieste presidenti
resti legacy V50/V79 dei comunicati scambio
```

Motivo: possono essere legacy o fallback, ma alcune funzioni potrebbero essere ancora collegate indirettamente o utili per compatibilita' con vecchi link.

## 12. Checklist minima prima di ogni merge

- `node --check static/zonaorientale/assets/app.js`.
- Check moduli JS importati.
- Check JSON asset.
- Test home/news/listone/competizioni.
- Test Dashboard Presidente.
- Test Admin -> Richieste presidenti.
- Test Admin -> Converti listone Excel con file reale.
- Test Admin -> Diagnostica dati.
- Test Listone -> filtro Modifiche ed Export CSV.
- Controllo footer/cache-buster/versione.

## 13. Quando l'utente segnala un bug

Chiedere sempre:

```text
versione footer visibile
sezione esatta
ruolo: pubblico/presidente/admin
browser/dispositivo
output DevTools console
se Firebase/EmailJS e' coinvolto
```

Poi proporre overlay piccolo, testabile e con comandi Git.

---

# Appendice A - contenuto accorpato da HANDOFF_NUOVO_ASSISTENTE_V272.md

## Aggiornamento V275

Il nuovo assistente deve leggere `docs/zonaorientale/FUNZIONALITA'V271-274.md` prima di lavorare su Listone, convertitore, ricerca storica o codici squadra. Non rimuovere la normalizzazione V274 senza un test con Excel reale.

## Aggiornamento V273

Il test end-to-end del Listone con Excel reale e' documentato in `docs/zonaorientale/listoni/LISTONE_TEST_REALE_V273.md`. Esito: formato Classic riconosciuto, 663 giocatori convertibili, confronto con `2026-05-15` funzionante, normalizzazione squadre aggiunta per evitare falsi cambi squadra.

# Handoff nuovo assistente AI - ZonaOrientale V272

Questo documento contiene le istruzioni da dare a un eventuale nuovo assistente AI per ripartire dal punto corrente senza perdere funzionalita.

## 1. File da passare al nuovo assistente

Passare sempre gli zip aggiornati:

```text
zonaorientale.zip
docs.zip
```

Se il task riguarda listoni, passare anche l'Excel reale usato in Admin -> Converti listone Excel.

Se il task riguarda notifiche trattative/Firebase, passare anche:

```text
docs/zonaorientale/firebase/FIREBASE_RULES_ZONAORIENTALE_FULL_V257.rules
docs/zonaorientale/firebase/FIREBASE_RULES_PATCH_V257_TRANSFER_NOTIFICATIONS.rules
```

## 2. Contesto repo

Repo reale:

```text
starter-academic-sb
```

Webapp:

```text
static/zonaorientale/
```

Documentazione:

```text
docs/zonaorientale/
```

Branch corrente:

```text
refactor/260528-zonaorientale-next
```

Versione runtime corrente dopo questo overlay:

```text
V274 codici squadre listone
```

## 3. Regole dell'utente da rispettare

- Consegnare sempre un solo zip overlay.
- Lo zip deve contenere le radici `zonaorientale/` e `docs/`.
- Quando si modifica codice/UI aggiornare sempre:
  - footer `Version` negli HTML;
  - cache-buster `?v=...`;
  - `DEPLOY_EXPECTED_VERSION_V181` in `assets/app.js`;
  - handoff e changelog/documentazione operativa.
- Non modificare `docs/zonaorientale/FUNZIONALITA'.md` salvo richiesta esplicita dell'utente.
- Per il progetto fantacalcio, alla consegna includere sempre i comandi Git e un messaggio commit coerente.
- I comandi locali standard sono:

```bash
cd static/zonaorientale
cd ..
python3 -m http.server 1313 --bind 0.0.0.0
```

Aprire:

```text
http://localhost:1313/zonaorientale/
```

## 4. Funzionalita critiche da non perdere

### Pubblico

- Dashboard stagione.
- News e comunicati.
- Link WhatsApp news via `/zonaorientale/share/news/<id>`.
- Home con anteprima WhatsApp generica, non ultima news.
- Rose, movimenti, listone, competizioni, statistiche, archivio, confronto, regolamento.

### Presidente

- Login email/password e Google.
- Dashboard Presidente.
- Comunicato squadra.
- Comunicato avvenuto scambio: EmailJS + richiesta Admin `TRANSFER_NEWS`.
- Svincola Giocatori: email a `caparrotti86@yahoo.it`, senza scrittura Firebase.
- Fantamercato/trattative.
- Notifiche trattative: proposta ricevuta, esito proposta inviata, lettura sincronizzata con Firebase quando le rules V257 sono pubblicate.

### Admin

- Accetta utenti stabile anti-duplicati.
- Richieste presidenti: aggiorna, approva, rifiuta, elimina da Firebase comunicati APPROVED/ACCEPTED/REJECTED.
- Generatore comunicati automatici.
- Workflow pubblicazione Admin inline.
- Converti listone Excel: formato storico `Tutti/Ceduti` e formato Classic `Lista calciatori`.
- Snapshot, backup, competizioni, rose, albo, FIFA ranking, stadi, club.

## 5. Stato listoni dopo V268-V270

- V268 supporta due formati Excel: storico e Classic.
- V269 aggiunge confronto/storico listoni.
- V270 aggiunge colonna opzionale `Modifica` e righe `Uscito` con ultimo listone contenente il giocatore.
- Non rimuovere o semplificare queste logiche senza test su Excel reale.

## 6. Stato EmailJS

I flussi EmailJS attivi sono:

- comunicato avvenuto scambio;
- svincolo giocatori.

V266 ha migliorato oggetto, firma, mittente logico e Reply-To, ma la deliverability vera dipende da template EmailJS e dominio mittente autenticato SPF/DKIM/DMARC o futura migrazione a Netlify Function + provider transazionale.

## 7. Cose da non eliminare senza audit

- `assets/js/domain/competitions.js`: sotto audit, potenzialmente legacy ma non da rimuovere senza test competizioni.
- `assets/js/refactor/admin-publication-workflow-v213.js`: scollegato o legacy, ma il workflow inline e' attivo; non eliminare senza audit dedicato.
- `news.html`, `comunicati/*.html`, `tools/generate-news-share-pages.mjs`: legacy share/statico, da mantenere per compatibilita finche non deciso diversamente.
- fallback inline V249 e vecchi blocchi V50/V79: gia neutralizzati/affiancati, ma da rimuovere solo dopo test completi.

## 8. Checklist minima prima di ogni merge

- `node --check static/zonaorientale/assets/app.js`
- check moduli JS importati.
- check JSON asset.
- test home/news/listone/competizioni.
- test Dashboard Presidente.
- test Admin -> Richieste presidenti.
- test Admin -> Converti listone Excel con file reale.
- controllo footer/cache-buster/versione.


## V274 - Codici squadra canonici nel Listone

I listoni possono arrivare con sigle o nomi estesi delle squadre reali. Il sistema accetta entrambi, ma salva/visualizza la sigla canonica a 3 lettere e conserva l’originale come metadato quando disponibile.

## Aggiornamento V276-V277

Controllare `Admin -> Diagnostica dati` e `Listone -> Modifiche` nei test di regressione. Non eliminare i moduli listone storico senza audit.


---

# Appendice B - contenuto accorpato da ISTRUZIONI_NUOVO_ASSISTENTE_260528.md

## Aggiornamento V275 per nuovo assistente

Leggere anche `docs/zonaorientale/FUNZIONALITA'V271-274.md`. Il documento registra lo stato recente del Listone: test reale V273, normalizzazione dei codici squadra V274 e regole da non perdere in eventuali refactor.

## Aggiornamento V273 per nuovo assistente

Prima di modificare ancora il Listone, leggere `docs/zonaorientale/listoni/LISTONE_TEST_REALE_V273.md`. Il test reale ha confermato il supporto Excel Classic e ha introdotto normalizzazione squadre per evitare falsi `TEAM_CHANGED`. Non rimuovere le funzioni V268-V270 senza ripetere il test con Excel reale.

# Aggiornamento V272 - Istruzioni aggiornate

Leggere prima `00_START_HERE_V272.md` e `handoff/HANDOFF_NUOVO_ASSISTENTE_V272.md`. La versione corrente e' `V274 codici squadre listone`; branch `refactor/260528-zonaorientale-next`. Il documento storico sotto resta valido, ma alcune parti possono citare versioni precedenti.

# Istruzioni per nuovo assistente - ZonaOrientale 260528

Documento aggiornato in **V267** per permettere a un nuovo assistente AI di ripartire dal punto esatto raggiunto nello sviluppo del sito del fantacalcio **ZonaOrientale Salerno**.

## 1. Contesto generale

Repo reale:

```text
starter-academic-sb
```

Webapp:

```text
static/zonaorientale/
```

Documentazione:

```text
docs/zonaorientale/
```

Branch corrente della nuova fase:

```text
refactor/260528-zonaorientale-next
```

Versione runtime corrente dopo questo overlay:

```text
V267 audit competizioni
```

## 2. Regole operative obbligatorie

1. Consegnare sempre un solo zip overlay.
2. Lo zip deve contenere le radici:

```text
zonaorientale/
docs/
```

3. Nella repo, copiare:

```text
zonaorientale/ -> static/zonaorientale/
docs/ -> docs/
```

4. Dopo ogni modifica a codice o UI aggiornare sempre:

```text
footer Version negli HTML
cache-buster ?v=...
DEPLOY_EXPECTED_VERSION_V181 in assets/app.js
AI_HANDOFF_ZONAORIENTALE_CURRENT.md
CHANGELOG_CONSOLIDATO.md
README/ROADMAP/OPERATIVITA/REGRESSION_TESTS se necessario
```

5. Il documento principale delle funzionalita e' protetto:

```text
docs/zonaorientale/FUNZIONALITA'.md
```

Va modificato solo se l'utente lo chiede esplicitamente. Per nuove funzioni incrementali, usare documenti separati come:

```text
FUNZIONALITA'V240-255.md
FUNZIONALITA'V256-262.md
```

6. Non eliminare codice legacy senza audit e test. Questo progetto ha molte patch storiche Vxx: una funzione apparentemente vecchia puo essere ancora agganciata a UI o fallback.

## 3. File da passare a un nuovo assistente

Chiedere sempre all'utente gli zip aggiornati:

```text
zonaorientale.zip
docs.zip
```

Se si lavora su Firebase Rules, chiedere anche:

```text
docs/zonaorientale/firebase/FIREBASE_RULES_ZONAORIENTALE_FULL_V257.rules
docs/zonaorientale/firebase/FIREBASE_RULES_PATCH_V257_TRANSFER_NOTIFICATIONS.rules
```

File da leggere subito:

```text
docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_CURRENT.md
docs/zonaorientale/PROSSIME_ATTIVITA_260528.md
docs/zonaorientale/REGRESSION_TESTS.md
docs/zonaorientale/FUNZIONALITA'.md
docs/zonaorientale/FUNZIONALITA'V240-255.md
docs/zonaorientale/FUNZIONALITA'V256-262.md
docs/zonaorientale/AUDIT_COMPETIZIONI_V267.md
```

## 4. Comandi locali standard

Dalla repo:

```bash
cd starter-academic-sb
cd static/zonaorientale
cd ..
python3 -m http.server 1313 --bind 0.0.0.0
```

Aprire:

```text
http://localhost:1313/zonaorientale/
```

## 5. Comandi Git branch corrente

```bash
cd starter-academic-sb
git checkout refactor/260528-zonaorientale-next
git pull origin refactor/260528-zonaorientale-next
```

Applicazione overlay:

```bash
mkdir -p /tmp/zo_overlay
unzip ~/Downloads/NOME_OVERLAY.zip -d /tmp/zo_overlay
rsync -av /tmp/zo_overlay/zonaorientale/ static/zonaorientale/
rsync -av /tmp/zo_overlay/docs/ docs/
```

Commit:

```bash
git status
git add <file modificati>
git commit -m "tipo: descrizione"
git push origin refactor/260528-zonaorientale-next
```

Merge futuro su master solo dopo test completi:

```bash
git checkout master
git pull origin master
git merge --no-ff refactor/260528-zonaorientale-next -m "merge: integra aggiornamenti zonaorientale 260528"
git push origin master
```

## 6. Funzioni recenti da non perdere

### Comunicati presidente

Flusso canonico comunicato avvenuto scambio:

```text
Presidente -> Dashboard Presidente -> Comunicato avvenuto scambio
-> teamRequests type TRANSFER_NEWS
-> EmailJS immediata a caparrotti86@yahoo.it
-> Admin approva in Richieste presidenti
-> pubblicazione in News
```

Non deve tornare il vecchio flusso presidente -> scrittura diretta in `news`.

### Svincola Giocatori

Aggiunto in V261 in Dashboard Presidente.

```text
Presidente -> Svincola Giocatori
-> selezione multipla dalla rosa
-> quotazione da listone piu recente disponibile
-> email EmailJS a caparrotti86@yahoo.it
```

Non scrive su Firebase e non crea richiesta Admin.

### Trattative e notifiche

Badge e notifiche derivano da `transferNegotiations`. Da V257, se le Firebase Rules sono pubblicate, la lettura esito e' sincronizzabile tra dispositivi. Fallback: localStorage.

Comandi test console:

```js
ZonaOrientaleTradeSimulatorV255.help()
await ZonaOrientaleTradeSimulatorV255.runLocalSmokeTest()
```

### Admin -> Richieste presidenti

Funzioni da preservare:

```text
Aggiorna richieste
Approva
Rifiuta
Elimina da Firebase per comunicati APPROVED/ACCEPTED/REJECTED
```

Il pulsante elimina solo `teamRequests/{id}`, non cancella news gia pubblicate.

### Admin -> Comunicati

Generatore comunicati automatici ripristinato in V250. Deve solo generare/copiare/inserire bozze nel form Comunicati, senza scrivere direttamente su Firebase.

### News / anteprime WhatsApp

Home: meta generici.
News: anteprime specifiche solo tramite:

```text
/zonaorientale/share/news/<id>
```

Il pulsante `Apri preview` e' stato rimosso; resta `Copia link WhatsApp`.

### EmailJS

V266 ha normalizzato oggetti, footer, `from_name` logico e `reply_to`. La deliverability reale dipende da configurazione EmailJS/provider/DNS SPF-DKIM-DMARC.

## 7. Stato audit V267 competizioni

V267 non rimuove nulla. Documenta che:

```text
assets/js/domain/competitions.js
```

sembra un modulo legacy/scollegato, ma non va eliminato senza test di:

```text
Dashboard pubblica
Sezione Competizioni
competition.html
Archivio stagioni
Admin -> Competizioni
Albo/Statistiche collegate
```

Diagnostica:

```js
window.ZonaOrientaleCompetitionsAuditV267
```

## 8. Cose da evitare

Non eliminare senza audit:

```text
assets/js/domain/competitions.js
assets/js/refactor/admin-publication-workflow-v213.js
news.html
comunicati/*.html
vecchi fallback inline di Richieste presidenti
resti legacy V50/V79 dei comunicati scambio
```

Non modificare `FUNZIONALITA'.md` salvo richiesta esplicita dell'utente.

## 9. Quando l'utente segnala un bug

Chiedere sempre:

```text
versione footer visibile
sezione esatta
ruolo: pubblico/presidente/admin
browser/dispositivo
output DevTools console
se Firebase/EmailJS e' coinvolto
```

Poi proporre overlay piccolo, testabile e con comandi Git.


## Aggiornamento V268 per nuovo assistente

Il convertitore listone Excel e' stato esteso. Non rimuovere il supporto al formato storico `Tutti`/`Ceduti`: la V268 aggiunge il formato Classic a foglio singolo senza sostituire il precedente.

File da leggere se si lavora sui listoni:

```text
docs/zonaorientale/LISTONE_CONVERTER_V268.md
static/zonaorientale/assets/js/admin/listone-converter.js
```

Diagnostica runtime:

```js
window.ZonaOrientaleListoneConverterV268
```


## V269 - Storico e confronto listoni

- Aggiunto confronto automatico tra listone selezionato e listone precedente della stessa stagione.
- Il convertitore listone arricchisce il JSON generato con campi `previous`, `diff`, `previousQuotationCurrent`, `quotationDiffFromPrevious`, `statusChange` e riepilogo `history`.
- La sezione pubblica `Listone` mostra un pannello `Storico listoni` con nuovi, usciti, variazioni quotazione e ricerca negli altri listoni.
- Il campo ricerca puo' trovare giocatori presenti in listoni passati anche quando non sono nel listone selezionato.
- Diagnostica: `window.ZonaOrientaleListoneHistoryV269`.
- Non sono state rimosse funzionalita' esistenti; il formato storico Tutti/Ceduti e il formato Classic a foglio singolo restano supportati.

## Aggiornamento V271

Leggere anche:

- `docs/zonaorientale/FUNZIONALITA'V263-270.md`

Questo documento traccia le funzionalita' aggiunte o consolidate da V263 a V270, in particolare il lavoro sul listone: formato Classic, storico, ricerca globale e colonna `Modifica`.


## V274 - Codici squadra canonici nel Listone

Il convertitore listone accetta sia sigle sia nomi estesi per la squadra reale, ma salva/visualizza la sigla canonica a 3 lettere. Questo evita falsi cambi squadra nei confronti storici e rende stabile la colonna `Modifica`.

## Aggiornamento V276-V277 per nuovo assistente

Leggere anche:

- `docs/zonaorientale/admin/DIAGNOSTICA_DATI_V276.md`
- `docs/zonaorientale/listoni/LISTONE_FILTRO_MODIFICHE_V277.md`

Queste modifiche non rimuovono funzioni: aggiungono diagnostica Admin e un filtro Listone.

## V278 - Export modifiche listone

Aggiunto export CSV non distruttivo delle modifiche del Listone. Il pulsante `Esporta modifiche CSV` rispetta il filtro `Modifiche` e include nuove righe, usciti storici, variazioni quotazione/stato/squadra/ruolo. Documento tecnico: `docs/zonaorientale/listoni/LISTONE_EXPORT_MODIFICHE_V278.md`.



## V280 - UI Listone semplificata

- La sezione pubblica `Storico listoni` e' stata rimossa/nascosta dalla UI.
- Le logiche V269-V278 restano preservate per colonna `Modifica`, filtro `Modifiche`, usciti storici ed export CSV.
- Documento tecnico: `docs/zonaorientale/listoni/LISTONE_UI_SEMPLIFICATA_V280.md`.
- Audit grafico iniziale: `docs/zonaorientale/audit/AUDIT_MOBILE_LIGHT_CONTRAST_V280.md`.
- Prossima uscita consigliata: contrasto e leggibilita mobile in modalita Light.


## V281 - Contrasto mobile Light

- Versione runtime: `V281 contrasto mobile Light`.
- Migliorata leggibilita in tema Light su smartphone.
- Patch solo CSS + diagnostica runtime: `window.ZonaOrientaleMobileLightContrastV281`.
- Documento tecnico: `docs/zonaorientale/audit/AUDIT_MOBILE_LIGHT_CONTRAST_V281.md`.
- Non sono state modificate logiche Listone, Firebase, EmailJS o dati JSON.

## V294 - Helper puri app.js

Prima estrazione prudente verso il refactor di `assets/app.js`: aggiunto `assets/js/utils/shared-helpers-v294.js`. Il modulo e' importato e diagnosticato, ma i call-site storici non sono ancora stati riscritti. Prima di usare questi helper al posto di funzioni legacy fare grep, indicare funzionalita a rischio e testare Listone, rose, Dashboard Presidente, Admin, mobile, `competition.html`, `player.html` e news share.


## Aggiornamento V297

Il vecchio helper `assets/js/utils/shared-helpers-v294.js` e' da considerare obsoleto dopo V295/V296 e viene rimosso in V297. Non rimuovere `shared-helpers-v295.js`, usato dall'export CSV modifiche Listone. Ogni refactor successivo deve dichiarare funzionalita' a rischio e test di preservazione.
