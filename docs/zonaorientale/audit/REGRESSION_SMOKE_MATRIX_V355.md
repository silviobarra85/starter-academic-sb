# REGRESSION_SMOKE_MATRIX_V355

Versione: V355  
Scopo: matrice statica e manuale per verificare che il ciclo V333-V354 non abbia scollegato funzionalita.

## Audit automatico

Tool:

```bash
static/zonaorientale/tools/audit-regression-smoke-v355.mjs
```

Controlla:

- `DEPLOY_EXPECTED_VERSION_V181 = "355"`.
- cache-buster HTML/app V355.
- marker runtime `window.ZonaOrientaleRegressionSmokeSuiteV355`.
- preservazione marker V354.
- presenza moduli canonici Calciomercato/Listone/helper/trade.
- assenza file legacy rimossi in V343-V352.
- presenza documenti V355.

## Checklist manuale prioritaria

| Area | Test | Esito atteso |
| --- | --- | --- |
| Login presidente | Accedi con presidente approvato | Dashboard e dati squadra visibili |
| Login Admin | Accedi come admin | Area Admin visibile |
| Calciomercato | Apri sezione | Articoli caricati da feed/statico |
| Calciomercato filtri | Cerca, Da, A, squadra/fonte/topic | Lista filtrata senza errori console |
| Calciomercato player tag | Clic su tag giocatore | Modal timeline aperto e chiudibile |
| Calciomercato Solo Admin | Espandi/Riduci | Pannello si apre/chiude |
| Archivio Calciomercato | Diagnostica/download giorno | Nessun errore UI/console |
| Listone | Filtri e Modifiche | Risultati coerenti e stile uniforme |
| Listone Admin | Export modifiche CSV | CSV scaricabile |
| Rose | Apri rose squadra | Tabelle leggibili desktop/mobile |
| Fantamercato | Apri trattative | Stato coerente |
| Simulatore trade | `simulateIncomingProposal()` | Badge e card visibili |
| Simulatore trade | Clic Accetta/Rifiuta su simulazione | Nessun errore Firebase |
| Admin Diagnostica | Aggiorna diagnostica | Timestamp italiano aggiornato |
| Mobile | Bottom nav + Altro | Icone e link visibili |
| Competition | Apri dettaglio competizione | Pagina funzionante |
| Player | Apri scheda giocatore | Pagina funzionante |

## Comandi console utili

```js
window.ZonaOrientaleRegressionSmokeSuiteV355.runSmokeTest()
window.ZonaOrientaleRefactorConsolidationV354.runSmokeTest()
ZonaOrientaleTradeSimulatorV255.simulateIncomingProposal()
window.ZonaOrientaleTradeSimulatorLocalActionsV349.runSmokeTest()
```

## Decisione V355

Non procedere con nuove rimozioni fino a quando la checklist manuale non e stata verificata almeno su:

- desktop Chrome/Safari;
- mobile o responsive emulator;
- utente presidente;
- utente admin.

