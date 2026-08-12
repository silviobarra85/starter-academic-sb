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
