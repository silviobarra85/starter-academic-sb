# AI Assistant Handoff V595 - Sudatori: SOS Fanta e modulo formazione

Versione: V595
Data: 2026-07-10

## Obiettivo

Integrare nella sezione standalone **Per i SUDATORI** gli infortunati/monitorati da SOS Fanta e correggere la visualizzazione delle probabili formazioni affinché il campetto rispetti il modulo dichiarato della squadra.

## Modifiche principali

- Aggiunto `injuriesByTeam` in `static/fanta-engine/data/sudatori/current/sudatori-data.json`.
- Aggiunti campi SOS Fanta sui giocatori abbinati: stato fisico, entità, rientro, impatto asta, fonte e nota operativa.
- Aggiunti `sosFantaNews` e `sosFantaUpdateLog` per tracciare le news integrate.
- Rigenerate le probabili formazioni dal foglio `Probabili_Formazioni`.
- Il campetto ora usa `formationsByTeam` come fonte primaria e `formationLine/formationSlot` per rispettare il modulo dichiarato.
- Tracciamento di `moduleSourceUsed` e `moduleAdjusted` quando la fonte formazione partiva da un modulo diverso.
- Atalanta aggiornata: Kossounou al posto di Hien.
- Lazio aggiornata: Cancellieri al posto di Isaksen.

## File principali

- `static/fanta-engine/css/sudatori-section-v595.css`
- `static/fanta-engine/js/sections/sudatori-section-v595.js`
- `static/fanta-engine/data/sudatori/current/manifest.json`
- `static/fanta-engine/data/sudatori/current/sudatori-data.json`
- `static/fanta-engine/tools/audit-sudatori-section-v595.mjs`
- `docs/SUDATORI_SECTION_V595.md`

## Audit consigliati

```bash
node static/fanta-engine/tools/audit-sudatori-section-v595.mjs
node --check static/fanta-engine/js/sections/sudatori-section-v595.js
```

## Note isolamento

La sezione resta consultiva e standalone: legge solo dati statici Sudatori/Listone e non scrive su Firebase, non aggiorna `rosterEntries`, non modifica le rose ufficiali e non tocca il listone operativo.
