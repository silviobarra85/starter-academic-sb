# Handoff sito e FantaEngine

## Overlay V788

V788 interviene solo su ZonaOrientale e sui relativi audit. Corregge il flicker del footer eliminando il conflitto tra numerosi writer/MutationObserver legacy e riattiva la modalita presidente `Scambio` tramite il Feature Card Registry, preservando il flusso EmailJS V242 gia esistente.

## Footer canonico V788

- Sorgente runtime unica: `ZONAORIENTALE_RELEASE_V788` in `static/zonaorientale/assets/app.js`.
- Label canonica: `Fantacalcio - V788 - Aggiornato al 12/08/2026`.
- Tutti i writer legacy del footer delegano immediatamente alla funzione canonica se V788 e attiva; gli observer precedenti quindi non possono piu ripristinare V694/V698/etc.
- Un solo observer canonico, marcato sul `body`, riallinea eventuali sostituzioni del nodo senza generare ping-pong.
- `index.html`, `release.json`, `league-config.json` e fallback `league-config-v443.js` sono coerenti con V788.

## Modalita Scambio presidente

- Card registry: `trade-announcement`, `enabled: true`, feature flag `presidentTradeAnnouncement: true`, visibile al presidente e nascosta all'Admin.
- Il runtime V788 forza la riattivazione anche sul registry gia installato, per coprire il bootstrap che precede il caricamento asincrono della league config.
- Viene riutilizzato il pannello storico `teamTransferCommunicationPanelV242`; non viene creato un secondo flusso.
- Destinatario EmailJS preservato: `caparrotti86@yahoo.it`.
- Flusso preservato: crea richiesta `TRANSFER_NEWS` / topic `COMUNICATO_AVVENUTO_SCAMBIO`, invia EmailJS, poi l'Admin puo approvare/pubblicare la comunicazione nelle News.

## Funzionalita preservate

- Sincronizzazione rose/listone V787, badge e ordine P-D-C-A invariati.
- FantaMantraManager non modificato.
- ioSudo resta in manutenzione e i dati V782 restano disponibili.
- Firebase, snapshot, competizioni e manifest listoni non vengono modificati da V788.

## Overlay V787

V787 corregge la visualizzazione delle rose dopo V786. Le rose continuano a usare l'ultimo listone della stagione, ma ora ogni renderer riceve esplicitamente il record sincronizzato e le schede gia aperte vengono aggiornate quando termina il caricamento asincrono dei listoni.

## Regola canonica rose/listone

- Helper condiviso: `static/fanta-engine/js/core/roster-listone-sync-v787.js`.
- Gli ID Fantacalcio non sono chiavi identita e possono cambiare tra listoni.
- Matching primario: nome normalizzato; la vecchia squadra serve solo a disambiguare omonimi e non blocca un trasferimento.
- Per i presenti vengono aggiornati a runtime: squadra reale, denominazione squadra, ruolo Classic, ruoli Mantra, quotazioni, FVM, ID e link Fantacalcio.it.
- Per gli assenti o ceduti: badge `Asteriscato`; il giocatore resta nella fantasquadra con costo e storico.
- Il listone storico selezionato nella schermata Listone non modifica le rose.

## Correzioni V787

- Gli eventi `fanta:public-core-ready-v760` e `fanta:static-assets-ready-v760` sono emessi su `window`; V787 li ascolta sullo stesso oggetto. Questo elimina schede squadra ferme ai dati dello snapshot, come Sohm ancora Bologna invece di Venezia.
- `renderRosterPlayerTable` e `renderTeamProfileContentV42` ricevono sempre copie sincronizzate dei giocatori.
- Il sort del ruolo usa un rank numerico canonico: `P=1`, `D=2`, `C=3`, `A=4`.
- Aprendo una fantasquadra o una nuova card nella pagina Rose, il sort iniziale viene riportato a ruolo crescente; l'utente puo poi usare gli ordinamenti esistenti.
- Cache-buster di `assets/app.js`, footer runtime e release ZonaOrientale sono aggiornati a V787.

## Funzionalita preservate

- Nessuna modifica ai file rosa o snapshot: i dati del listone vengono applicati a runtime.
- Nessuna modifica a costi d'asta, saldi FM, movimenti, competizioni, Firebase, EmailJS, Admin o storico listoni.
- Nessuna cancellazione di giocatori asteriscati.
- ioSudo resta in manutenzione V787; i dati V782 restano disponibili.

## Overlay V789 - root fix footer e Scambio/Vendita

La V788 aveva aggiunto un controller canonico, ma restavano due problemi di architettura. Primo: il sito importava `league-config-v443.js` con URL diversi (`?v=761` e release corrente), permettendo al browser di creare istanze modulo separate e, in presenza di cache, di applicare una configurazione vecchia. Secondo: `sanitizeConfigV443()` scartava tutte le card del Feature Card Registry tranne `release-players`, rendendo instabile `trade-announcement`.

### Footer V789

- `index.html`, `competition.html`, `player.html`, `app.js` e tutti i moduli interni coinvolti usano `league-config-v443.js?v=789`.
- `static-files-service.js`, `ui.js` e `bilanci-snapshot-section-v435.js` non importano piu l'istanza V761.
- Il controller `ZonaOrientaleCanonicalFooterV789` e disponibile dall'inizio di `app.js`.
- Tutti i writer legacy V665-V787, incluso il writer V694 con MutationObserver e timer fino a 32 secondi, delegano al controller V789 prima di scrivere.
- Le tre pagine con footer statico contengono gia la label V789, evitando flicker prima del bootstrap.

### Feature Card Registry

- `sanitizeConfigV443()` conserva `merged.featureCardRegistry` e congela tutte le card invece di ricostruire un array hard-coded con il solo svincolo.
- `feature-card-registry-v497.js` usa `this.registry` nei getter. Dopo `refresh()` il motore dashboard legge quindi il registry nuovo, non l'istanza iniziale.
- Per ZonaOrientale `presidentTradeAnnouncement` e `trade-announcement` restano attivi solo nel contesto presidente e nascosti all'Admin.

### Scambio/Vendita

- Il form canonico resta `teamTransferCommunicationFormV242` dentro `teamTransferCommunicationPanelV242`.
- La Dashboard Presidente riceve un pulsante `Scambio/Vendita`; il click espande il pannello V242, esegue scroll e porta il focus sul testo comunicato.
- Il pulsante mobile Scambio viene collegato allo stesso opener V789.
- L'attivazione ascolta `fanta:auth-state-v760`, l'evento realmente emesso dal bootstrap auth.
- Submit preservato: `teamRequests/TRANSFER_NEWS` + EmailJS verso `caparrotti86@yahoo.it`; l'Admin puo poi pubblicare nelle News.
- Nessuna modifica a svincoli, rose/listoni, Firebase rules, snapshot o FantaMantraManager.
