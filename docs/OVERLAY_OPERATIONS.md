# Operazioni overlay

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
