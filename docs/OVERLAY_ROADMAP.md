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
