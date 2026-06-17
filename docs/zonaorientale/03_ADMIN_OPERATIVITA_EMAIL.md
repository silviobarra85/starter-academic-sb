## Aggiornamento V454 - Selettore card Admin e Checklist QA opzionale (15/06/2026)

- Runtime avanzato a V454 con footer e cache-buster coerenti su ZonaOrientale e FantaPetilloMantraManager.
- Aggiunto `assets/js/core/admin-card-visibility-v454.js` su entrambe le leghe: nell'Admin inserisce sotto il titolo un menu di visibilita' per scegliere quali card/pannelli mostrare.
- Default conservativo: tutte le card Admin sono deselezionate e quindi nascoste; l'admin puo' spuntare solo quelle che servono oppure usare `Mostra tutte`/`Nascondi tutte`.
- La `Checklist QA Admin` in basso viene nascosta di default; resta disponibile tramite checkbox dedicata nello stesso menu Admin.
- Aggiunto `assets/css/refactor/admin-card-visibility-v454.css` e audit `tools/audit-admin-card-visibility-v454.mjs`.
- Nessuna modifica a Firebase, rules, dati, snapshot generator, Area Squadra, Bilanci mobile V438, badge dispositivo V434 o `FUNZIONALITA'.md`.

## Nota operativa V440

- Nessuna variazione operativa Admin.
- Per condividere la sezione Bilanci su WhatsApp usare il nuovo pulsante `Copia link WhatsApp` nella pagina Bilanci.
- Per aggiornare i valori mostrati nei Bilanci resta valido il flusso: modifiche FM in Admin, `Snapshot pubblici -> Aggiorna tutto`, overlay snapshot, commit e push.

## Nota operativa V438

- Nessuna variazione operativa Admin. I Bilanci continuano ad aggiornarsi stabilmente dopo `Snapshot pubblici -> Aggiorna tutto` e commit degli snapshot.
- La patch V438 modifica solo layout e comportamento di apertura dei dettagli nella sezione pubblica Bilanci.

## Nota operativa V437

- Nessuna modifica operativa ad Admin.
- Dopo modifiche a budget o movimenti FM resta valido il flusso: Snapshot pubblici -> Aggiorna tutto, scarica overlay snapshot stagioni, applica alla repo, commit e push.
- La sezione Bilanci mostrera' i nuovi valori dopo la pubblicazione degli snapshot aggiornati.

## Nota operativa V436 - Modifica movimenti FM

- In Admin -> Rose e movimenti FM, ogni movimento della rosa selezionata mostra ora `Modifica` ed `Elimina`.
- `Modifica` precompila il form; `Aggiorna movimento` salva le variazioni sul record esistente.
- Usa l'editing per correggere data, importo, descrizione, tipo o campi del movimento senza dover cancellare e reinserire.
- Se modifichi tipo, giocatore, rosa sorgente o rosa destinazione di un movimento che aveva gia aggiornato la rosa, controlla subito il conteggio giocatori e la rosa delle squadre coinvolte.
- Dopo l'aggiornamento dei movimenti: Snapshot pubblici -> Aggiorna tutto, scarica overlay snapshot stagioni, applica alla repo, commit e push.

## Nota operativa V435

- Nessuna modifica ai flussi Admin, EmailJS, permessi, richieste presidente o pubblicazioni.
- La nuova sezione Bilanci mostra cio' che e' gia' stato pubblicato negli snapshot: dopo cambi budget/movimenti FM va eseguito `Snapshot pubblici -> Aggiorna tutto` e poi va committato l'overlay snapshot.
- Test manuale consigliato: dopo l'aggiornamento snapshot aprire `#bilanci`, selezionare stagione e squadra, e confrontare saldo/movimenti con la sezione Admin Rose e Movimenti FM.

## Nota operativa V434

- Nessuna modifica ai flussi Admin, EmailJS, permessi o pubblicazioni.
- Il badge dispositivo e' solo diagnostico e non interagisce con form o workflow.
- Test manuale consigliato: verificare che il badge non copra pulsanti operativi in Admin e Area Squadra da mobile.

## Nota operativa V433

- Nessuna modifica ai flussi Admin o EmailJS.
- In Area Squadra mobile i pannelli email `Comunicato avvenuto scambio` e `Svincola Giocatori` sono piu in basso e chiusi di default, ma restano apribili e funzionanti.
- Test manuale consigliato: login presidente mobile, apertura/riduzione pannelli, verifica pulsanti Dashboard e form senza invii reali se non necessari.

## Nota operativa V432

- Nessuna modifica ai flussi Admin o EmailJS.
- I flussi email presidente restano invariati: comunicato avvenuto scambio V242 e informativa svincolo V261 vengono solo presentati chiusi da mobile.
- Test manuale consigliato: aprire Area Squadra da smartphone, aprire/ridurre i due pannelli, inviare solo in ambiente controllato se necessario.

## Nota operativa V431

- Nessuna modifica ai flussi Admin o EmailJS.
- Area Squadra mobile ora presenta Dashboard Presidente sopra a tutto e Notifiche subito dopo.
- Test manuale consigliato: login presidente da smartphone, controllo Dashboard Presidente, Notifiche, Apri pagina squadra, nuova proposta, trattative e comunicato.

## Nota operativa V429

- Corretto il problema mobile dei titoli Admin scritti una lettera sopra l'altra quando il pulsante Apri/Riduci occupava spazio nello stesso header.
- Su schermi stretti il bottone viene disposto sotto il titolo, evitando compressione e mantenendo leggibilita'.
- Test manuale consigliato: aprire Admin da smartphone, verificare categorie e pannelli collassati/espansi, in particolare sezioni con titoli lunghi.
- Nessuna modifica a EmailJS, permessi, import, pubblicazioni o notifiche.

## Nota operativa V428

- Nessuna modifica ad Admin, EmailJS, permessi, import Excel, pubblicazioni, notifiche o dashboard presidente.
- Prima del merge, verificare manualmente da mobile: login admin, pannelli principali, import listone/rose, pubblicazioni e sezioni presidente.
- V428 serve solo come checkpoint operativo finale.

## Nota operativa V427

- Nessuna modifica ad Admin, EmailJS, permessi, import Excel, pubblicazioni, notifiche o dashboard presidente.
- V427 modifica solo la classificazione dei warning legacy nel gate locale.
- Test manuale consigliato invariato: verificare le sezioni admin principali prima del merge.

## Nota operativa V426

- Nessuna modifica ad Admin, EmailJS, permessi, import Excel, pubblicazioni o notifiche.
- L'audit V426 verifica che la fase mobile resti coerente prima di eventuale pre-merge.
- Test manuale consigliato: confermare da mobile che Admin V416 e accessibilita V418 siano ancora preservate.

---

# Admin, operativita, release operative ed email

## Nota operativa V424

- Nessuna modifica ad Admin, EmailJS, permessi, import Excel, pubblicazioni o notifiche.
- L'intervento riguarda solo tipografia e layout mobile di sezioni pubbliche/residue e tabelle dense.
- Test consigliato: verificare Admin da mobile per confermare che V416/V418 restino preservate.

---


## Nota operativa V423

- Nessuna modifica ad Admin, EmailJS, permessi, import Excel, pubblicazioni o notifiche.
- L'intervento riguarda solo tipografia e layout mobile di sezioni pubbliche e tabelle Rosa.
- Test consigliato: verificare Admin da mobile per confermare che V416/V418 restino preservate.

---


## Nota operativa V422

- Nessuna modifica ad Admin, EmailJS, permessi, import Excel, pubblicazioni o notifiche.
- La patch modifica solo presentazione mobile e refresh locale dell'Archivio dopo il caricamento live dei comunicati.
- Test consigliato: pubblicare/verificare 4 comunicati, aprire Archivio Stagioni da mobile e controllare che Timeline dati si aggiorni senza interventi admin aggiuntivi.

---


## Nota operativa V421

- Nessuna modifica ad Admin, EmailJS, import, pubblicazioni, permessi o notifiche.
- La patch riguarda Archivio Stagioni mobile e composizione locale dei comunicati gia' disponibili nel runtime.
- Test consigliato: verificare che Admin resti invariato e che la Timeline dati Archivio mostri i comunicati piu' recenti in ordine.

---

## Nota operativa V420

- Nessuna modifica operativa ad Admin, EmailJS, import Excel, pubblicazioni, notifiche o permessi.
- L'area Admin eredita solo la nuova scala mobile per card, liste, label e valori.
- Test consigliato: verificare Admin da mobile controllando che form e bottoni restino usabili e che i testi abbiano dimensione coerente.

---


## Nota operativa V418

- Nessuna modifica operativa all'area Admin, EmailJS, import Excel, pubblicazioni o notifiche.
- La V416 Admin mobile resta preservata; V418 migliora solo focus, tap feedback e gestione overflow anche nei pannelli amministrativi da mobile.
- Test consigliato: accedere da mobile come admin e verificare che i controlli abbiano focus visibile e che le tabelle lunghe continuino a scorrere.

---

## Nota operativa V417

- Nessuna modifica operativa all'area Admin, a EmailJS, import Excel, pubblicazioni o notifiche.
- La V416 Admin mobile resta preservata; V417 aggiunge solo pulizia asset e audit di integrita.
- Test consigliato: eseguire `node tools/audit-css-asset-cleanup-v417.mjs` e poi un controllo manuale rapido su Admin mobile.

---


## Nota operativa V416

- L'area Admin e' piu compatta da mobile, ma workflow, autorizzazioni, pubblicazioni, EmailJS, import Excel e notifiche restano invariati.
- Test consigliato: da smartphone accedere come admin e verificare Stagioni, Modifica club, Carica listone, Carica rose, liste modificabili e tabelle risultati.
- Verificare in particolare che i pulsanti di salvataggio/invio restino visibili e che le liste lunghe scorrano correttamente.

---

## Nota operativa V415

- Nessuna modifica a workflow admin, pubblicazione, EmailJS, notifiche, ruoli o permessi.
- Test consigliato: da smartphone aprire la dashboard e verificare che il comunicato piu recente sia la prima card; poi aprire La mia squadra e verificare la tabella Rosa.
- Per admin/presidente: verificare che le azioni gia presenti nella pagina squadra continuino a essere raggiungibili.

