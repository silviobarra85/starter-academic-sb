# ZonaOrientale V818 - Coppa Italia Battle Royale + Dashboard competizioni

Data: 11/11/2026

## Obiettivo
Correggere la visualizzazione della Coppa Italia 2026/2027 e riallineare la Dashboard agli ultimi dati ufficiali gia importati nella V817.

## Problema individuato
Il JSON `coppa-italia-2026-2027.json` conteneva correttamente `rounds`, `matches` e `results`, ma `assets/js/data/static-files-service.js` restituiva soltanto `competition`, `matches` e `results`. Le `rounds` venivano quindi perse durante il caricamento e il renderer Battle Royale non poteva mostrare le quattro giornate configurate.

## Correzioni V818
- Il loader competizioni conserva ora `rounds` e `displayMode`.
- La Coppa Italia mostra tutte le quattro giornate Battle Royale; la prima e giocata, le successive sono programmate alle giornate Serie A 17, 24 e 26.
- La classifica Coppa Italia usa i dati ufficiali del file `Classifica_Coppa-Italia-2026-2027.xlsx`.
- La Dashboard mostra la classifica corrente della Coppa Italia in formato compatto.
- Gli ultimi risultati della Dashboard sono raggruppati per ultimo turno effettivamente disputato:
  - Campionato: ultima giornata completa giocata (G11);
  - Champion's League: ultimo turno giocato (ritorno quarti);
  - Coppa Italia: ultima giornata Battle Royale giocata con graduatoria FPT.
- Cache-buster e metadati release riallineati alla V818.

## Dati sportivi preservati
- Campionato: 180 gare totali, 55 giocate, classifica a 11 giornate.
- Champions: 8 gare dei quarti giocate; semifinali Beetlejuice-Real Pisistrius e River Plaid-Olympic Salerno FC programmate.
- Coppa Italia: 4 giornate Battle Royale, G1 giocata, 10 prestazioni e classifica ufficiale a 9 confronti per squadra.
- Rose e movimenti restano quelli della V817, compreso lo scambio Molina+Koopmeiners / Hermoso+Mandragora e lo storico Heggem/Joao Mario.
- Fix login Safari V814 preservato.

## Audit
- `audit-static-first-v760.mjs`: 42/42
- `audit-zona-canonical-data-v810.mjs`: 14/14
- `audit-admin-card-visibility-v763.mjs`: 71/71
- `audit-zona-data-v818.mjs`: 50/50
