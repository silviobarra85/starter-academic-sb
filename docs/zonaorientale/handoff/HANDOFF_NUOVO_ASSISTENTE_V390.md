# Handoff nuovo assistente - V390 Soccer Data static stats

## Stato

Base derivata dalla V389 public read-only. Soccer Data rimane aperta a tutti in sola lettura, con comandi amministrativi nascosti/protetti per non-admin.

## Modifica V390

- Aggiunto JSON statico summary per statistiche giocatore:
  - `assets/soccer-data/stats/player-stats-summary-2025-2026.v001.json`
- Aggiunto CSV template compilabile:
  - `assets/soccer-data/stats/player-stats-summary-2025-2026.v001.template.csv`
- Aggiornati manifest Soccer Data e Stats alla V390.
- Il runtime carica il summary statico in sola lettura e indicizza i giocatori per `playerKey`, `fantacalcioId` e `fbrefId`.
- In admin Soccer Data aggiunti pulsanti per aprire/scaricare template CSV e summary JSON.

## Importante

I campi numerici sono vuoti/null. Non sono stati importati dati reali né inventati. Il prossimo passo è compilare il CSV offline e generare una nuova versione summary, ad esempio `player-stats-summary-2025-2026.v002.json`.

## Test automatico

`node tools/audit-soccer-data-static-stats-v390.mjs`

## Vincoli

- Nessuno scraping live.
- Nessuna scrittura Firebase.
- Mapping V383 invariato.
- Storico mapping resta nei docs archive.
- `FUNZIONALITA'.md` non modificato.