---

---

## Nota operativa V414

- Nessuna modifica a workflow admin, approvazione presidenti, EmailJS, notifiche, ruoli o permessi.
- Test consigliato: da smartphone/emulazione mobile accedere come presidente approvato, aprire Area Squadra e verificare form FM, richiesta giocatore e comunicato squadra.
- Per admin: verifica rapida che le richieste continuino ad arrivare e restino approvabili dai pannelli esistenti.

---

## Nota operativa V413

- Nessuna modifica a workflow admin, pubblicazione, EmailJS, notifiche, ruoli o permessi.
- Test consigliato: verificare Listone e Calciomercato da smartphone/emulazione mobile, assicurando che filtri, ricerca, date e pulsanti continuino a funzionare.

---

## Nota operativa V412

- Nessuna modifica a workflow admin, pubblicazione, EmailJS, notifiche, ruoli o permessi.
- Test consigliato: aprire il menu Altro da smartphone/emulazione mobile e verificare che tutti i link restino raggiungibili e che Admin compaia solo quando previsto.



## Nota operativa V411

- Nessuna modifica a workflow admin, pubblicazione, EmailJS, notifiche, ruoli o permessi.
- Test consigliato: verifica dashboard da smartphone/emulazione mobile e controllo rapido admin per assicurare che il CSS mobile non impatti pannelli operativi.


## Nota operativa V410

- Nessuna modifica a workflow admin, pubblicazione, email, permessi o dashboard presidente.
- Il Calciomercato resta gestito dalle stesse fonti e dagli stessi strumenti admin gia presenti.


---

## Nota operativa V409

- Nessuna modifica a workflow admin, pubblicazione, email, permessi, dashboard presidente o funzioni operative.
- Le verifiche V409 sono limitate a UI mobile delle tabelle giocatori e preservazione delle feature recenti.


---

## Nota operativa V406

- Nessuna modifica alle funzioni admin, pubblicazione, email o workflow presidente/admin.
- I controlli V406 sono solo baseline runtime/mobile e non alterano permessi o flussi operativi.


Contiene documenti su area admin, procedure operative, pubblicazione, release operative e email.

> Documento generato da accorpamento per categoria. I contenuti originali sono riportati integralmente sotto il rispettivo percorso originale.

File originali accorpati: **21**.

## Indice dei file originali in questa categoria

- `admin/ADMIN_DIAGNOSTICA_EXPAND_FIX_V321.md`
- `admin/ADMIN_LAYOUT_V313.md`
- `admin/DIAGNOSTICA_DATI_V276.md`
- `admin/DIAGNOSTICA_DATI_V303.md`
- `admin/DIAGNOSTICA_LISTONE_RUOLI_V322.md`
- `audit/ADMIN_FUNCTIONS_CHECK_V343.md`
- `audit/ADMIN_PUBLICATION_WORKFLOW_AUDIT_MATRIX_V351.md`
- `audit/PUBLICATION_DASHBOARD_MATRIX_V368.md`
- `calciomercato/CALCIOMERCATO_SOLO_ADMIN_TOGGLE_V327.md`
- `email/EMAIL_DELIVERABILITY_EMAILJS_V266.md`
- `OPERATIVITA_ADMIN_E_RELEASE.md`
- `refactor/ADMIN_PUBLICATION_WORKFLOW_AUDIT_V351.md`
- `refactor/CALCIOMERCATO_ARCHIVE_ADMIN_REFACTOR_V340.md`
- `refactor/CSS_LEGACY_CLEANUP_ADMIN_DIAGNOSTICS_V343.md`
- `refactor/LISTONE_EXPORT_ADMIN_ONLY_V296.md`
- `release/RELEASE_V327_SOLO_ADMIN_CALCIOMERCATO.md`
- `release/RELEASE_V340_ARCHIVE_ADMIN_PLAYER_MATCHING.md`
- `release/RELEASE_V343_CSS_LEGACY_ADMIN_DIAGNOSTICS.md`
- `release/RELEASE_V351_ADMIN_PUBLICATION_WORKFLOW_AUDIT.md`
- `release/RELEASE_V368_DASHBOARD_PUBBLICAZIONE_ADMIN.md`
- `test/PUBLICATION_DASHBOARD_ADMIN_V368.md`

---

## 1. `admin/ADMIN_DIAGNOSTICA_EXPAND_FIX_V321.md`

- Percorso originale: `admin/ADMIN_DIAGNOSTICA_EXPAND_FIX_V321.md`
- Dimensione originale: 1078 byte
- SHA-256: `3e69a932f47b865acbd0b36ada13113c102c46520f3f2d95debccee773a2221d`

```markdown
# V321 - Fix espansione Diagnostica dati Admin

## Scopo

Ripristina l'espansione/riduzione del pannello `Admin -> Diagnostica dati`.

## Causa probabile

Il pannello diagnostica V276 viene iniettato dopo il render principale dell'area Admin.
Dopo V313 i pannelli Admin partono ridotti, ma il pulsante della diagnostica poteva restare senza listener diretto perche' `attachAdminHandlers()` era gia' stato eseguito.

## Intervento

Aggiunto un handler delegato e limitato al solo pannello `adminDataDiagnosticsPanelV276`.

## Funzionalita preservate

- Admin -> Richieste presidenti.
- Admin -> Diagnostica dati.
- Admin -> Converti listone Excel.
- Listone pubblico/Admin ed export CSV solo Admin.
- Rose e pagina squadra.
- Dashboard Presidente.
- Calciomercato RSS.
- Firebase/Auth/EmailJS.
- Mobile navigation.

## Test consigliati

1. Login Admin.
2. Verificare che `Diagnostica dati` parta ridotta.
3. Cliccare `Espandi`: la tabella diagnostica deve aprirsi.
4. Cliccare `Riduci`: il pannello deve richiudersi.
5. Cliccare `Aggiorna diagnostica` dentro il pannello aperto.
```

---

## 2. `admin/ADMIN_LAYOUT_V313.md`

- Percorso originale: `admin/ADMIN_LAYOUT_V313.md`
- Dimensione originale: 1973 byte
- SHA-256: `ed6b79f645ccdd134adad128b524496bafc0432fa847d92d9833d22d9bde9e6f`

```markdown
# V313 - Admin ordinato e sezioni ridotte

## Scopo

V313 corregge l'ordine visivo dell'area Admin e rende piu' controllabile la pagina dopo il caricamento dei dati completi.

## Modifiche

- Il titolo `Admin` resta sempre il primo blocco visibile dell'area Admin.
- I pannelli informativi inseriti da versioni precedenti (`Avvisi pubblicazione`, `Stato Firebase / JSON`, `Procedura guidata Pubblica aggiornamenti`) vengono spostati sotto il titolo, non sopra.
- Le categorie Admin vengono mostrate ridotte al primo caricamento, con pulsante `Apri` / `Riduci`.
- I pannelli Admin collassabili vengono inizializzati ridotti al primo render in cui compaiono.
- La sezione `Dati amministrazione non ancora caricati`, che contiene `Carica dati amministrazione`, resta aperta.

## Funzionalita a rischio e preservazione

Funzionalita da non perdere:

- `Carica dati amministrazione` e modalita Admin leggero/completo.
- `Richieste presidenti`: aggiorna, approva, rifiuta, elimina da Firebase.
- `Diagnostica dati` Admin.
- `Converti listone Excel`.
- Snapshot pubblici, backup e workflow pubblicazione.
- Listone pubblico/Admin, export CSV solo Admin, colonna `Modifica`.
- Dashboard Presidente, trattative, comunicati, svincoli.
- Calciomercato RSS automatico.

Preservazione applicata:

- Nessuna funzione Admin storica e' stata rimossa.
- Nessuna scrittura Firebase nuova.
- Nessun dato JSON modificato.
- Il cambiamento e' solo di ordine visuale/collasso UI.
- Diagnostica runtime: `window.ZonaOrientaleAdminLayoutV313`.

## Test minimi

1. Entrare come Admin in modalita leggera.
2. Verificare che il titolo `Admin` sia sopra tutto.
3. Verificare che `Carica dati amministrazione` sia visibile e aperto.
4. Premere `Carica dati amministrazione`.
5. Verificare che le categorie Admin siano ridotte.
6. Aprire `Utenti e comunicazioni`, `Rose e mercato`, `Competizioni`, `Snapshot e backup`.
7. Verificare `Richieste presidenti`, `Diagnostica dati`, `Converti listone Excel`.
```

---

## 3. `admin/DIAGNOSTICA_DATI_V276.md`

- Percorso originale: `admin/DIAGNOSTICA_DATI_V276.md`
- Dimensione originale: 900 byte
- SHA-256: `4e4f24b8cfe42a328fad74a2c3f7cd651e40a26ff58381629aa9ab1a1e598c50`

````markdown
# V276 - Diagnostica dati Admin

La V276 aggiunge in **Admin** il pannello **Diagnostica dati**.

## Obiettivo

Fornire un controllo rapido e non distruttivo prima di deploy/merge, per ridurre il rischio che una funzionalita' si perda per strada.

## Controlli disponibili

Il pannello mostra semafori per:

- versione deploy, footer e cache-buster;
- listoni e confronto col listone precedente;
- rose e numero giocatori aggregati;
- competizioni e calendari statici;
- news e route share `/zonaorientale/share/news/<id>`;
- richieste presidenti;
- trattative e simulatore V255;
- EmailJS e flussi comunicato scambio/svincolo.

## Diagnostica console

```js
window.ZonaOrientaleAdminDiagnosticsV276
window.ZonaOrientaleAdminDiagnosticsV276.getRows()
window.ZonaOrientaleAdminDiagnosticsV276.refresh()
```

## Note

Il pannello non scrive su Firebase e non sostituisce i test manuali di regressione.
````

---

## 4. `admin/DIAGNOSTICA_DATI_V303.md`

- Percorso originale: `admin/DIAGNOSTICA_DATI_V303.md`
- Dimensione originale: 1697 byte
- SHA-256: `e20759c2ae34c17493011d60c895984832f6bd635bfa9f8ce43cd2cc579f3dbe`

