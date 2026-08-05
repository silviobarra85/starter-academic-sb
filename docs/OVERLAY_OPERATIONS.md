# Operazioni overlay

Overlay V786 pronto per la GitHub Action.

- Presuppone che V785 sia stata applicata correttamente.
- Caricare lo zip integro in `incoming/overlays/` e fare commit/push.
- La action copia le sole radici `static/` e `docs/`.
- ioSudo resta in manutenzione ed espone la versione V786.
- Il nuovo helper condiviso sincronizza ogni rosa con l'ultimo listone della stagione selezionata.
- Il listone storico scelto nella pagina Listone non influenza i badge delle rose.
- Badge ammessi: `In listone` e `Asteriscato`.
- Audit automatico incluso: `static/fanta-engine/tools/audit-iosudo-v786.mjs`.
- La action continuerà a eseguire anche l'ultimo audit dati Sudatori disponibile, senza modificare i payload V782.
- L'overlay non modifica workflow, Firebase, snapshot, rose o manifest listoni.
