## Aggiornamento V282 - Controlli pre-push

Versione corrente: V282 controlli pre-push. Leggere anche `release/CONTROLLI_PRE_PUSH_V282.md`. Prima di ogni commit/push usare `static/zonaorientale/tools/check-zonaorientale.sh`.

## Aggiornamento V275

Versione corrente: V275 funzionalita V271-274. Dopo i documenti V272 leggere anche `FUNZIONALITA'V271-274.md`, `listoni/LISTONE_TEST_REALE_V273.md` e `listoni/LISTONE_CODICI_SQUADRA_V274.md`.

# START HERE - ZonaOrientale V272

Questo file e' l'indice operativo aggiornato al ramo:

```text
refactor/260528-zonaorientale-next
```

Versione runtime attesa dopo l'overlay:

```text
V282 controlli pre-push
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