````markdown
# V303 - Diagnostica dati Admin estesa

## Scopo

V303 estende il pannello `Admin -> Diagnostica dati` con controlli di qualita non distruttivi su Listoni, Rose, Competizioni e News.

## Funzionalita a rischio e preservazione

Funzionalita da preservare:

- Listone pubblico e Admin, inclusi colonna `Modifica`, filtro `Modifiche`, usciti storici ed export CSV solo Admin.
- Rose pubbliche, pagina squadra e Dashboard Presidente.
- Admin -> Richieste presidenti, Diagnostica dati e Converti listone Excel.
- Mobile navigation, menu Altro, pulsante Su e Dark mode unico.
- Firebase/Auth/EmailJS.

Preservazione adottata:

- Nessuna scrittura Firebase.
- Nessuna modifica ai JSON statici.
- Nessuna funzione storica rimossa da `assets/app.js`.
- La diagnostica V276 resta il pannello canonico; V303 aggiunge righe extra tramite override controllato.

## Controlli aggiunti

- `Listoni - qualita dati`: duplicati, ruoli mancanti, quotazioni mancanti, squadre non canoniche.
- `Rose - qualita dati`: snapshot, rose vuote, giocatori senza nome.
- `Competizioni - completezza`: competizioni senza nome/tipo e calendari senza id.
- `News - completezza`: comunicati senza titolo, testo o topic/tipo.

## Diagnostica runtime

```js
window.ZonaOrientaleAdminDiagnosticsV303
window.ZonaOrientaleAdminDiagnosticsV303.getRows()
window.ZonaOrientaleAdminDiagnosticsV303.getExtraRows()
window.ZonaOrientaleAdminDiagnosticsV303.refresh()
```

## Test consigliati

1. Login Admin.
2. Aprire `Admin -> Diagnostica dati`.
3. Verificare che il pannello mostri anche le righe qualità V303.
4. Premere `Aggiorna diagnostica`.
5. Controllare Listone pubblico/Admin, Rose e Dashboard Presidente per assenza regressioni.
````

---

## 5. `admin/DIAGNOSTICA_LISTONE_RUOLI_V322.md`

- Percorso originale: `admin/DIAGNOSTICA_LISTONE_RUOLI_V322.md`
- Dimensione originale: 1565 byte
- SHA-256: `af4765bb67cb8ae624bef3f4434fd684850b0e862f982bbd180b3f21b158f6ee`

````markdown
# V322 - Fix diagnostica ruoli Listone

## Scopo

Correggere il falso positivo nel pannello `Admin -> Diagnostica dati`, riga `Listoni - qualita dati`, dove venivano segnalati `senza ruolo 663` anche se i ruoli erano presenti nei JSON del Listone.

## Causa

La diagnostica V303 cercava il ruolo solo in pochi alias (`role`, `ruolo`, `position`, `fantasyRole`, `R.`). I listoni generati dal convertitore Classic usano invece campi come:

```text
classicRole
rosterRole
mantraRoles
```

Per questo tutti i 663 giocatori risultavano falsamente senza ruolo.

## Modifica

La diagnostica ora riconosce anche:

```text
classicRole
rosterRole
mantraRoles
roleClassic
roleMantra
R
R.
R.MANTRA
```

## Funzionalita a rischio e preservazione

Funzionalita verificate e da preservare:

```text
Listone pubblico
Colonna Modifica
Filtro Modifiche
Mostra usciti storici
Export CSV solo Admin
Convertitore listone Excel
Admin -> Diagnostica dati
Calciomercato RSS
Fantamercato interno
Rose e pagina squadra
Dashboard Presidente
```

Preservazione:

```text
nessun JSON modificato
nessun rendering Listone modificato
nessun convertitore modificato
nessuna funzione Firebase/EmailJS toccata
la modifica riguarda solo il calcolo diagnostico del ruolo
```

## Test

1. Login Admin.
2. Aprire `Admin -> Diagnostica dati`.
3. Cliccare `Aggiorna diagnostica`.
4. Verificare che `Listoni - qualita dati` non segnali piu tutti i giocatori come senza ruolo.
5. Verificare Listone pubblico e Listone Admin.

Diagnostica console:

```js
window.ZonaOrientaleListoneDiagnosticsRoleFixV322
```
````

---

## 6. `audit/ADMIN_FUNCTIONS_CHECK_V343.md`

- Percorso originale: `audit/ADMIN_FUNCTIONS_CHECK_V343.md`
- Dimensione originale: 994 byte
- SHA-256: `b49caa91f102c88862421d82677ea0e0c292b318c2b3eda2f5f1c37e089ddccb`

````markdown
# V343 - Audit funzioni Admin

## Tool

```bash
static/zonaorientale/tools/audit-admin-functions-v343.mjs
```

## Cosa verifica

Il tool controlla staticamente che nel runtime siano presenti:

- `renderAdminArea`;
- `attachAdminHandlers`;
- `renderAdminPanel`;
- pannello `adminDataDiagnosticsPanelV276`;
- pulsante `data-refresh-diagnostics-v276`;
- timestamp `data-admin-diagnostics-last-refresh-v343`;
- toggle Diagnostica dati V321;
- Richieste presidenti;
- convertitore listone Admin;
- pannello Calciomercato Solo Admin V340.

## Limiti

Il tool non sostituisce un test browser con login Admin, perche Firebase/Auth richiedono ambiente reale. Serve pero a bloccare regressioni evidenti di wiring e marker prima del deploy.

## Test browser consigliato

1. Login Admin.
2. Aprire Admin -> Diagnostica dati.
3. Premere `Aggiorna diagnostica`.
4. Verificare aggiornamento timestamp con ora italiana.
5. Espandere/ridurre il pannello.
6. Controllare Richieste presidenti e Converti listone.
````

---

## 7. `audit/ADMIN_PUBLICATION_WORKFLOW_AUDIT_MATRIX_V351.md`

- Percorso originale: `audit/ADMIN_PUBLICATION_WORKFLOW_AUDIT_MATRIX_V351.md`
- Dimensione originale: 928 byte
- SHA-256: `690255c0a4be346ae564e756b92e66682d4add80d5a74c19edc872deaa897eb3`

```markdown
# Matrice audit workflow pubblicazione Admin V351

## File verificato

| File | Stato | Decisione V351 |
| --- | --- | --- |
| `assets/js/refactor/admin-publication-workflow-v213.js` | presente, non importato direttamente | tenere, non rimuovere in V351 |

## Workflow canonico attivo

| Area | Implementazione attiva | Esito |
| --- | --- | --- |
| Stato Firebase / JSON | inline in `assets/app.js`, V190 | preservato |
| Preflight asset pubblici | inline in `assets/app.js`, V179/V203 | preservato |
| Promemoria pubblicazione dati | inline in `assets/app.js`, V189 | preservato |
| Pannello Admin | inline in `assets/app.js` | preservato |

## Rischio

Rischio basso in V351: audit-only, nessuna rimozione e nessun cambio logico.

Il rischio diventerebbe medio se si decidesse di rimuovere V213, perche riguarda documentazione storica e flussi Admin/pubblicazione. Eventuale rimozione va fatta solo in una versione dedicata.
```

---

## 8. `audit/PUBLICATION_DASHBOARD_MATRIX_V368.md`

- Percorso originale: `audit/PUBLICATION_DASHBOARD_MATRIX_V368.md`
- Dimensione originale: 792 byte
- SHA-256: `9d2ee844fc8e7d763933e2d5c300466a3179a263036f7e3428155d5d3adfaa79`

````markdown
# Audit matrix V368 - Dashboard pubblicazione Admin

| Area | Controllo | Esito atteso |
| --- | --- | --- |
| Versione | `DEPLOY_EXPECTED_VERSION_V181 = 368` | OK |
| HTML | footer V368 su index, competition, player | OK |
| Cache | cache-buster `?v=368` allineati | OK |
| Admin | marker `ZonaOrientaleAdminPublicationDashboardV368` presente | OK |
| V189 | promemoria pubblicazione preservati | OK |
| V190 | semafori Firebase/JSON preservati | OK |
| V191 | wizard pubblicazione preservato | OK |
| V367 | smoke test protetto ancora presente | OK |
| Firebase | nessuna nuova scrittura | OK |
| File | nessun runtime cancellato | OK |
| Docs | `FUNZIONALITA'.md` non modificato | OK |

## Audit automatico

```bash
node static/zonaorientale/tools/audit-publication-dashboard-v368.mjs
```
````

---

## 9. `calciomercato/CALCIOMERCATO_SOLO_ADMIN_TOGGLE_V327.md`

- Percorso originale: `calciomercato/CALCIOMERCATO_SOLO_ADMIN_TOGGLE_V327.md`
- Dimensione originale: 1252 byte
- SHA-256: `9d058357ec915d872501c86afd29acf51b8a01a7e9a0c45fe1f980a5d1814b23`

```markdown
# Calciomercato Solo Admin toggle V327

Data: 04/06/2026

## Obiettivo

Correggere in modo mirato il pannello Solo Admin della sezione Calciomercato senza impattare feed, archivio statico, filtri o altre sezioni del sito.

## Modifiche

- Rimosso il testo non destinato alla UI dal label del pannello: resta soltanto `Solo Admin`.
- Il pulsante `Espandi`/`Riduci` aggiorna direttamente stato, attributo `aria-expanded`, testo del bottone, classe della card e attributo `hidden` del body.
- Aggiunta una regola CSS dedicata per garantire che il body del pannello rimanga realmente nascosto quando ridotto.

## Funzionalita preservate

- Feed RSS automatico tramite Netlify Function.
- Archivio statico giornaliero e manifest V323/V324.
- Download JSON giorno/intervallo Solo Admin.
- Diagnostica archivio Calciomercato.
- Ricerca e filtri Calciomercato.
- Fallback immagine fonte per articoli senza anteprima.
- Mobile menu, Listone, Fantamercato interno, Rose, Dashboard Presidente, Admin, Firebase/Auth/EmailJS.

## File modificati

- `assets/app.js`
- `assets/css/refactor/calciomercato.css`
- `index.html`, `competition.html`, `player.html` per cache-buster/footer V327.

## Diagnostica runtime

- `window.ZonaOrientaleCalciomercatoAdminToggleV327`
```

