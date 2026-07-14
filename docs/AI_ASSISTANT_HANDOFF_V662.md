# AI Assistant Handoff V662

V662 e un overlay solo sito, workflow-safe.

Motivo: V661 includeva `tools/apply-overlay-from-zip.sh`; durante la GitHub Action lo script veniva copiato sopra se stesso mentre era ancora in esecuzione, causando un errore bash vicino alla riga 59. V662 evita il problema non includendo la cartella root `tools/`.

Stato desiderato:

- ioSudo invariato.
- Dati invariati.
- Sezione pubblica Per i SUDATORI ancora disattivata.
- Sito mobile con card compatte per listone/rose.
- Filtri attivi.
- Card con colori ruolo.
