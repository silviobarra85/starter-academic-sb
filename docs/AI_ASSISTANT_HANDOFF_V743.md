# AI Assistant Handoff - ioSudo V743

Data overlay: 20/07/2026 16:11 CEST
File sorgente Excel: `v118_2026-07-20_fantacalcio_serie_a_2026_27_aggiornamento_globale_fuso_v742.xlsx`
Overlay precedente: V742

## Stato operativo
- ioSudo è stato portato a V743 senza nuove fonti rispetto a V742.
- L'Excel V118 è la base fusa corrente con alias/duplicati/disambiguazioni raccolti fino a V742.
- Le schede amichevoli sono compatte nella lista: partita, risultato, data, link; il tabellino si apre al clic.
- I tabellini dettagliati restano 14 con 294 righe giocatore.
- L'header dell'app legge data/ora dal manifest (`overlayGeneratedAt`, `generatedAt`, `updatedAtTime`).

## Regole duplicati importanti
- Non fondere alias generici senza contesto squadra/iniziale confermata.
- Protezioni note: Carboni, Esposito, Thuram globale, Ferguson, Russo, Arena, Bonfanti, Rossi, Colombo, Marin, Moreno, Nicolas, Pedro, David, Rrahmani, Tourè/El Bilal Touré, Oyono, Stankovic, Ilic, Gelli, Traorè, Konaté.
- Kevin Bruno = Sassuolo; Bruno Galassi = Lazio. Non usare alias globale `Bruno`.

## Candidati V743 da chiedere all'utente
- Cittadini / Giorgio Cittadini: Atalanta/Frosinone - cognome breve vs nome completo
- Maldini / Daniel Maldini: Atalanta/Lazio - cognome breve vs nome completo
- Dominguez / Dominguez B.: Bologna - cognome breve vs iniziale
- Lu. Pellegrini / Pellegrini Lu.: Lazio - iniziale/cognome invertiti
- Fofana Sa. / S. Fofana: Lecce - iniziale/cognome invertiti
- J. Miranda / K. Miranda: Bologna/Sassuolo - stesso cognome, iniziali diverse
- N. Moro / L. Moro: Bologna/Sassuolo - stesso cognome, iniziali diverse
- B. Kone / I. Kone: Frosinone/Sassuolo - stesso cognome, iniziali diverse
- J. Vasquez / Vazquez: Genoa/Cremonese - iniziale vs cognome breve
- K. Perez / M. Perez: Venezia/Lecce - stesso cognome, iniziali diverse

## Controlli richiesti a ogni overlay futuro
1. `node --check static/fanta-engine/js/apps/iosudo-app-vXXX.js`
2. `node --check static/iosudo/sw.js`
3. `node static/fanta-engine/tools/audit-iosudo-vXXX.mjs`
4. Verificare `activeOfficialRumors = 0`.
5. Verificare risultati e tabellini amichevoli.
6. Aggiornare anche Excel e fogli Alias/Duplicati/Disambiguazioni.
