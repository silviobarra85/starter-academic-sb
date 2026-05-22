# AI HANDOFF - ZonaOrientale V197

## Stato versione
Versione corrente: **V197 generatore comunicati**.

## Contesto recente
Dopo V189-V191 l'admin ha promemoria pubblicazione, stato Firebase/JSON e procedura guidata. V192-V196 hanno aggiunto dashboard presidente, statistiche, tasto Su globale, confronto squadre e archivio stagioni.

## Nuova funzione V197
V197 aggiunge in Admin il pannello **Generatore comunicati automatici**.

### Cosa fa
Prepara bozze testuali usando dati gia' caricati in `state.raw`:
- competizioni e partite per risultati;
- competitionResults per vincitori/podi;
- fmMovements per mercato;
- roster/matches/movements per focus squadra;
- honorRoll per Albo/Palmarès;
- testo operativo per aggiornamento dati pubblici.

### Cosa non fa
- Non salva direttamente su Firebase.
- Non invia email.
- Non genera JSON statici.
- Non aggiunge letture Firebase.

### Azione chiave
Il bottone **Inserisci nei Comunicati** compila il form `adminNewsForm`; l'admin deve poi revisionare e premere **Salva comunicato**.

## Funzioni principali
- `buildCommunicationDraftV197(options)`
- `renderCommunicationGeneratorPanelV197()`
- `insertCommunicationDraftIntoNewsFormV197()`
- `copyCommunicationDraftV197()`
- `window.ZonaOrientaleCommunicationGenerator`

## Vincoli da rispettare
- Continuare a non leggere Firebase all'avvio pubblico.
- Ogni nuova funzione deve essere mobile-first.
- Ogni overlay deve aggiornare Version footer, cache-buster e `DEPLOY_EXPECTED_VERSION_V181`.
- Ogni overlay deve includere anche un handoff AI.

## Test consigliati
1. Login admin.
2. Aprire Admin.
3. Provare tutti i template del generatore.
4. Usare **Copia testo**.
5. Usare **Inserisci nei Comunicati** e verificare che il form Comunicati sia compilato.
6. Salvare un comunicato solo dopo revisione.
7. Controllare mobile e Checklist online finale.
