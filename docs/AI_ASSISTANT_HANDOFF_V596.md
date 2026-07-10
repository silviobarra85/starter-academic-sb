# AI Assistant Handoff V596 - Sudatori: contrasto infortunati SOS Fanta

Versione: V596
Data: 2026-07-10

## Obiettivo

Correggere la leggibilità della sezione **Infortunati / SOS Fanta** dentro **Per i SUDATORI**: nella V595 le card avevano sfondo chiaro ma usavano variabili colore pensate per sfondo scuro, producendo testo chiaro su chiaro.

## Modifiche principali

- Portata la sezione `sudatori-injuries` sullo stesso stile scuro delle card **Trattative**.
- Resi più scuri/leggibili titoli, descrizioni, dettagli, note operative e link fonte.
- Aggiornati i badge `sudatori-physical` con colori ad alto contrasto su sfondo scuro.
- Nessuna modifica ai dati sportivi, agli infortunati, alle probabili formazioni o alle logiche di modulo della V595.
- Bump asset Sudatori a V596 per forzare cache busting su CSS/JS.

## File principali

- `static/fanta-engine/css/sudatori-section-v596.css`
- `static/fanta-engine/js/sections/sudatori-section-v596.js`
- `static/fanta-engine/data/sudatori/current/manifest.json`
- `static/fanta-engine/data/sudatori/current/sudatori-data.json`
- `static/fanta-engine/tools/audit-sudatori-section-v596.mjs`
- `docs/SUDATORI_SECTION_V596.md`

## Audit consigliati

```bash
node static/fanta-engine/tools/audit-sudatori-section-v596.mjs
node --check static/fanta-engine/js/sections/sudatori-section-v596.js
```

## Note isolamento

La sezione resta consultiva e standalone: legge solo dati statici Sudatori/Listone e non scrive su Firebase, non aggiorna `rosterEntries`, non modifica le rose ufficiali e non tocca il listone operativo.
