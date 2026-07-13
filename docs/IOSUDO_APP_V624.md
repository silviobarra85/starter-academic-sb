# ioSudo App V624

La V624 corregge la vista **GIOCATORI** introdotta nelle versioni precedenti.

## Cosa cambia

La lista compatta contiene tutti i giocatori dell'app, compresi quelli citati in trattative e ufficialita, ma ogni giocatore viene mostrato una sola volta.

Quando una voce mercato riguarda un giocatore gia presente nel dataset, viene collegata alla scheda reale del giocatore invece di creare una seconda card. Ad esempio, Muharemovic non deve piu comparire sia sotto Sassuolo sia sotto Juventus: compare come giocatore del Sassuolo e nel dettaglio porta le trattative collegate.

## Informazioni nella card

Ogni card mostra:

- nome;
- ruolo;
- squadra reale attuale;
- squadra fantasy, oppure `-`;
- badge collegati, inclusi CONFERMATO/RUMOR/NUOVO e SOS quando presente;
- data ultimo aggiornamento;
- presenza nel listone piu recente.

## Dettaglio giocatore

La card e cliccabile. Il dettaglio mostra le informazioni disponibili e le fonti/links relativi al giocatore.

## Cache

Non serve reinstallare la PWA. Dopo il deploy basta chiudere e riaprire ioSudo, oppure fare refresh dal browser se resta in cache.
