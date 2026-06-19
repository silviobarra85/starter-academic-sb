# V474 - Regolamento FantaPetilloMantraManager 2026-2027 aggiornato

## Scope

Overlay dedicato solo a `FantaPetilloMantraManager`. Non modifica ZonaOrientale e non tocca Firebase, Admin, Area Squadra, snapshot, listoni, rose, bilanci o news.

## PDF ufficiale

Il nuovo documento caricato dall'utente e' `FANTACALCIO_MANTRA_2026_2027-2.pdf`.

Nel sito viene pubblicato come:

```text
static/fantapetillomantramanager/assets/regolamento/regolamento-fantapetillo-mantra-manager-2026-2027-v474.pdf
```

Il vecchio PDF non viene cancellato per non rompere eventuali link gia' condivisi; la pagina e la configurazione puntano pero' al PDF V474.

## Pagina Regolamento

File runtime aggiornato:

```text
static/fantapetillomantramanager/assets/js/sections/regolamento-section-v402.js
```

Aggiornamenti applicati:

- link `Scarica PDF` al PDF V474;
- link `Apri PDF` al PDF V474;
- link appendice al PDF V474;
- marker runtime `FantaPetilloRegolamentoSectionV474`;
- alias retrocompatibile `FantaPetilloRegolamentoSectionV453` mantenuto per non rompere eventuali riferimenti esistenti;
- sintesi montepremi in crediti allineata al nuovo PDF:
  - Premio Partecipazione: 40 FM;
  - Regular Season: 12, 10, 8, 7, 6, 5 FM secondo piazzamento;
  - Vincitore Playoff: 6 FM;
  - Vincitore Coppa Italia: 8 FM;
  - Vincitore Champions League: 9 FM;
  - Qualificazione Champions League: 3 FM;
  - Paracadute retrocessione 9 e 10 posto: 3 FM.

## Config

File aggiornato:

```text
static/fantapetillomantramanager/assets/league-config.json
```

Campi principali:

```json
{
  "currentVersion": "474",
  "regolamento": {
    "version": "474",
    "season": "2026-2027",
    "pdf": "./assets/regolamento/regolamento-fantapetillo-mantra-manager-2026-2027-v474.pdf",
    "sourceDocument": "FANTACALCIO_MANTRA_2026_2027-2.pdf"
  }
}
```

## Audit dedicato

```bash
cd static/fantapetillomantramanager
node tools/audit-regolamento-v474.mjs
```

Questo audit controlla PDF, link runtime, configurazione, cache-buster della home e valori principali del montepremi in crediti.
