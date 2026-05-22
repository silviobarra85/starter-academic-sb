# AI HANDOFF ZONAORIENTALE V202

## Stato versione

Versione footer: **V202 dashboard presidente e rose storiche**.

Branch di lavoro previsto: `feature/zonaorientale-v187-next`.

## Contesto tecnico

Il sito è una SPA statica HTML/CSS/JS senza build system. Firebase resta sorgente admin/modificabile; il pubblico legge prima JSON statici e snapshot.

Da V187 in poi sono state aggiunte funzionalità pubbliche e admin. Gli ultimi fix V199-V201 hanno corretto pagine che leggevano ancora dati granulari admin invece degli snapshot statici.

## Cosa cambia in V202

### 1. Teamarea rinominata lato UI

La rotta interna resta `teamarea`, per non rompere handler e richieste esistenti. L'interfaccia però mostra:

- `Dashboard Presidente` nei link desktop/mobile secondari.
- `Presidente` nella bottom navigation mobile.
- Titolo pagina `Dashboard Presidente`.

Non eliminare la route `teamarea`: è usata da richieste, trattative e form presidente.

### 2. Profili squadra season-aware

È stato aggiunto un resolver V202:

- `resolveTeamProfileSnapshotV202`
- `findSeasonTeamForClubInSeasonV202`
- `refreshVisibleTeamProfileForSeasonV202`

Quando il profilo squadra è aperto e cambia la stagione globale, il sito prova a trovare la stessa squadra nella stagione selezionata. Se non esiste, mostra una card di indisponibilità invece di lasciare la rosa vecchia.

### 3. Link Albo corretti per stagione storica

`makeHonorTeamNamesClickableV90` è stato sovrascritto da V202. Ora:

- nella tabella Albo ogni cella usa il `seasonTeamId` della riga/stagione, quando disponibile dallo snapshot honor;
- se non disponibile, cerca la squadra solo nella stagione della riga;
- se non trova la squadra, il nome resta non cliccabile;
- Palmarès e FIFA Ranking usano la stagione globale selezionata per la clickability.

### 4. Nessuna nuova lettura Firebase obbligatoria

Per aprire profili storici, V202 può chiedere lo snapshot stagione tramite `loadPublicSeasonSnapshotV32(seasonId)`, che prova prima JSON statici. Firebase resta fallback.

## Attenzione per futuri sviluppi

- Non rinominare `teamarea` come route senza un refactor completo: usarla solo come label UI.
- Quando una pagina pubblica deve mostrare storico, preferire `state.publicHonorSnapshot` e `state.publicSeasonSnapshots` rispetto a `state.raw`.
- I link da Albo devono sempre puntare alla squadra della stagione della riga, non alla squadra corrente con lo stesso nome.
- Se si modifica il rendering dell'Albo, verificare che `makeHonorTeamNamesClickableV90` V202 continui a ricevere `.club-name-with-logo` e la struttura della tabella.

## Test minimi per prossimo assistente

1. `node --check static/zonaorientale/assets/app.js`.
2. Aprire `/zonaorientale/#honor` senza `Carica dati amministrazione`.
3. Cliccare una squadra da una riga storica dell'Albo.
4. Verificare che la rosa sia quella della stagione della riga.
5. Aprire un profilo squadra e cambiare stagione globale a una stagione senza quella squadra.
6. Verificare messaggio `Rosa non disponibile per la stagione selezionata`.
7. Test mobile della bottom nav e della Dashboard Presidente.
