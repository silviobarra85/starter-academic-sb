# Roadmap overlay

## Stato V788

- Risolto alla radice il flicker del footer ZonaOrientale: esiste una release canonica V788 e tutti i writer/MutationObserver legacy convergono su quella invece di contendersi il DOM.
- `index.html`, `release.json`, `league-config.json`, fallback config e cache-buster dell'app sono sincronizzati a V788 / 12-08-2026.
- Riattivata la card presidente `trade-announcement` / modalita Scambio nella sola ZonaOrientale.
- Il flusso EmailJS V242 esistente non viene duplicato: invia il comunicato di scambio/vendita a `caparrotti86@yahoo.it`, registra la richiesta `TRANSFER_NEWS` e lascia all'Admin l'eventuale pubblicazione nelle News.
- La card e riservata al presidente e resta nascosta nel contesto Admin.
- Nessuna modifica al listone, alle rose, ai badge `In listone/Asteriscato`, all'ordinamento P-D-C-A, a FantaMantraManager o ai dati ioSudo.

## Verifiche V788

- Navigare tra Dashboard, Rose, Bilanci e Admin e verificare che il footer resti V788 senza lampeggiamenti verso V694.
- Fare hard reload e navigazione hash su desktop/mobile: il footer deve restare identico prima e dopo il caricamento asincrono.
- Login presidente: verificare che `Scambio` sia nuovamente disponibile e apra il pannello `Comunicato avvenuto scambio`.
- Eseguire un invio EmailJS reale solo se desiderato: il destinatario configurato e `caparrotti86@yahoo.it`; controllare poi la richiesta `TRANSFER_NEWS` in Admin.

## Stato V787

- ioSudo resta temporaneamente disattivato tramite pagina `Site under construction` V787; i dati V782 restano conservati.
- Il listone condiviso corrente della stagione `2026-2027` resta `2026-08-05`; il `2026-07-04` resta storico e selezionabile.
- Le rose di ZonaOrientale e FantaMantraManager vengono confrontate sempre con l'ultimo listone della stagione selezionata.
- Squadra reale, ruolo Classic/Mantra, quotazione, FVM, ID e link Fantacalcio.it arrivano dall'ultimo listone; costo d'asta, fantasquadra e storico restano invariati.
- Il refresh delle rose dopo il caricamento asincrono dei listoni ascolta ora gli eventi V760 su `window`, evitando dati di squadra obsoleti nelle schede gia aperte.
- Esempio verificato: Sohm resta nella rosa di Real Pisistrius ma viene mostrato come `VEN / Venezia`, non piu `BOL / Bologna`.
- Quando si apre una fantasquadra, l'ordine iniziale e sempre `P -> D -> C -> A`, con ordine alfabetico all'interno del ruolo. Gli ordinamenti manuali restano disponibili durante la consultazione.
- Badge permanenti: `In listone` per i presenti; `Asteriscato` per assenti o ceduti, senza cancellazione dalla rosa.

## Verifiche successive

- Controllare Sohm e almeno un altro trasferito in ZonaOrientale, sia nella lista Rose sia nella scheda squadra.
- Verificare l'ordine P-D-C-A su desktop e mobile, nella lista Rose e nel profilo squadra.
- Ripetere lo stesso controllo in FantaMantraManager quando saranno presenti rose operative.
- Con ogni nuovo listone mantenere le versioni precedenti nel manifest: l'ultimo della stagione verra scelto automaticamente per le rose.
- Alla riattivazione di ioSudo, rifare il matching completo sul listone corrente senza riutilizzare alla cieca gli ID precedenti.

## Stato V789