---

## 10. `email/EMAIL_DELIVERABILITY_EMAILJS_V266.md`

- Percorso originale: `email/EMAIL_DELIVERABILITY_EMAILJS_V266.md`
- Dimensione originale: 3341 byte
- SHA-256: `0b0158a5ea2497ab15ac62532440fc85acddefd175a835ba21888f2340f7dc6e`

````markdown
# Email deliverability EmailJS - V266

## Obiettivo

Ridurre la probabilita' che le email operative del gestionale finiscano in spam. I flussi interessati sono:

- Dashboard Presidente -> Comunicato avvenuto scambio;
- Dashboard Presidente -> Svincola Giocatori.

## Modifiche codice V266

Il codice passa a EmailJS parametri piu' coerenti e riconoscibili:

- `from_name`: `Lega ZonaOrientale Salerno`;
- `sender_name`: `Lega ZonaOrientale Salerno`;
- `app_name` / `league_name`: `Lega ZonaOrientale Salerno`;
- `reply_to`: email dell'utente loggato quando disponibile;
- oggetti email piu' sobri;
- firma finale standard del gestionale.

Questi parametri non bastano da soli: il template EmailJS deve usarli e il servizio email collegato deve essere autenticato lato dominio.

## Configurazione consigliata in EmailJS

1. Aprire EmailJS Dashboard.
2. Andare in **Email Services**.
3. Per produzione preferire un provider transazionale, ad esempio SendGrid, Mailgun, Brevo, Postmark o Amazon SES.
4. Evitare, se possibile, un account Gmail/Yahoo personale come mittente operativo stabile.
5. Aprire il servizio collegato e verificare che l'invio di test arrivi correttamente.
6. Aprire **Email Templates** e il template usato dal sito.
7. Impostare i campi in questo modo, se disponibili nel template:
   - **To Email**: `{{to_email}}`;
   - **From Name**: `{{from_name}}` oppure `{{app_name}}`;
   - **From Email**: usare l'indirizzo predefinito/autenticato del servizio email, non l'email del presidente;
   - **Reply-To**: `{{reply_to}}`;
   - **Subject**: `{{subject}}`;
   - **Content/Message**: `{{message}}`.
8. Salvare e usare **Test It** su EmailJS.

## DNS: SPF, DKIM, DMARC

La configurazione DNS non si fa genericamente in EmailJS: si fa nel DNS del dominio mittente usando i record forniti dal provider email collegato a EmailJS.

Passaggi generici:

1. Scegliere il dominio o sottodominio mittente, per esempio `mail.silviobarra.com` o `lega.silviobarra.com`.
2. Nel provider transazionale collegato a EmailJS, aprire la sezione **Domain authentication / Sender authentication**.
3. Aggiungere il dominio mittente.
4. Copiare i record DNS richiesti dal provider. Normalmente sono:
   - TXT SPF;
   - CNAME/TXT DKIM;
   - TXT DMARC.
5. Inserire i record nel pannello DNS del dominio.
6. Tornare nel provider e premere **Verify**.
7. Dopo la verifica, usare quell'indirizzo/dominio come mittente tecnico del template EmailJS.

Esempio DMARC iniziale prudente:

```text
_dmarc.example.com TXT v=DMARC1; p=none; rua=mailto:dmarc@example.com; adkim=s; aspf=s
```

Dopo alcune settimane di controllo si puo' valutare `p=quarantine` o `p=reject`, ma non partire direttamente con policy aggressive se non si conosce tutto il traffico email del dominio.

## Test dopo V266

- Inviare un comunicato avvenuto scambio.
- Inviare una informativa svincolo giocatori.
- Verificare se la mail arriva in inbox o spam.
- Aprire gli header della mail ricevuta e controllare SPF/DKIM/DMARC.
- Controllare in console: `window.ZonaOrientaleEmailJsDeliverabilityV266`.

## Nota

Se si usa ancora un servizio personale in EmailJS, la deliverability puo' restare variabile. La soluzione piu' robusta e' collegare EmailJS a un provider transazionale autenticato oppure, in futuro, spostare l'invio su Netlify Function server-side con provider dedicato.
````

---

## 11. `OPERATIVITA_ADMIN_E_RELEASE.md`

- Percorso originale: `OPERATIVITA_ADMIN_E_RELEASE.md`
- Dimensione originale: 20849 byte
- SHA-256: `181a30b28a708d43128588b566a19f66e9aa056ee62846b3d1fa41612936faaa`

````markdown
## Nota operativa V275

Prima di merge o deploy verificare anche `FUNZIONALITA'V271-274.md` e i documenti in `docs/zonaorientale/listoni/`, soprattutto dopo modifiche a convertitore, ricerca storica o colonna `Modifica`.

## Nota operativa V273 - Test listone reale

Per verificare il listone: Admin -> Converti listone Excel -> caricare il file Classic reale -> controllare che il report indichi 663 giocatori e formato `Lista calciatori`. Dopo conversione verificare Listone pubblico con colonna `Modifica`.

# Aggiornamento V272 - Merge master e ritorno branch

La procedura Git aggiornata per fondere `refactor/260528-zonaorientale-next` su `master` e poi tornare al branch e' in `release/PUSH_MASTER_E_RITORNO_BRANCH_V272.md`. Ricordare che le Firebase Rules V257 non vengono pubblicate automaticamente da Netlify/GitHub.

# Aggiornamento V266 - Email deliverability EmailJS

V266 rende piu' pulite e coerenti le mail operative inviate via EmailJS: aggiunge parametri comuni di mittente logico (`Lega ZonaOrientale Salerno`), Reply-To dell'utente loggato quando disponibile, oggetti piu' sobri e firma standard del gestionale. I flussi aggiornati sono: comunicato avvenuto scambio e informativa svincolo giocatori. Non modifica `FUNZIONALITA'.md`. Diagnostica: `window.ZonaOrientaleEmailJsDeliverabilityV266`.

# Aggiornamento V265 - Pulizia asset sicuri

V265 e' una pulizia fisica controllata: rimuove dai comandi di release i duplicati/inutilizzati sicuri gia' identificati nell'audit, mantiene come canonico il simulatore trattative `assets/js/dev/trade-notification-simulator-v255.js` e aggiunge/rafforza `.gitignore` per impedire il ritorno di file macOS. Non modifica `FUNZIONALITA'.md` e non cambia comportamento runtime. Diagnostica: `window.ZonaOrientaleCleanupV265`.

# Aggiornamento V263 - Funzionalita V256-262

V263 aggiunge `FUNZIONALITA'V256-262.md`, registro incrementale delle funzionalita introdotte o consolidate tra V256 e V262. Non modifica `FUNZIONALITA'.md` e non cambia il comportamento runtime. Diagnostica: `window.ZonaOrientaleFeaturesDocV263`.

# Aggiornamento V262 - Audit pulizia codice

V262 aggiunge `AUDIT_CODICE_260528_V262.md` e una `.gitignore` locale in `static/zonaorientale/`. Non cambia funzionalita': fotografa file duplicati/non importati, file macOS e candidati a pulizia controllata. Diagnostica runtime: `window.ZonaOrientaleAuditV262`.

## Nota operativa V261 - Svincola Giocatori

Per testare la nuova informativa presidente: login presidente -> Dashboard Presidente -> Svincola Giocatori -> selezionare uno o piu giocatori -> verificare preview corpo email -> Invio informativa. Il flusso usa EmailJS e non crea richieste Admin/Firebase. Verificare che l'oggetto rispetti `<Nome Squadra> - Svincolo giocatori - <Data odierna>` e che il corpo riporti il listone da cui sono state recuperate le quotazioni.

## Nota operativa V257 - Deploy Firebase Rules per notifiche trattative

Per sincronizzare la lettura degli esiti trattative tra smartphone e desktop, deployare le rules V257 da `docs/zonaorientale/firebase/FIREBASE_RULES_ZONAORIENTALE_FULL_V257.rules` oppure applicare la patch `FIREBASE_RULES_PATCH_V257_TRANSFER_NOTIFICATIONS.rules` alla configurazione Firestore esistente. Dopo il deploy, testare da presidente: ricezione esito, apertura card in `Dashboard Presidente -> Trattative`, refresh su secondo dispositivo. Se non compare piu il warning `Lettura esito trattativa salvata solo localmente`, la lettura e' persistita in Firebase.

## Nota operativa V256 - Funzionalita V240-255

Usare `FUNZIONALITA'V240-255.md` come riepilogo incrementale delle modifiche funzionali del branch refactor V240-V255. Non sostituisce `FUNZIONALITA'.md`.

## Nota operativa V255 - Comandi trattative ricorrenti

Per test ricorrenti delle notifiche trattative usare `ZonaOrientaleTradeSimulatorV255.help()` e, per un ciclo locale completo, `await ZonaOrientaleTradeSimulatorV255.runLocalSmokeTest()`. Le funzioni locali non scrivono in Firebase; `createFirebaseSentProposal({ confirm: true })` scrive davvero e va usata solo per test end-to-end.

# Operativita Admin e release


## Nota operativa V254 - Test notifiche trattative

Per testare rapidamente le notifiche da console browser, accedere come presidente e usare `window.ZonaOrientaleTradeSimulatorV254`. Le funzioni `simulateIncomingProposal()` e `simulateResolvedSentProposal()` sono locali e non persistono; `createFirebaseSentProposal({ confirm: true })` scrive invece in Firebase e va usata solo per test reali.

Stato: V254.

## Regola d'oro dati

Firebase e' area di lavoro / live / fallback. I JSON statici sono la fonte pubblica prioritaria dopo refresh/logout quando esistono.

Quindi: se un dato esiste anche nei JSON statici, non basta modificarlo in Firebase.

Flusso generale:

```text
1. Modifica da Admin
2. Aggiorna snapshot Firebase
3. Scarica JSON/static overlay aggiornati
4. Applica nella repo
5. Commit + push
6. Test online o locale
```

`Aggiorna tutto` aggiorna Firebase/snapshot, non fa commit su GitHub.

## Caso A - Squadre, risultati, classifiche o competizioni

