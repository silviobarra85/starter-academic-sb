# V595 - Sudatori: infortunati SOS Fanta e moduli campetto vincolati

La sezione standalone **Per i SUDATORI** aggiunge gli infortunati/monitorati SOS Fanta e corregge la logica delle probabili formazioni grafiche.

## Origine dati

File Excel integrato:

```text
fantacalcio_serie_a_2026_27_sosfanta_infortunati_2026-07-10(1).xlsx
```

Fogli letti:

- `Infortunati_10_07`
- `SOSFanta_News_10_07`
- `Agg_10_07_SOS_Infortuni`
- `Probabili_Formazioni`

## Infortunati / SOS Fanta

Nel JSON Sudatori sono stati aggiunti:

```text
injuriesByTeam
sosFantaNews
sosFantaUpdateLog
```

Ogni giocatore abbinato alla rosa riceve campi dedicati:

```text
sosFantaFlag
physicalStatus
injuryDetail
injuryReturn
injuryImpact
injurySource
injuryNote
```

La UI mostra:

- KPI “Infortunati / SOS”;
- conteggio SOS fisico nelle card squadra;
- colonna “Stato fisico” nella tabella rosa;
- sezione “Infortunati / SOS Fanta” nella scheda squadra;
- dettaglio infortunio nella scheda giocatore.

## Probabili formazioni

La V595 rende il **modulo dichiarato** la forma vincolante del campetto.

Esempio: se il modulo della squadra è `4-3-3`, il campetto viene renderizzato come `4-3-3` e non come `4-3-2-1` o altro schema derivato dalla sola posizione originale.

Per ogni voce formazione vengono tracciati:

```text
moduleFile
moduleUsed
moduleSourceUsed
moduleAdjusted
formationLine
formationSlot
sourcePosition
```

Quando la fonte formazione usava uno schema diverso dal modulo dichiarato, il dato originale resta in `moduleSourceUsed`, mentre il campetto usa `moduleUsed`.

## Correzioni operative da SOS Fanta

- Atalanta: Kossounou entra nell XI al posto di Hien, fuori oltre tre mesi.
- Lazio: Cancellieri entra nell XI al posto di Isaksen, operato per pubalgia/sports hernia.
- Pulisic, Wesley e M. Thuram restano monitorati/con flag fisico.

## File principali

- `static/fanta-engine/css/sudatori-section-v595.css`
- `static/fanta-engine/js/sections/sudatori-section-v595.js`
- `static/fanta-engine/data/sudatori/current/manifest.json`
- `static/fanta-engine/data/sudatori/current/sudatori-data.json`
- `static/fanta-engine/tools/audit-sudatori-section-v595.mjs`

## Audit

```bash
node static/fanta-engine/tools/audit-sudatori-section-v595.mjs
node --check static/fanta-engine/js/sections/sudatori-section-v595.js
```

## Garanzie

La sezione resta standalone e non modifica Firebase, `rosterEntries`, Rose ufficiali, Listone operativo o Dashboard Presidente.
