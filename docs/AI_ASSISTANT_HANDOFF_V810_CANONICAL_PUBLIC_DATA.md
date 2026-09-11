# ZonaOrientale V810 - sorgente pubblica unica

Data: 11/09/2026

## Correzioni

- Dashboard e pagina Comunicati usano sempre `news` dello snapshot statico della stagione, sia da anonimo sia dopo login Presidente/Admin.
- Il caricamento Admin completo fonde la baseline statica con gli override Firebase per ID, senza sostituire silenziosamente la vista pubblica.
- Login Google: l'unico handler attivo usa redirect sui browser desktop e conserva il popup sui dispositivi touch/mobile.
- Rimosso l'intercettore Safari V809 duplicato; la scelta del metodo di login vive ora nel solo `setupAuthV760` attivo.
- I 10 acquisti aggregati del 10/09 sono stati sostituiti da 49 movimenti individuali persistenti e modificabili dall'Admin.

## Integrita contabile

- 49 acquisti, 49 ID deterministici e univoci.
- Totale invariato: -436 FM.
- Ogni record include squadra, giocatore, costo, ruolo, squadra reale, data e sorgente.
- Eventuali vecchi aggregati rimasti su Firebase vengono ignorati dal runtime V810 per evitare doppi addebiti.

## Contratto statico/Firebase

- Lo snapshot statico e la baseline pubblica autorevole.
- Firebase contiene autenticazione, ruoli e delta amministrativi.
- Un documento Firebase con lo stesso ID sovrascrive il record statico; un tombstone lo rimuove.
- L'export snapshot Admin consolida gli override per il deploy successivo.

## Regole Firestore

Le regole ricevute sono compatibili: `news` e `fmMovements` sono leggibili pubblicamente e scrivibili solo dagli Admin. Non erano la causa delle divergenze di visualizzazione o del popup Google.

## Verifica

Eseguire dalla radice:

```bash
node static/fanta-engine/tools/audit-zona-canonical-data-v810.mjs
node static/zonaorientale/tools/audit-static-first-v760.mjs
```