Quando modifichi dati stagione, classifiche, risultati, competizioni o nomi squadra:

```text
1. Admin -> Carica dati amministrazione
2. Modifica il dato
3. Admin -> Snapshot pubblici -> Aggiorna tutto
4. Scarica overlay snapshot stagioni
5. Se il dato compare anche in Albo/Palmares/FIFA, scarica anche honor.json
6. Applica overlay nella repo
7. Commit + push
```

Comandi tipici:

```bash
unzip ~/Downloads/NOME_OVERLAY_SNAPSHOT_STAGIONI.zip -d .
cp ~/Downloads/honor.json static/zonaorientale/assets/snapshots/honor.json

git status
git add -f static/zonaorientale/assets/snapshots/seasons/manifest.json
git add -f static/zonaorientale/assets/snapshots/seasons/*.json
git add -f static/zonaorientale/assets/snapshots/honor.json
git commit -m "Update static public snapshots"
git push
```

Se non hai modificato Albo/Palmares/FIFA, `honor.json` puo non servire.

## Caso B - Albo, Palmares o FIFA Ranking

```text
1. Admin -> Carica dati amministrazione
2. Modifica Albo/Palmares/FIFA
3. Admin -> Snapshot pubblici -> Aggiorna tutto
4. Scarica honor JSON
5. Sostituisci static/zonaorientale/assets/snapshots/honor.json
6. Commit + push
```

Comandi:

```bash
cp ~/Downloads/honor.json static/zonaorientale/assets/snapshots/honor.json

git status
git add -f static/zonaorientale/assets/snapshots/honor.json
git commit -m "Update static honor snapshot"
git push
```

## Caso C - Rose da Excel

Flusso corretto:

```text
1. Admin -> Rose e Movimenti FM
2. Converti rose e scarica overlay
3. Applica overlay nella repo
4. Commit + push dei JSON rose
5. Admin -> Rose e Movimenti FM -> Inizializza rose dal file statico
6. Admin -> Snapshot pubblici -> Aggiorna tutto
7. Scarica overlay snapshot stagioni
8. Commit + push snapshot stagioni
```

Comandi overlay rose:

```bash
unzip ~/Downloads/NOME_OVERLAY_ROSE.zip -d .

git status
git add -f static/zonaorientale/assets/rose/manifest.json
git add -f static/zonaorientale/assets/rose/*.json
git commit -m "Update static rosters"
git push
```

Poi dopo reinizializzazione e snapshot:

```bash
unzip ~/Downloads/NOME_OVERLAY_SNAPSHOT_STAGIONI.zip -d .

git add -f static/zonaorientale/assets/snapshots/seasons/manifest.json
git add -f static/zonaorientale/assets/snapshots/seasons/*.json
git commit -m "Update season snapshots after roster import"
git push
```

## Caso D - Listone da Excel

```text
1. Admin -> Converti listone Excel
2. Scarica overlay/listone JSON
3. Applica overlay nella repo
4. Commit + push
```

Percorsi:

```text
static/zonaorientale/assets/listoni/manifest.json
static/zonaorientale/assets/listoni/<file>.json
```

Comandi:

```bash
unzip ~/Downloads/NOME_OVERLAY_LISTONE.zip -d .

git add -f static/zonaorientale/assets/listoni/manifest.json
git add -f static/zonaorientale/assets/listoni/*.json
git commit -m "Update static listone"
git push
```

## Caso E - Stagione corrente o elenco stagioni

Aggiornare:

```text
static/zonaorientale/assets/public/config.json
```

Comandi:

```bash
cp ~/Downloads/config.json static/zonaorientale/assets/public/config.json

git status
git add -f static/zonaorientale/assets/public/config.json
git commit -m "Update public config"
git push
```

## Overlay codice/UI

Quando si modifica codice o UI:

1. Aggiornare footer `Version` in `index.html` e, se coinvolte, `competition.html`, `player.html`, `news.html`.
2. Aggiornare cache-buster `?v=XXX` negli HTML.
3. Se si modifica un modulo importato da `app.js`, aggiornare anche il query param nello static import.
4. Aggiornare `AI_HANDOFF_ZONAORIENTALE_CURRENT.md` e `CHANGELOG_CONSOLIDATO.md`.
5. Consegnare zip unico con solo file modificati:

```text
zonaorientale/...
docs/...
```

## Test sintattici

Da `static/zonaorientale`:

```bash
find assets -name '*.js' -type f -print0 | xargs -0 -n1 node --check
find assets -name '*.json' -type f -print0 | xargs -0 -n1 jq empty
```

Fallback senza `jq`:

```bash
find assets -name '*.json' -type f -print0 | xargs -0 -n1 python3 -m json.tool >/dev/null
```

## Test locale

Se sei in `static/zonaorientale`:

```bash
cd ..
python3 -m http.server 1313 --bind 0.0.0.0
```

Aprire:

```text
http://localhost:1313/zonaorientale/
```

## Checklist manuale rapida

Desktop:

```text
- Home/dashboard
- Albo d'Oro
- Competizioni
- Pagina singola competizione
- Archivio
- Statistiche
- Confronta
- Admin se disponibile
```

Mobile:

```text
- Bottom menu solo smartphone
- Pulsante Su solo dopo scroll
- Classifiche campionato con scroll orizzontale
- Nessuno sforamento laterale evidente
```

## Comandi Git standard per consegna codice

Esempio:

```bash
git status
git add static/zonaorientale/index.html \
  static/zonaorientale/assets/app.js \
  docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_CURRENT.md \
  docs/zonaorientale/CHANGELOG_CONSOLIDATO.md
git commit -m "fix: descrizione coerente"
```

## Comandi Git per applicare questa riorganizzazione docs

Questa riorganizzazione sostituisce molti vecchi file con pochi documenti canonici. Per eliminare davvero i vecchi docs dalla repo, usare `git rm` come indicato nella risposta di consegna della patch.

## Nota V224 statistiche storiche

Se in Albo una competizione risulta `NON_DISPUTATA`, quella cella non deve essere conteggiata come titolo ne' comparire tra i club piu vincenti.

La sottosezione `Presidenti piu vincenti` dipende dagli snapshot stagione statici per recuperare `seasonTeams.presidenteIds` e `presidents` storici. Dopo modifiche storiche ad Albo, squadre stagionali o presidenti, rigenerare e pubblicare sia:

```text
honor.json
snapshot stagioni statici
```



## Nota V225 stabilizzazione

Dopo i refactor V220-V224, il sito espone in console/browser:

```js
window.ZonaOrientaleRefactorStatus
```

Il campo `ok` deve essere `true`. Se `ok` e' `false`, leggere `checks` per capire quale modulo refactor non risulta disponibile. Questo controllo non sostituisce i test manuali, ma aiuta a intercettare subito regressioni da cache o helper mancanti.

## Nota V226 statistiche storiche

Dopo deploy V226 o successivi verificare in `#stats`:

- `Club più vincenti`: nomi club visibili, non solo trattini;
- `Podi Campionato`: nomi club visibili, non solo trattini;
- `Ultimi titoli assegnati`: nomi storici visibili per piu stagioni;
- `Top FIFA Ranking`: nessuna nota generica `FIFA Ranking` ripetuta vicino alle squadre.

Se ricompaiono trattini, controllare che `assets/snapshots/honor.json` sia pubblicato e che venga normalizzato come `snapshot.honorRows`.

## Nota V227 Archivio FM

Dopo deploy V227 verificare in `#archive` / Archivio stagioni, selezionando almeno la stagione corrente 2025-2026:

- nelle card `Squadre della stagione`, il campo `Saldo` deve mostrare i crediti residui reali quando presenti negli snapshot rose o nei movimenti FM;
- squadre con saldo reale zero possono mostrare `0 FM`;
- stagioni prive di dati FM devono mostrare `-`, non un falso `0 FM` generalizzato.


## Caso E - Nuovo comunicato e anteprima WhatsApp

Da V231 non serve piu' generare e committare file HTML per ogni comunicato.

Flusso corretto:

1. Pubblica il comunicato da Admin.
2. Dopo il salvataggio, usa `Copia link WhatsApp` sul comunicato.
3. Il link avra' forma:

```text
https://silviobarra.com/zonaorientale/share/news/<id-comunicato>?v=<id-comunicato>
```

4. Netlify instrada il path alla funzione `netlify/functions/news-share.js`.
5. La funzione legge il comunicato da Firebase/Firestore e restituisce i meta Open Graph corretti.
6. Il browser viene poi reindirizzato alla webapp su `/#news-<id-comunicato>`.

Non fare piu' il vecchio flusso V228/V230 con `node tools/generate-news-share-pages.mjs`, salvo manutenzione legacy.

Se WhatsApp mostra ancora una preview vecchia, prova a condividere il link con il parametro `?v=<id>` appena copiato dal sito.

## Nota V230 - Verifica link WhatsApp comunicati

Dopo il deploy di un comunicato, il link copiato deve avere forma:

```text
https://silviobarra.com/zonaorientale/comunicati/<slug>.html?v=<id>
```

Non deve contenere `www`. Se si apre `Apri preview`, la pagina deve esistere e poi reindirizzare alla webapp tramite hash `#news-...`.

## Test manuale specifico V229

Dopo deploy o test locale:

```text
1. Login con account presidente approvato.
2. Verificare che nel header non compaia piu `Account`.
3. Verificare che compaia logo squadra + `Pres. Cognome`.
4. Cliccare il pulsante e verificare apertura Dashboard Presidente.
5. Logout e verificare ritorno del pulsante `Accedi / Registrati`.
6. Login admin e verificare che la navigazione Admin non cambi.
```


Nota V241: il flusso Accetta utenti conserva i rifiuti come `REJECTED` e filtra i duplicati di utenti gia approvati, evitando ricomparse non volute in Admin.


Nota V243: per i comunicati di avvenuto scambio il presidente non scrive direttamente in `news`; crea una richiesta `TRANSFER_NEWS`, manda EmailJS alla lega e l Admin pubblica approvando la richiesta.

