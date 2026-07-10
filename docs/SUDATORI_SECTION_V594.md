# V594 - Sudatori: trattative in corso per squadra

La sezione **Per i SUDATORI** ora mostra, nella scheda di dettaglio di ogni squadra Serie A, un blocco **Trattative in corso**.

## Origine dati
I dati provengono dal foglio Excel:

- `Trattative_Squadre_10_07`

Campi letti:

- Squadra
- Scheda
- Obiettivo
- Ruolo breve
- Ruolo
- Provenienza/situazione
- Fonte
- Aggiornato al
- Affidabilità
- Nota

## Output dati
Le trattative vengono salvate in:

```text
static/fanta-engine/data/sudatori/current/sudatori-data.json
```

Campo:

```text
teamTransferTalksByTeam
```

Ogni squadra ha anche:

```text
transferTalksCount
transferTalksPreview
```

## Rendering
Il runtime V594 aggiunge:

- KPI “Trattative squadre”
- conteggio trattative nelle card squadra
- sezione “Trattative in corso” sotto rosa/campetto della squadra selezionata

## Garanzie
Non modifica:

- Firebase
- rosterEntries
- Rose ufficiali
- Listone operativo
- Dashboard Presidente
