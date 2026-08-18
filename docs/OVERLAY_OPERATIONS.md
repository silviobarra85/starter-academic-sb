# Operazioni overlay

Overlay V788 pronto per la GitHub Action.

- Presuppone che V787 sia stata applicata correttamente.
- Caricare lo zip integro in `incoming/overlays/` e fare commit/push.
- La Action copia le sole radici `static/` e `docs/`.
- ZonaOrientale usa ora una sola sorgente canonica del footer: `V788 - Aggiornato al 12/08/2026`. I writer/observer legacy delegano tutti alla sorgente canonica e non possono piu ripristinare V694 o altre versioni.
- Il Feature Card Registry di ZonaOrientale riattiva `trade-announcement` per il presidente e lo mantiene nascosto all'Admin.
- Il flusso canonico V242 resta invariato: richiesta `TRANSFER_NEWS`, email EmailJS immediata a `caparrotti86@yahoo.it`, successiva eventuale pubblicazione News da Admin.
- ioSudo resta in manutenzione; dati V782, listoni condivisi e sincronizzazione rose V787 restano invariati.
- Audit automatici inclusi: `audit-sudatori-section-v788.mjs` e `audit-iosudo-v788.mjs`; audit static-first ZonaOrientale aggiornato alla release shell corrente.

Overlay V787 pronto per la GitHub Action.

- Presuppone che V786 sia stata applicata correttamente.
- Caricare lo zip integro in `incoming/overlays/` e fare commit/push.
- La Action copia le sole radici `static/` e `docs/`.
- ioSudo resta in manutenzione ed espone la versione V787.
- Le rose vengono sincronizzate con squadra, ruolo, quotazione e link dell'ultimo listone della stagione.
- Il refresh dopo il caricamento dei listoni usa gli eventi V760 emessi su `window`.
- All'apertura di una fantasquadra l'ordine iniziale e `P, D, C, A`; gli ordinamenti manuali restano disponibili.
- Audit automatici inclusi: `audit-sudatori-section-v787.mjs` e `audit-iosudo-v787.mjs`.
- L'overlay non modifica rose JSON, manifest listoni, costi d'asta, saldi FM, Firebase, EmailJS o competizioni.

Overlay V789 pronto per la GitHub Action.

- Presuppone V787/V788 gia presenti nel repository; sostituisce la correzione incompleta V788 con un root fix.
- Caricare lo zip integro in `incoming/overlays/` e fare commit/push.
- La Action copia solo `static/` e `docs/`.
- Tutti gli import runtime di `league-config-v443.js` in ZonaOrientale sono allineati a `?v=789`; non deve restare alcun `?v=761` nel grafo corrente.
- Footer statici di home/competition/player, release manifest, config JSON e fallback config sono V789.
- Feature Card Registry: sanitizer corretto + `refresh()` realmente operativo.
- Dashboard Presidente: pulsante `Scambio/Vendita` -> pannello V242 -> richiesta `TRANSFER_NEWS` + EmailJS a `caparrotti86@yahoo.it`.
- Audit automatici inclusi: `audit-sudatori-section-v789.mjs` e `audit-iosudo-v789.mjs`; resta anche l'audit static-first V760 parametrico sulla release.

Overlay V790 - sblocco deploy Netlify.

- Presuppone che V789 sia gia presente su `master`; non richiede che V789 sia mai stata pubblicata da Netlify.
- Corregge direttamente `static/zonaorientale/tools/audit-admin-card-visibility-v763.mjs`, cioe lo script che il build Netlify richiama ancora esplicitamente.
- Il contratto del controller Admin resta V763; solo gli assert della shell diventano dinamici (`release.json` + footer della release corrente).
- Aggiorna ZonaOrientale a V790 e conserva il root fix V789 per footer e Scambio/Vendita.
- Non sovrascrive `tools/apply-overlay-from-zip.sh` durante la propria esecuzione; la pipeline Netlify verra modernizzata in un overlay infrastrutturale separato.
- Dopo il push, attendere il deploy Netlify e controllare `https://silviobarra.com/zonaorientale/release.json?nocache=V790`.


## V791 - Dati pre-svincoli
Il nuovo listone deve essere aggiunto al manifest condiviso senza rimuovere i precedenti. Le rose sono autorevoli per appartenenza/costo; il listone corrente e' autorevole per squadra reale, ruolo, stato e quotazione. Un giocatore assente/fuori-listone ma ancora in rosa resta svincolabile all'ultima quotazione disponibile nella stagione.


## V792 - correzione audit overlay (18/08/2026)
- Overlay cumulativo rispetto a V790: include listone/rose/svincoli V791 e audit `audit-iosudo-v792.mjs` / `audit-sudatori-section-v792.mjs` affinche la GitHub Action selezioni controlli coerenti con la release corrente.
- Il listone corrente resta 2026-08-18; i listoni 2026-08-05 e 2026-07-04 restano storici e selezionabili.
- Gli asteriscati in rosa restano svincolabili all'ultima quotazione disponibile della stagione.


## V793 - Regola operativa aggiornamento rose
Per ZonaOrientale, da V588 `assets/rose` e' la sorgente primaria. Ogni nuovo file rose deve generare un nuovo JSON in `static/zonaorientale/assets/rose/`, aggiungere la relativa voce al manifest e mantenere coerente lo snapshot della stagione. L'audit deve confrontare le due sorgenti per squadra, giocatore e costo.