Nota V245: dopo aver approvato o rifiutato un comunicato in Admin -> Richieste presidenti, compare `Elimina da Firebase`. Usarlo solo quando si vuole rimuovere definitivamente il documento `teamRequests` approvato/rifiutato; se il comunicato approvato e' gia' in News, la news pubblicata non viene rimossa.


## Nota V246

Le notifiche degli esiti trattative sono sincronizzate su Firebase quando possibile. Per testare:

```text
1. Presidente A invia proposta a Presidente B
2. Presidente B approva/rifiuta
3. Presidente A vede badge esito
4. Presidente A apre Dashboard Presidente -> Trattative -> card proposta
5. Il badge sparisce anche dopo refresh o da altro dispositivo, se le rules permettono l'update su transferNegotiations
```

Se le rules negano l'update di lettura, il sito usa ancora `localStorage` come fallback locale e in console puo' apparire il warning `Lettura esito trattativa salvata solo localmente`.


## Nota V247

Prima di fondere un branch su `master`, usare `REGRESSION_TESTS.md` come checklist minima. La checklist include test pubblico, presidente, admin, mobile, notifiche trattative, comunicati e controlli tecnici pre-commit.

## Nota V248

Prima del merge verificare che `window.ZonaOrientaleLegacyCleanupV248.legacyTransferCommunicationArtifacts` sia `0` dopo apertura Dashboard Presidente. Il documento `FUNZIONALITA'.md` resta invariato.


### Richieste presidenti V249

Nel pannello `Admin -> Richieste presidenti` usare `Aggiorna richieste` per rileggere `teamRequests` da Firebase quando una richiesta appena inviata non compare. I comunicati in stato approvato o rifiutato possono essere eliminati dal registro Firebase con `Elimina da Firebase`; questa azione non cancella una news gia' pubblicata.


### Generatore comunicati automatici V250

Percorso:

```text
Admin -> Generatore comunicati automatici
```

Il pannello prepara bozze locali partendo dai dati gia' caricati: risultati, vincitori competizione, mercato, focus squadra, Albo/Palmares e aggiornamenti dati pubblici. Non pubblica direttamente e non scrive su Firebase.

Flusso consigliato:

```text
1. Apri Admin.
2. Scegli tipo comunicato, stagione, eventuale competizione/squadra e tono.
3. Premi Genera bozza.
4. Usa Copia testo oppure Inserisci nei Comunicati.
5. Nel form Admin -> Comunicati controlla titolo/testo/topic.
6. Salva manualmente il comunicato.
7. Se necessario, aggiorna snapshot/statici e fai commit.
```

Diagnostica in console:

```js
window.ZonaOrientaleCommunicationGeneratorV250
```

## Workflow pubblicazione Admin V251

In Admin sono nuovamente disponibili i pannelli:

```text
Stato Firebase / JSON
Procedura guidata Pubblica aggiornamenti
```

Uso consigliato dopo modifiche Admin:

1. premere `Aggiorna stato pubblicazione`;
2. controllare eventuali semafori gialli/rossi;
3. usare `Procedura guidata Pubblica aggiornamenti`;
4. copiare la checklist o i comandi Git;
5. scaricare/applicare i JSON statici necessari;
6. fare commit/push secondo il branch di lavoro.

Il pannello e' solo operativo: non pubblica su GitHub, non apre PR e non scrive su Firebase.
## Cleanup repository V252

Per applicare completamente la V252, dopo l'overlay eseguire anche le rimozioni Git dei file locali/legacy indicati nella consegna:

```bash
git rm -r --ignore-unmatch static/zonaorientale/.DS_Store \
  static/zonaorientale/assets/.DS_Store \
  static/zonaorientale/assets/css/.DS_Store \
  static/zonaorientale/assets/js/.DS_Store \
  static/zonaorientale/assets/snapshots/.DS_Store \
  static/zonaorientale/assets/css/mobile-hotfix-v166.css \
  static/zonaorientale/assets/css/mobile-hotfix-v167.css \
  __MACOSX static/zonaorientale/__MACOSX

find static/zonaorientale -name ".DS_Store" -delete
rm -rf __MACOSX static/zonaorientale/__MACOSX
```

La rimozione dei CSS hotfix e' sicura perche il loro contenuto e' gia presente in `assets/css/mobile-suite-v168.css` e gli HTML non li linkano.



## Nota operativa V253 - Richieste presidenti modulari

Il pannello `Admin -> Richieste presidenti` e' installato dal modulo `assets/js/admin/team-requests-panel-v253.js`. In caso di regressione, il codice inline V249 resta come fallback nel bundle principale, ma il render atteso deve usare attributi V253 e la diagnostica `window.ZonaOrientaleTeamRequestsV253`. Prima del merge testare refresh, approvazione, rifiuto ed eliminazione da Firebase dei comunicati approvati/rifiutati.

## Verifica release V267

Dopo applicazione overlay, controllare:

```text
Footer: V267 audit competizioni
Console: window.ZonaOrientaleCompetitionsAuditV267
Competizioni pubbliche visibili
competition.html raggiungibile
Admin -> Competizioni apribile
```

La V267 non richiede deploy Firebase Rules.


## Verifica release V268

Controllare in Admin -> Converti listone Excel:

```text
1. caricare un vecchio Excel con fogli Tutti/Ceduti;
2. verificare che i giocatori siano > 0;
3. caricare un Excel Classic con foglio Lista calciatori;
4. verificare che i giocatori siano > 0;
5. verificare nel report formato riconosciuto e fogli usati;
6. controllare console: window.ZonaOrientaleListoneConverterV268.
```

La V268 non richiede deploy Firebase Rules.


## V269 - Storico e confronto listoni

- Aggiunto confronto automatico tra listone selezionato e listone precedente della stessa stagione.
- Il convertitore listone arricchisce il JSON generato con campi `previous`, `diff`, `previousQuotationCurrent`, `quotationDiffFromPrevious`, `statusChange` e riepilogo `history`.
- La sezione pubblica `Listone` mostra un pannello `Storico listoni` con nuovi, usciti, variazioni quotazione e ricerca negli altri listoni.
- Il campo ricerca puo' trovare giocatori presenti in listoni passati anche quando non sono nel listone selezionato.
- Diagnostica: `window.ZonaOrientaleListoneHistoryV269`.
- Non sono state rimosse funzionalita' esistenti; il formato storico Tutti/Ceduti e il formato Classic a foglio singolo restano supportati.

## Nota V271

Prima di pubblicare su master, verificare la checklist listone V268-V270 e il documento `FUNZIONALITA'V263-270.md`.


## V274 - Codici squadra canonici nel Listone

Il convertitore listone accetta sia sigle sia nomi estesi per la squadra reale, ma salva/visualizza la sigla canonica a 3 lettere. Questo evita falsi cambi squadra nei confronti storici e rende stabile la colonna `Modifica`.

## Controlli operativi V276-V277

Prima del deploy verificare:

1. Admin -> Diagnostica dati.
2. Listone -> filtro Modifiche.
3. Listone -> Campi visibili -> colonna Modifica.
4. Footer/versione V277.

## V278 - Export modifiche listone

Aggiunto export CSV non distruttivo delle modifiche del Listone. Il pulsante `Esporta modifiche CSV` rispetta il filtro `Modifiche` e include nuove righe, usciti storici, variazioni quotazione/stato/squadra/ruolo. Documento tecnico: `docs/zonaorientale/listoni/LISTONE_EXPORT_MODIFICHE_V278.md`.
````

---

## 12. `refactor/ADMIN_PUBLICATION_WORKFLOW_AUDIT_V351.md`

- Percorso originale: `refactor/ADMIN_PUBLICATION_WORKFLOW_AUDIT_V351.md`
- Dimensione originale: 803 byte
- SHA-256: `36dff3640610468e8cd6278c8859aadf63fa1a88346b57cb239caa05a815b984`

```markdown
# Refactor protetto V351 - Audit workflow pubblicazione Admin

La V351 verifica `assets/js/refactor/admin-publication-workflow-v213.js`.

## Risultato

Il modulo V213 non e importato dagli entrypoint correnti. Il workflow funzionante resta inline in `assets/app.js`.

Sono stati verificati i marker principali:

- `runPublicationStatusV190`
- `renderPublicationStatusPanelV190`
- `data-run-publication-status-v190`
- `runPublicAssetsPreflightV179`
- `data-run-public-preflight-v179`
- `readAdminPublicationRemindersV189`
- `data-clear-admin-publication-reminders-v189`

## Decisione

Non rimuovere ancora `admin-publication-workflow-v213.js`.

## Prossimo step suggerito

V352: audit/cleanup controllato dei file CSS `mobile-hotfix-v166.css` e `mobile-hotfix-v167.css`, dopo verifica mobile light/dark.
```

---

## 13. `refactor/CALCIOMERCATO_ARCHIVE_ADMIN_REFACTOR_V340.md`

- Percorso originale: `refactor/CALCIOMERCATO_ARCHIVE_ADMIN_REFACTOR_V340.md`
- Dimensione originale: 2406 byte
- SHA-256: `7714efaf7735ab28d8fb864f5275ed6813f7c980b056599ec0acb207e29b47dc`

````markdown
# Refactor V340 - Pannello Solo Admin / archivio Calciomercato

## Scopo

Estrarre la parte UI del pannello `Solo Admin` della sezione Calciomercato in un modulo dedicato, senza cambiare download, diagnostica, dati o permessi.

## Nuovo modulo

```text
assets/js/calciomercato/calciomercato-admin-v340.js
```

Factory esposta:

```js
createCalciomercatoArchiveAdminV340(deps)
```

Responsabilita:

- costruzione view model dal `calciomercatoStateV306`;
- rendering HTML del box Solo Admin;
- classe collapsed/expanded;
- aggiornamento diretto del DOM per il toggle;
- mantenimento degli ID storici.

## Cosa resta in app.js

Restano in `assets/app.js`:

- logica archivio V323/V324;
- recupero manifest e JSON giornalieri;
- deduplica articoli;
- build dei file giornalieri;
- build del manifest;
- download JSON;
- diagnostica archivio;
- wrapper `renderCalciomercatoArchiveAdminToolsV323()`;
- wrapper `setCalciomercatoArchiveAdminExpandedV327()`.

## Perche non e' stata estratta tutta la logica archivio

