# V589 - Colonna Rosa Listone da assets/rose

Il listone contiene spesso un campo `fantasyRoster` generato al momento della conversione del listone. Quel valore può diventare vecchio quando le rose vengono modificate successivamente con l'editor GitHub.

Da V589 il sito ricalcola la colonna `Rosa` confrontando i giocatori del listone con la rosa statica della stagione selezionata:

1. `static/<lega>/assets/rose/manifest.json`
2. `static/<lega>/assets/rose/<file>.json`
3. nome giocatore normalizzato

Se il giocatore non viene trovato nella rosa statica, viene mostrato come `Svincolati`.
