# AI Assistant Handoff V755 / ioSudo V751

## Stato

Questo overlay combina:

- sito ZonaOrientale V755;
- ioSudo V751.

## Fix principali

1. Mobile/ioSudo: service worker reso robusto. La precache non blocca più l'installazione se un asset opzionale non risponde. Le navigazioni sono network-first.
2. Conteggio giocatori ioSudo: il KPI ora usa la stessa lista effettivamente mostrata nella vista GIOCATORI. La sorgente dati contiene 1054 righe giocatore, ma la vista compatta mostra 1052 profili dopo deduplica. Il manifest espone:
   - `players`: 1052
   - `displayPlayers`: 1052
   - `playersSourceRows`: 1054
3. Ordinamento GIOCATORI: per aggiornamento più recente, poi ruolo e nome.
4. ZonaOrientale: app.js cache-buster V755, mantenendo i fix V752 Rose/svincoli e V754 checkbox Admin desktop.

## Attenzioni future

- Non fondere Kostić Milan con Kostic Juventus.
- Non fondere Bruno Galassi Lazio con Kevin Bruno Sassuolo.
- Non usare alias generici su Carboni, Esposito, Thuram, Ferguson, Russo, Arena, Bonfanti, Rossi, Colombo, Marin, Moreno, Nicolas, Pedro, David, Rrahmani, Tourè, Oyono, Stankovic, Ilic, Gelli, Traorè, Konaté, Vasquez, Perez, Kone, Moro, Miranda.
- Gli svincoli completi devono restare nello snapshot statico 2026-2027.json e non devono essere abbreviati nella UI.
