# Overlay V662 - Card mobile sito e fix workflow-safe

Overlay solo sito. Non tocca ioSudo, dati, rose, listoni o Sudatori.

Questa versione sostituisce V661 per l'applicazione via GitHub Action: non contiene `tools/`, quindi non sovrascrive lo script `tools/apply-overlay-from-zip.sh` mentre lo script stesso e in esecuzione.

## Contenuto

- Card mobile compatte e ordinate per Listone e Rose.
- Colori ruolo mantenuti: portieri gialli, difensori verdi, centrocampisti blu, attaccanti rossi.
- Filtri invariati.
- Caricamento progressivo con `Mostra altre voci`.
- Audit Sudatori V662 compatibile con sezione pubblica disattivata.

## Applicazione da smartphone

Caricare lo zip in:

```text
incoming/overlays/
```

La GitHub Action applichera `static/` e `docs/`.