La parte archivio contiene molte dipendenze storiche e operative:

- range `Da/A`;
- feed automatico Netlify;
- merge live + statico;
- download admin;
- diagnostica V324;
- stato globale Calciomercato.

Per preservare le funzionalita, la V340 estrae solo la UI del pannello. L'estrazione della logica di download va fatta in una versione successiva e con test dedicati.

## Matching giocatore: disambiguazione maiuscole

La V340 introduce anche `calciomercato-players-v340.js`.

Motivo: alcuni giocatori hanno nomi che coincidono con parole comuni. Esempio: `Giovane` del Napoli puo essere confuso con `giovane` aggettivo.

Regola V340:

- alias a una sola parola e lunghi almeno 5 caratteri richiedono una occorrenza capitalizzata nel testo originale;
- la punteggiatura continua a essere ignorata;
- il matching resta conservativo.

## Rischi evitati

- Nessuna modifica a Netlify Function.
- Nessuna modifica a `links.json`.
- Nessuna modifica ad archivi JSON.
- Nessuna scrittura Firebase.
- Nessun cambio di ID DOM usato dai listener storici.
- Nessun cambio alla timeline modal V336.

## Verifiche minime

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/js/calciomercato/calciomercato-admin-v340.js
node --check static/zonaorientale/assets/js/calciomercato/calciomercato-players-v340.js
static/zonaorientale/tools/check-zonaorientale.sh
```
````

---

## 14. `refactor/CSS_LEGACY_CLEANUP_ADMIN_DIAGNOSTICS_V343.md`

- Percorso originale: `refactor/CSS_LEGACY_CLEANUP_ADMIN_DIAGNOSTICS_V343.md`
- Dimensione originale: 1450 byte
- SHA-256: `45562bd2c7b60e9aba8c66890c63732cfdd00f14fe8a92b1807329b64f8364f4`

````markdown
# V343 - Cleanup CSS legacy e Diagnostica Admin

## Scopo

La V343 chiude il ciclo aperto con l'audit V342 sui CSS refactor versionati vecchi e aggiunge feedback esplicito alla diagnostica Admin.

## CSS legacy

I file V291/V292 erano gia non importati dagli HTML attivi. La V343 li tratta come gruppo di pulizia isolato, mantenendo i CSS stabili V299/V333.

Candidati:

```text
assets/css/refactor/mobile-controls-v291.css
assets/css/refactor/rosters-tables-v291.css
assets/css/refactor/mobile-controls-v292.css
assets/css/refactor/rosters-tables-v292.css
assets/css/refactor/theme-light-suspended-v292.css
```

Tool:

```bash
static/zonaorientale/tools/cleanup-css-legacy-v343.sh
```

Il tool controlla che gli alias stabili esistano e blocca la pulizia se rileva riferimenti runtime inattesi.

## Diagnostica Admin

Il bottone `Aggiorna diagnostica` ora aggiorna un timestamp locale:

```text
Ultimo aggiornamento: dd/mm/yyyy, HH:mm:ss
```

Il fuso orario usato e `Europe/Rome`.

## Funzionalita a rischio e protezione

Area a rischio: Admin Diagnostica dati.
Protezione: il render V276 resta il punto centrale; V343 avvolge il rendering e intercetta il click con handler delegato in capture phase.

Area a rischio: CSS mobile/Listone/Rose.
Protezione: i CSS attivi non cambiano; la pulizia riguarda solo file non importati.

Area a rischio: tooling di verifica.
Protezione: `check-zonaorientale.sh` ora esegue dry-run cleanup e audit Admin V343.
````

---

## 15. `refactor/LISTONE_EXPORT_ADMIN_ONLY_V296.md`

- Percorso originale: `refactor/LISTONE_EXPORT_ADMIN_ONLY_V296.md`
- Dimensione originale: 2843 byte
- SHA-256: `ec4bca2a51bd4ae07556b1956626a2e1609dd15d1cee5c4696474c03c8b059bc`

````markdown
# V296 - Export modifiche Listone solo Admin

## Obiettivo

Rendere il pulsante `Esporta modifiche CSV` del Listone disponibile solo agli utenti Admin, senza rimuovere le logiche di confronto gia' usate da colonna `Modifica`, filtro `Modifiche`, usciti storici e calcolo CSV.

## Modifica applicata

- Aggiunta guardia runtime `canExportListoneChangesCsvV296()` basata su `state.isAdmin`.
- Il pulsante `#listoneExportChangesV278` viene creato solo se l'utente corrente e' Admin.
- Se il pulsante fosse gia' presente e l'utente non e' Admin, `syncListoneChangeExportButtonV296()` lo rimuove.
- `exportListoneChangesCsvV278()` blocca anche eventuali invocazioni dirette da console per utenti non Admin.
- La diagnostica runtime e' disponibile in `window.ZonaOrientaleListoneExportAdminOnlyV296`.

## Funzionalita' a rischio e preservazione

### Rischio: Listone pubblico

Possibile rischio: nascondendo un pulsante nella barra filtri, si poteva alterare il montaggio dei controlli Listone.

Preservazione:

- Non vengono modificati `renderListonePublic`, `getFilteredListonePlayers`, `getSelectedListone`, filtri ruolo/stato/Modifiche o colonna `Modifica`.
- Il pulsante export viene gestito come controllo opzionale Admin.

### Rischio: export CSV modifiche

Possibile rischio: bloccare anche l'Admin o alterare il contenuto del CSV.

Preservazione:

- `buildListoneChangeExportRowsV278()` e `buildListoneChangeExportCsvV278()` restano invariati.
- L'helper CSV V295 resta collegato a `csvEscapeV278`.
- Viene aggiunta solo una guardia di autorizzazione prima del download.

### Rischio: funzioni storiche Listone V269-V278

Possibile rischio: rimuovere accidentalmente storico, usciti o calcolo modifiche.

Preservazione:

- Nessuna funzione storica e' stata rimossa.
- Restano attivi: `Modifica`, filtro `Modifiche`, `Mostra usciti storici`, normalizzazione squadre e funzioni di calcolo diff.

## Test consigliati

### Utente pubblico/non Admin

1. Aprire `Listone`.
2. Verificare che `Esporta modifiche CSV` non compaia.
3. Verificare che `Modifiche` e `Mostra usciti storici` continuino a funzionare.
4. In console verificare:

```js
window.ZonaOrientaleListoneExportAdminOnlyV296.canExport()
window.ZonaOrientaleListoneExportAdminOnlyV296.getButton()
```

Risultato atteso: `false` e `null`.

### Admin

1. Accedere come Admin.
2. Aprire `Listone`.
3. Verificare che `Esporta modifiche CSV` compaia.
4. Usare filtro `Modifiche` e scaricare CSV.
5. Verificare che il file mantenga colonne e righe attese.

## File toccati

- `assets/app.js`
- `index.html`
- `competition.html`
- `player.html`
- `tools/check-zonaorientale.sh`
- documentazione operativa e handoff.

## Note

Questa modifica non tocca Firebase, EmailJS, dati JSON, CSS, Rose, Dashboard Presidente o funzioni Admin diverse dal riconoscimento `state.isAdmin` gia' esistente.
````

---

## 16. `release/RELEASE_V327_SOLO_ADMIN_CALCIOMERCATO.md`

- Percorso originale: `release/RELEASE_V327_SOLO_ADMIN_CALCIOMERCATO.md`
- Dimensione originale: 1258 byte
- SHA-256: `13969cf01982207a8ffb87086aad0b686b426bda9ac2a71341fa67a236f54ea7`

```markdown
# Release V327 - Fix Solo Admin Calciomercato

Data: 04/06/2026

## Sintesi

Release mirata per correggere il pannello Solo Admin della sezione Calciomercato. Nessuna modifica a Firestore, Netlify Functions, dati statici o regole Firebase.

## Modifiche incluse

1. Calciomercato Solo Admin: rimosso il testo non destinato alla UI dal label del pannello.
2. Calciomercato Solo Admin: il pulsante `Espandi`/`Riduci` apre e chiude realmente la sezione.
3. CSS Calciomercato: aggiunta protezione esplicita per il body nascosto del pannello.

## Funzionalita da verificare dopo deploy

- Aprire `#calciomercato` come admin.
- Verificare che il box mostri il label `Solo Admin`.
- Cliccare `Espandi` e verificare che compaiano azioni, diagnostica e stato archivio.
- Cliccare `Riduci` e verificare che la sezione si richiuda.

## Funzionalita preservate

- Calciomercato feed RSS, fallback statico, archivio giornaliero e download admin.
- Fallback immagine fonte per articoli senza anteprima.
- Filtri desktop compatti V326.
- Listone, mobile menu e rimozione toggle vista mobile/desktop V326.
- Fantamercato interno, Rose, Dashboard Presidente, Admin, Firebase/Auth/EmailJS.

## Versione

- Footer e cache-buster: V327.
- `DEPLOY_EXPECTED_VERSION_V181`: `327`.
```

---

## 17. `release/RELEASE_V340_ARCHIVE_ADMIN_PLAYER_MATCHING.md`

- Percorso originale: `release/RELEASE_V340_ARCHIVE_ADMIN_PLAYER_MATCHING.md`
- Dimensione originale: 1687 byte
- SHA-256: `41207792f1c4e2afc60465eb28c8f60154baca514de72916bf5a4f1d51a7f1fd`

````markdown
# Release V340 - Archivio Admin e matching giocatore

Data: 05/06/2026

## Tipo modifica

Refactor protetto + fix conservativo matching giocatore.

## File modificati principali

```text
static/zonaorientale/assets/app.js
static/zonaorientale/assets/js/calciomercato/calciomercato-admin-v340.js
static/zonaorientale/assets/js/calciomercato/calciomercato-players-v340.js
static/zonaorientale/tools/check-zonaorientale.sh
static/zonaorientale/index.html
static/zonaorientale/competition.html
static/zonaorientale/player.html
docs/zonaorientale/CHANGELOG_CONSOLIDATO.md
docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_CURRENT.md
docs/zonaorientale/FUNZIONALITAV340.md
docs/zonaorientale/handoff/HANDOFF_NUOVO_ASSISTENTE_V340.md
docs/zonaorientale/refactor/CALCIOMERCATO_ARCHIVE_ADMIN_REFACTOR_V340.md
```

## Dettagli

- Estratto il rendering del pannello `Solo Admin` Calciomercato in `calciomercato-admin-v340.js`.
- Il download JSON giorno/intervallo resta invariato.
- La diagnostica archivio V324 resta invariata.
- Il toggle Espandi/Riduci resta operativo e delega al modulo V340.
- Aggiornato matching giocatore a V340 con controllo maiuscole per alias singoli.
- Corretto il caso `Giovane` giocatore vs `giovane` aggettivo.
- Aggiornati cache-buster, footer e `DEPLOY_EXPECTED_VERSION_V181` a V340.

## Funzionalita preservate

- Calciomercato feed RSS/HTML.
- TMW squadra.
- Archivio statico.
- Download archivio Admin.
- Filtri Calciomercato V339.
- Renderer card V338.
- Fallback immagini V334.
- Timeline giocatore modal V336.
- Listone, Rose, Fantamercato interno, Dashboard Presidente, Admin, Firebase/Auth/EmailJS.

## Note

Non modificato `docs/zonaorientale/FUNZIONALITA'.md`.
````

