# AI Handoff ZonaOrientale - V199

## Contesto
Il sito usa JSON statici e snapshot pubblici per ridurre letture Firebase. La pagina Statistiche V193 era stata costruita su `state.raw.honorRoll` e `state.raw.fifaRankings`, ma in modalita pubblica leggera questi array possono essere vuoti.

## Modifica V199
V199 corregge Statistiche/Hall of Fame usando `state.publicHonorSnapshot` come fonte primaria:

- `state.publicHonorSnapshot.honorRows` per Campionato, Coppa Italia, Champions League, Playoff, podi e timeline;
- `state.publicHonorSnapshot.fifaRanking` per il ranking FIFA;
- `state.publicHonorSnapshot.palmares` come fallback aggregato;
- nessuna lettura Firebase aggiuntiva.

## Funzioni aggiunte/override

- `getHistoricalHonorSnapshotRowsV199()`
- `getHistoricalFifaRowsV199()`
- `ensureHistoricalSnapshotBucketV199()`
- override `buildHistoricalStatsV193`
- override `renderHistoricalFifaTopV193`
- override `renderHistoricalPresidentRankingV193`
- debug globale `window.ZonaOrientaleHistoricalStats`

## Attenzione
La sezione Presidenti vincenti puo restare non calcolabile in modalita pubblica se lo snapshot honor non include i presidenti. In quel caso mostra un messaggio chiaro. Con caricamento dati amministrazione completo puo usare i dati granulari disponibili.

## Verifiche consigliate

1. Aprire `/zonaorientale/#stats` senza premere Carica dati amministrazione.
2. Verificare che Hall of Fame mostri titoli, club vincitori e Top FIFA Ranking.
3. Verificare Club piu vincenti, Podi Campionato, Ultimi titoli assegnati.
4. Verificare mobile.
5. Eseguire Checklist online finale: deve aspettarsi V199.
