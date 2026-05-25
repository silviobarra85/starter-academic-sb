# Documentazione ZonaOrientale

Documentazione consolidata al 25/05/2026, stato codice sito **V224**.

Questa cartella sostituisce la vecchia struttura con molti `AI_HANDOFF_ZONAORIENTALE_Vxxx.md`, `REFACTOR_Vxxx.md`, release note e archivi storici sparsi. Da ora la documentazione operativa va mantenuta in pochi file canonici.

## File da leggere

1. `AI_HANDOFF_ZONAORIENTALE_CURRENT.md`  
   Handoff totale per il prossimo assistente AI. Contiene stato del progetto, regole operative, moduli attivi, rischi noti e test minimi.

2. `ARCHITETTURA_E_DATI.md`  
   Struttura tecnica del sito, file principali, moduli estratti, ordine di lettura JSON/Firebase e schema dati delle classifiche campionato.

3. `OPERATIVITA_ADMIN_E_RELEASE.md`  
   Flussi pratici per modifiche dati, snapshot, JSON statici, test, overlay, cache-buster, comandi locali e Git.

4. `CHANGELOG_CONSOLIDATO.md`  
   Riassunto cronologico delle versioni storiche e delle patch recenti fino a V224.

5. `ROADMAP.md`  
   Idee e priorita future, accorpate dal vecchio documento sulle nuove funzionalita.

6. `firebase/FIREBASE_RULES_ZONAORIENTALE_FULL_V124C.rules`  
   Regole Firestore storiche/consolidate. Non e' un handoff, ma resta qui come riferimento tecnico importante.

## Regola per i prossimi aggiornamenti docs

Non creare piu un file handoff/refactor per ogni micro-versione, salvo necessita reale. Aggiornare invece:

- `AI_HANDOFF_ZONAORIENTALE_CURRENT.md` per lo stato corrente;
- `CHANGELOG_CONSOLIDATO.md` per la storia sintetica;
- `ARCHITETTURA_E_DATI.md` se cambia il codice o il flusso dati;
- `OPERATIVITA_ADMIN_E_RELEASE.md` se cambia il modo di rilasciare o aggiornare dati.

## Regola per gli zip futuri

Quando si consegna una modifica al progetto, lo zip deve essere unico e contenere solo i file modificati, mantenendo le due cartelle principali:

```text
zonaorientale/
docs/
```

Per una modifica solo documentale, e' sufficiente includere solo `docs/zonaorientale/...`.
