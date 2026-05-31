## Aggiornamento V286 - Fix prima colonna mobile Light

Versione corrente: V286 fix prima colonna mobile. Leggere anche `audit/FIX_PRIMA_COLONNA_MOBILE_LIGHT_V286.md`. La release corregge il contrasto della prima colonna sticky in tema Light/mobile per Listone e tabelle rose, evitando il caso nome giocatore nero su sfondo scuro. Intervento solo CSS/UI, senza modifiche a Firebase, EmailJS, dati JSON o logiche runtime.

## Aggiornamento V285 - Fix mirati mobile

Versione corrente: V285 fix mirati mobile. Leggere anche `audit/FIX_MOBILE_MIRATI_V285.md`. La release applica correzioni CSS conservative per migliorare leggibilita' mobile in tema Light, tabelle scrollabili, prima colonna sticky, badge/pill/bottoni secondari e bottom navigation. Nessuna modifica funzionale a Firebase, EmailJS, dati JSON o logiche runtime.

## Aggiornamento V284 - Audit mobile completo

Versione corrente: V284 audit mobile completo. Leggere anche `audit/AUDIT_MOBILE_COMPLETO_V284.md`. La release introduce una checklist operativa per verificare mobile, tema Light/Dark, tabelle, form, Dashboard Presidente e Admin prima dei prossimi fix CSS. Nessuna modifica funzionale a Firebase, EmailJS o dati runtime.

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
V284 audit mobile completo
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
