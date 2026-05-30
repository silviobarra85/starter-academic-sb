# START HERE - ZonaOrientale V272

Questo file e' l'indice operativo aggiornato al ramo:

```text
refactor/260528-zonaorientale-next
```

Versione runtime attesa dopo l'overlay:

```text
V272 handoff e verifica pre-merge
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
