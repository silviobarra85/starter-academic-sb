# Documentazione ZonaOrientale

Cartella riordinata per ridurre il rumore dei molti `REFACTOR_VXXX.md` in root.

## File da leggere normalmente

1. `AI_HANDOFF_ZONAORIENTALE_CURRENT.md`  
   Stato del progetto e istruzioni per un futuro assistente AI.

2. `GUIDA_OPERATIVA_MODIFICHE_DATI.md`  
   Cosa fare quando pubblichi, modifichi o cancelli dati da Admin.

3. `LETTURE_JSON_SNAPSHOT_FIREBASE.md`  
   Ordine di lettura: JSON statici, snapshot Firebase, collection Firebase.

4. `changelog/CHANGELOG_REFACTOR_V127_V188.md`  
   Indice sintetico di tutte le versioni storiche.

5. `firebase/FIREBASE_RULES_ZONAORIENTALE_FULL_V124C.rules`  
   Regole Firestore storiche/consolidate.

## Archivio

- `archive/refactor/` contiene tutti i vecchi `REFACTOR_VXXX.md`.
- `archive/handoff_storici/` contiene gli handoff vecchi, superati dal file current.
- `archive/mobile/` contiene mockup e note mobile storiche.
- `archive/cleanup/` contiene note di cleanup storico.

## Regola pratica

La root della cartella deve restare leggibile. I nuovi documenti operativi dovrebbero essere pochi e chiari; i dettagli versione-per-versione vanno nel changelog o in `archive/refactor/`.
