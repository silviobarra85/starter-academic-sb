# V142 - Mobile UI role-aware

Obiettivo: continuare la nuova interfaccia mobile senza modificare la resa desktop.

Modifiche:

- La bottom navigation mobile ora è consapevole del ruolo.
- Se l’utente è un presidente con squadra, il secondo tab resta `Squadra` e apre `Area squadra`.
- Se l’utente è admin senza squadra, il secondo tab diventa `Admin` e apre il pannello amministratore.
- Se l’utente non è presidente né admin, il secondo tab diventa `Rose` e apre la sezione pubblica delle rose.
- Nella Mobile Home è stata aggiunta una card `Tutte le rose` per presidenti e admin.
- La card `Area squadra` non compare più per admin senza squadra: viene sostituita da una card Admin.
- Il menu `Altro` mobile contiene anche il link `Tutte le rose`.

Note:

- Nessuna modifica alla UI desktop.
- Nessuna modifica a Firebase.
- Nessuna modifica alle regole Firebase.
- Ogni presidente può accedere a tutte le rose dalla Mobile Home o dal menu Altro.