- Correzione strutturale del footer ZonaOrientale: tutti i punti del grafo runtime usano ora la stessa istanza di `league-config-v443.js` con cache-buster `?v=789`; vengono eliminati i riferimenti runtime `?v=761` che permettevano a configurazioni vecchie di convivere con la release corrente.
- Home, Competizione e Scheda giocatore partono gia con `Fantacalcio - V789 - Aggiornato al 12/08/2026`, quindi non esiste piu una fase iniziale con footer vecchio.
- I writer footer legacy, incluso V694, delegano al controller canonico V789 prima di poter scrivere nel DOM.
- Corretto il sanitizer della league config: il `featureCardRegistry` non viene piu ricostruito conservando solo `release-players`; tutte le card configurate, incluso `trade-announcement`, restano disponibili.
- Corretto anche il metodo `refresh()` del Feature Card Registry condiviso: i getter leggono il registry aggiornato e non quello catturato alla prima installazione.
- La Dashboard Presidente mostra un pulsante esplicito `Scambio/Vendita`; apre e dispiega il pannello canonico V242.
- Il flusso resta unico: `TRANSFER_NEWS` su Firestore + EmailJS a `caparrotti86@yahoo.it`; nessun secondo handler o doppio invio.
- L'attivazione ascolta anche l'evento realmente emesso dal bootstrap auth, `fanta:auth-state-v760`.
- Rose/listone V787, badge, ordine P-D-C-A, storico listoni, FantaMantraManager e ioSudo in manutenzione restano invariati.

## Verifiche V789

- Hard reload della home e navigazione per almeno 40 secondi: il footer non deve mai mostrare V694/V698/V761.
- Aprire `competition.html` e `player.html`: footer V789 gia al primo paint.
- Login presidente: nella Dashboard deve comparire `Scambio/Vendita`; il pulsante deve aprire il form `Comunicato avvenuto scambio` anche se il pannello era collassato.
- Verificare un invio reale solo quando desiderato: deve comparire la richiesta `TRANSFER_NEWS` in Admin e partire una sola email EmailJS verso Caparrotti.

## Stato V790 - sblocco deploy Netlify

- Individuata la causa reale del mancato aggiornamento pubblico: Netlify completava l'audit static-first 42/42 ma bloccava ogni deploy sull'audit storico `audit-admin-card-visibility-v763.mjs`, che pretendeva erroneamente che la release shell fosse ancora V763.
- Il controller Admin condiviso resta correttamente al contratto V763; l'audit ora distingue la versione del controller dalla versione shell di ZonaOrientale e verifica che footer e `release.json` siano allineati dinamicamente alla shell corrente.
- ZonaOrientale viene riallineata a V790 / 13-08-2026 conservando integralmente il root fix V789 di footer e Scambio/Vendita.
- La V790 non modifica intenzionalmente `tools/apply-overlay-from-zip.sh`: lo script corrente non deve sovrascrivere se stesso mentre e in esecuzione. L estensione della pipeline per `netlify/` e `netlify.toml` verra fatta in un passaggio separato dopo il ripristino del deploy.
- Il vecchio header Netlify `X-Fanta-Release: V763` resta da riallineare in un overlay successivo ora che il meccanismo di applicazione supporta i file Netlify; non influenza il DOM o il runtime applicativo e non blocca il deploy V790.

## Verifiche V790

- Audit static-first ZonaOrientale: 42/42.
- Audit controller Admin V763 compatibile con shell corrente: 71/71 su V790.
- Audit ioSudo/dati preservati: 12/12.
- Audit footer/Scambio/rose: 36/36.
- Verificare dopo il deploy che `/zonaorientale/release.json` riporti `790` e che il footer mostri V790 senza ritorni a V694.
- Login presidente: verificare apertura del form `Scambio/Vendita` e, solo se desiderato, eseguire un invio EmailJS reale.


## V791 - Listone/Rose pre-svincoli 19 agosto
Completato: nuovo listone 18/08, rose aggiornate, regola permanente ultima quotazione per asteriscati. Prossimo controllo operativo: sessione svincoli del 19/08 e successiva rigenerazione snapshot dopo i movimenti.


## V792 - correzione audit overlay (18/08/2026)
- Overlay cumulativo rispetto a V790: include listone/rose/svincoli V791 e audit `audit-iosudo-v792.mjs` / `audit-sudatori-section-v792.mjs` affinche la GitHub Action selezioni controlli coerenti con la release corrente.
- Il listone corrente resta 2026-08-18; i listoni 2026-08-05 e 2026-07-04 restano storici e selezionabili.
- Gli asteriscati in rosa restano svincolabili all'ultima quotazione disponibile della stagione.


## V793 - Rose ZonaOrientale fonte primaria
Completato: aggiornamento reale della sorgente `assets/rose` al file del 18/08/2026, con 211/211 righe coerenti con lo snapshot. Questo diventa il requisito per ogni futuro aggiornamento rose: aggiornare sempre JSON rose + manifest, non soltanto lo snapshot stagionale.
