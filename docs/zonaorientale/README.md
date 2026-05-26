# Documentazione ZonaOrientale

Documentazione consolidata al 26/05/2026, stato codice sito **V245**.

Questa cartella sostituisce la vecchia struttura con molti `AI_HANDOFF_ZONAORIENTALE_Vxxx.md`, `REFACTOR_Vxxx.md`, release note e archivi storici sparsi. Da ora la documentazione operativa va mantenuta in pochi file canonici.

## File da leggere

1. `AI_HANDOFF_ZONAORIENTALE_CURRENT.md`  
   Handoff totale per il prossimo assistente AI. Contiene stato del progetto, regole operative, moduli attivi, rischi noti e test minimi.

2. `ARCHITETTURA_E_DATI.md`  
   Struttura tecnica del sito, file principali, moduli estratti, ordine di lettura JSON/Firebase e schema dati delle classifiche campionato.

3. `OPERATIVITA_ADMIN_E_RELEASE.md`  
   Flussi pratici per modifiche dati, snapshot, JSON statici, test, overlay, cache-buster, comandi locali e Git.

4. `CHANGELOG_CONSOLIDATO.md`  
   Riassunto cronologico delle versioni storiche e delle patch recenti fino a V245.

5. `ROADMAP.md`  
   Idee e priorita future, accorpate dal vecchio documento sulle nuove funzionalita.

6. `firebase/FIREBASE_RULES_ZONAORIENTALE_FULL_V124C.rules`  
   Regole Firestore storiche/consolidate. Non e' un handoff, ma resta qui come riferimento tecnico importante.

## Regola per i prossimi aggiornamenti docs

Non creare piu un file handoff/refactor per ogni micro-versione, salvo necessita reale. Aggiornare invece:

- `AI_HANDOFF_ZONAORIENTALE_CURRENT.md` per lo stato corrente;
- `CHANGELOG_CONSOLIDATO.md` per la storia sintetica;
- `ARCHITETTURA_E_DATI.md` se cambia il codice o il flusso dati;
- `OPERATIVITA_ADMIN_E_RELEASE.md` se cambia il modo di rilasciare o aggiornare dati.

## Regola per gli zip futuri

Quando si consegna una modifica al progetto, lo zip deve essere unico e contenere solo i file modificati, mantenendo le due cartelle principali:

```text
zonaorientale/
docs/
```

Per una modifica solo documentale, e' sufficiente includere solo `docs/zonaorientale/...`.


## Nota V239

V239 aggiunge le notifiche trattative presidente e corregge il permission-denied sul submit del comunicato avvenuto scambio.


## Nota V240

V240 riallinea badge e storico trattative nella Dashboard Presidente: le liste vengono rilette live da Firebase all'apertura della sezione, anche su mobile. Il documento `FUNZIONALITA'.md` resta invariato salvo richiesta esplicita.

## Nota V241

V241 stabilizza Admin -> Accetta utenti: i rifiuti restano come `REJECTED`, gli approvati non tornano `PENDING` al login e i vecchi duplicati pending vengono nascosti. `FUNZIONALITA'.md` resta invariato salvo richiesta esplicita.


## Nota V245

V243 consolida il comunicato di avvenuto scambio; V244/V245 aggiungono il pulsante Admin per eliminare da Firebase i comunicati rifiutati o approvati: un solo form canonico, salvataggio in `teamRequests`, invio EmailJS immediato e pubblicazione News dopo approvazione Admin. Gli agganci legacy V50/V79 sono neutralizzati. `FUNZIONALITA'.md` resta invariato salvo richiesta esplicita.

## Nota operativa V245

Admin -> Richieste presidenti permette di eliminare da Firebase i comunicati approvati o rifiutati. La cancellazione rimuove il documento `teamRequests`; per i comunicati approvati una eventuale News gia' pubblicata resta online. `FUNZIONALITA'.md` resta invariato salvo richiesta esplicita.
