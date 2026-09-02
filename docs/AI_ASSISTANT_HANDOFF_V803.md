# ZonaOrientale V803 - handoff

V803 corregge esclusivamente l'apertura della card Admin "Modifica manualmente le rose" introdotta in V802.

## Causa
`renderAdminArea()` collega i listener Apri/Riduci tramite `attachAdminHandlers()`; la card V802 viene inserita dinamicamente solo dopo quel passaggio, quindi il suo bottone non riceveva il listener.

## Fix
`ensureManualRosterAdminPanelV802()` collega il toggle immediatamente dopo l'inserimento della card, con guard `manualRosterToggleBoundV803` e richiamo al `toggleAdminPanel()` canonico.

## Preservato
Nessuna modifica a rose, listoni, competizioni, risultati, movimenti FM o Firebase. Restano invariati ricerca listoni storici, CRUD rosterEntries e generazione overlay snapshot con assets/rose.
