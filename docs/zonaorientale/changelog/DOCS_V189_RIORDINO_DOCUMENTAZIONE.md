# DOCS V189 - Riordino documentazione

## Obiettivo

Ridurre il disordine nella cartella `docs/zonaorientale`, spostando i molti `REFACTOR_VXXX.md` in archivio e creando pochi punti di ingresso chiari.

## Nuova struttura

```text
docs/zonaorientale/
  README.md
  AI_HANDOFF_ZONAORIENTALE_CURRENT.md
  GUIDA_OPERATIVA_MODIFICHE_DATI.md
  LETTURE_JSON_SNAPSHOT_FIREBASE.md
  changelog/CHANGELOG_REFACTOR_V127_V188.md
  firebase/FIREBASE_RULES_ZONAORIENTALE_FULL_V124C.rules
  archive/refactor/REFACTOR_VXXX.md
  archive/handoff_storici/...
  archive/mobile/...
  archive/cleanup/...
```

## Nota

Non sono stati eliminati contenuti storici: sono stati spostati in `archive/`.
