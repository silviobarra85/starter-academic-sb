# V556 - Lean runtime restore

## Perche' e' stato necessario

Il sito online caricato come riferimento risultava veloce con la stessa quantita' di dati di ZonaOrientale. Il confronto ha indicato che la lentezza non era causata dai dati, ma dalla stratificazione dei moduli runtime aggiunti negli overlay successivi.

## Decisione

V556 non introduce un'altra ottimizzazione. Al contrario, rimuove dal runtime ordinario i layer sperimentali che aggiungevano observer, timer, preload o cache wrapper sopra la navigazione locale.

## Layer disattivati dal runtime ordinario

- V534 `navigation-active-singleton-v534`
- V535 `navigation-fluidity-v535`
- V536 `navigation-performance-guard-v536`
- V552 `performance-profiler-lazy-render-v552`
- V553 `application-cache-chunked-tables-v553`
- V555 `eager-data-preload-v555`

## Funzionalita' preservate

- Multi-lega.
- `fanta-engine` come motore comune.
- Listoni e Calciomercato centralizzati.
- Calciomercato live ultimi 3 giorni + archivio statico centrale.
- Stile Listone/Rose unificato.
- Regolamento senza colorazioni ruolo.
- Dashboard, Admin, Presidente, Firebase ed EmailJS invariati.

## Regola per il futuro

Prima di aggiungere nuovi layer runtime, misurare. Se serve correggere un problema di navigazione, preferire patch locali/minime invece di observer globali.