---

## 18. `release/RELEASE_V343_CSS_LEGACY_ADMIN_DIAGNOSTICS.md`

- Percorso originale: `release/RELEASE_V343_CSS_LEGACY_ADMIN_DIAGNOSTICS.md`
- Dimensione originale: 1033 byte
- SHA-256: `c39fa363bb29ec472916f262655b3ce65f9643c27fa9b5730fe68e95007de344`

````markdown
# Release V343 - CSS legacy e Diagnostica Admin

Data: 05/06/2026

## Tipo

Refactor protetto + fix diagnostica UI Admin.

## Modifiche

- Aggiunto timestamp italiano al refresh di `Aggiorna diagnostica` nel pannello Admin.
- Aggiunta diagnostica runtime `window.ZonaOrientaleAdminDiagnosticsV343`.
- Aggiunto tool `audit-admin-functions-v343.mjs`.
- Aggiunto tool `cleanup-css-legacy-v343.sh` per dry-run/apply della pulizia CSS V291/V292.
- Aggiornati versioni e cache-buster a V343.

## Nessuna modifica a

- Firebase/Auth/EmailJS;
- Netlify Functions;
- `links.json`;
- archivi JSON Calciomercato;
- JSON Listone;
- card/filtri Calciomercato;
- Listone runtime;
- Rose;
- Dashboard Presidente;
- Fantamercato interno.

## Comandi test

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/tools/audit-admin-functions-v343.mjs
static/zonaorientale/tools/audit-admin-functions-v343.mjs
static/zonaorientale/tools/cleanup-css-legacy-v343.sh
static/zonaorientale/tools/check-zonaorientale.sh
```
````

---

## 19. `release/RELEASE_V351_ADMIN_PUBLICATION_WORKFLOW_AUDIT.md`

- Percorso originale: `release/RELEASE_V351_ADMIN_PUBLICATION_WORKFLOW_AUDIT.md`
- Dimensione originale: 840 byte
- SHA-256: `33bc5af982e0e8694528d42ecbb9d1711c76d2709fc33389b3a79f8f1494ce92`

```markdown
# Release V351 - Audit workflow pubblicazione Admin

## Tipo

Audit/refactor protetto.

## Cambiamenti

- Aggiunto audit tool `audit-admin-publication-workflow-v351.mjs`.
- Aggiunto marker runtime `ZonaOrientaleAdminPublicationWorkflowAuditV351`.
- Aggiornati footer/cache-buster/versione a V351.
- Aggiornata documentazione V351.

## Rimozioni

Nessuna.

## Test

- `node --check static/zonaorientale/assets/app.js`
- `node --check static/zonaorientale/tools/audit-admin-publication-workflow-v351.mjs`
- `static/zonaorientale/tools/audit-admin-publication-workflow-v351.mjs`
- `static/zonaorientale/tools/check-zonaorientale.sh`
- `static/zonaorientale/tools/audit-assets-v298.sh --quiet`
- `static/zonaorientale/tools/audit-css-v300.sh`

## Note

`admin-publication-workflow-v213.js` resta candidato review, ma non viene rimosso in V351.
```

---

## 20. `release/RELEASE_V368_DASHBOARD_PUBBLICAZIONE_ADMIN.md`

- Percorso originale: `release/RELEASE_V368_DASHBOARD_PUBBLICAZIONE_ADMIN.md`
- Dimensione originale: 1218 byte
- SHA-256: `306808b1889bb5899566f0d5943c37c6da702b9861b76cc03090bceb9118b000`

````markdown
# Release V368 - Dashboard pubblicazione Admin protetta

## Obiettivo

Rendere piu' sicuro il momento di pubblicazione aggiungendo un cruscotto Admin read-only che riassume i controlli gia' esistenti senza cambiare flussi o dati.

## Modifiche runtime

- Aggiornata versione runtime a V368.
- Aggiornati cache-buster e footer su `index.html`, `competition.html`, `player.html`.
- Aggiunto pannello Admin `Cruscotto pre-deploy`.
- Aggiunto marker `window.ZonaOrientaleAdminPublicationDashboardV368`.
- Reso lo smoke test V367 tollerante verso release successive.

## Garanzie no-regression

- Nessuna funzionalita' rimossa.
- Nessun file runtime cancellato.
- Nessuna scrittura Firebase aggiunta.
- Nessuna modifica a `docs/zonaorientale/FUNZIONALITA'.md`.
- Pannelli V189/V190/V191 preservati.
- V367 smoke test preservato.
- Trattative reali e simulazioni local-only non toccate.

## Verifiche

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/js/market/transfer-market.js
node static/zonaorientale/tools/audit-protected-regression-v367.mjs
node static/zonaorientale/tools/audit-publication-dashboard-v368.mjs
bash static/zonaorientale/tools/check-zonaorientale.sh
```
````

---

## 21. `test/PUBLICATION_DASHBOARD_ADMIN_V368.md`

- Percorso originale: `test/PUBLICATION_DASHBOARD_ADMIN_V368.md`
- Dimensione originale: 1119 byte
- SHA-256: `086e8937ff74f08584be82aa1d974acc9603016cda8e20b551617e909e1482e4`

````markdown
# Test V368 - Dashboard pubblicazione Admin

## Test automatici

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/js/market/transfer-market.js
node static/zonaorientale/tools/audit-publication-dashboard-v368.mjs
bash static/zonaorientale/tools/check-zonaorientale.sh
```

## Test manuale Admin

1. Aprire la home e verificare footer V368.
2. Login Admin.
3. Verificare che in alto compaia `Cruscotto pre-deploy`.
4. Premere `Aggiorna solo riepilogo`.
5. Premere `Aggiorna cruscotto + semafori`.
6. Verificare che Promemoria pubblicazione V189 resti presente.
7. Verificare che Stato Firebase/JSON V190 resti presente.
8. Verificare che Procedura guidata V191 resti presente.
9. Premere `Copia checklist`.
10. Da console eseguire:

```js
ZonaOrientaleAdminPublicationDashboardV368.runSmokeTest()
```

## Test no-regression consigliato

1. Login Admin.
2. Checklist QA Admin.
3. Simula proposta trattativa verso presidente.
4. Login presidente destinatario.
5. Accetta/Rifiuta.
6. Verifica che non torni `IN ATTESA`.
7. Apri una competizione.
8. Apri una scheda giocatore.
````

---

---

## Nota operativa V408

- Nessuna modifica ai pannelli admin, workflow di pubblicazione, email o permessi.
- Il controllo V408 riguarda solo la resa pubblica della tabella Rosa espansa e non altera azioni admin/presidente.

## Nota V419

- Nessuna modifica ad Admin, pubblicazioni, EmailJS, permessi o workflow operativi.
- Le modifiche V419 riguardano solo presentazione e render consultivo dell'Archivio Stagioni.

## Nota operativa V425

- L'area Admin eredita la scala mobile globale senza cambiare permessi, workflow, import Excel, pubblicazioni o notifiche.
- Le modifiche sono di presentazione e sono reversibili via CSS.

## V430 - Admin mobile

Nella view mobile Admin, i pulsanti Apri/Riduci dei pannelli e delle categorie sono posizionati sopra il titolo per evitare compressione e titoli spezzati lettera per lettera. Operativita Admin invariata.

## Nota V441 - Area Squadra presidenti

Nell Area Squadra i filtri ruolo standard/Mantra sono operativi sulle select di trattativa e sul pannello Svincola Giocatori. La modifica non cambia l invio richieste, le email o il flusso di approvazione admin.

---

## V455 - Fix selettore card Admin

La V455 sostituisce il selettore V454 con `admin-card-visibility-v455.js` e `admin-card-visibility-v455.css`.

Correzioni principali:

- default realmente vuoto: nessuna card Admin visibile se non selezionata;
- incluse le card dinamiche della pubblicazione dati;
- incluse le sezioni `details.admin-edit-section`;
- Checklist QA Admin nascosta di default e mostrabile solo da checkbox nel menu Admin;
- preferenze separate per slug lega tramite localStorage V455.

La modifica e solo di visibilita/interfaccia: non cambia Firebase, rules, salvataggi, snapshot, Area Squadra o dati pubblici.

## V456 - Hotfix click selettore card Admin

La V456 sostituisce il runtime V455 con `admin-card-visibility-v456.js` e `admin-card-visibility-v456.css`.

Correzioni:

- menu selettore sempre cliccabile, senza `details`/summary;
- pulsanti `Mostra tutte` e `Nascondi tutte` gestiti in capture phase;
- checkbox card e Checklist QA gestite con listener dedicati V456;
- Generatore comunicati automatici incluso tra le card selezionabili;
- card Pubblicazione dati e `details.admin-edit-section` ancora coperte;
- Checklist QA Admin nascosta di default e visibile solo dal checkbox del selettore.

Invarianti: nessuna modifica a Firebase, rules, salvataggi Admin, snapshot generator, Area Squadra, Bilanci mobile V438, badge dispositivo V434 o `FUNZIONALITA'.md`.
