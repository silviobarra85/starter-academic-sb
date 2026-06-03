# V284 - Audit mobile completo

## Scopo

V284 introduce un audit operativo completo dell'esperienza mobile di ZonaOrientale.

La release non corregge ancora layout o CSS: fotografa le aree da verificare, definisce una checklist coerente e prepara il lavoro per i prossimi interventi UI mirati.

Non modifica Firebase, EmailJS, dati JSON o logiche funzionali.

## Stato versione

```text
Versione runtime: V284 audit mobile completo
Diagnostica: window.ZonaOrientaleMobileAuditV284
```

## Viewport da usare nei test

Testare almeno:

```text
390 x 844  - smartphone compatto
430 x 932  - smartphone grande
768 x 1024 - tablet verticale
```

Quando possibile, ripetere il controllo anche su un dispositivo reale.

## Modalita tema

Per ogni sezione controllare:

- tema Light;
- tema Dark;
- passaggio Light -> Dark -> Light senza refresh;
- contrasto di testi, badge, input e tabelle;
- leggibilita quando il contenuto va a capo su due o piu righe.

## Aree da verificare

### 1. Home e navigazione

Controllare:

- header e pulsante account;
- menu mobile e bottom navigation;
- menu `Altro`;
- card riepilogo stagione;
- comunicati recenti;
- scorciatoie rapide;
- pulsante globale `Su`.

Rischi noti:

- testo secondario troppo chiaro in tema Light;
- badge piccoli poco leggibili;
- bottom menu troppo fitto su smartphone stretti.

### 2. News e comunicati

Controllare:

- lista comunicati;
- card comunicato lunga;
- link WhatsApp;
- apertura da hash diretto `#news-...`;
- leggibilita di titolo, data, topic e testo.

Rischi noti:

- metadati/tag poco contrastati;
- spaziatura insufficiente tra azioni su schermi stretti.

### 3. Listone

Controllare:

- filtri ruolo/stato/modifiche;
- ricerca;
- `Mostra usciti storici`;
- pulsante `Esporta modifiche CSV`;
- colonna `Modifica`;
- tabella scrollabile;
- prima colonna sticky;
- righe `Nuovo`, `Uscito`, aumenti e diminuzioni.

Rischi noti:

- troppa densita verticale;
- colonne tecniche difficili da leggere;
- badge `Modifica` lunghi su una riga;
- input e select troppo vicini.

Nota: la sezione pubblica `Storico listoni` resta nascosta dalla UI dopo V280, ma le logiche di confronto interne vengono preservate per `Modifica`, filtri ed export.

### 4. Competizioni

Controllare:

- lista competizioni;
- card competizione;
- calendario;
- risultati;
- classifica campionato completa;
- pagina `competition.html`;
- tabelle con colonne POS, SQUADRA, PUNTI, PG, V, N, P, GF, GS, DR, FPT.

Rischi noti:

- classifica troppo larga;
- celle numeriche poco distanziate;
- prima colonna/sticky e intestazioni da verificare in Light.

### 5. Archivio

Controllare:

- selettore stagione;
- squadre storiche;
- saldi FM;
- competizioni storiche;
- rose e movimenti storici se disponibili.

Rischi noti:

- card dense;
- testo secondario e valori `-` poco evidenti;
- pulsanti stagione troppo piccoli.

### 6. Statistiche

Controllare:

- club piu vincenti;
- podi campionato;
- ultimi titoli assegnati;
- presidenti piu vincenti;
- ranking storici.

Rischi noti:

- card statistiche molto compatte;
- badge/etichette poco leggibili;
- tabelle lunghe in sezioni storiche.

### 7. Confronta

Controllare:

- selezione squadre;
- card confronto;
- valori aggregati;
- storico risultati;
- comportamento con una sola squadra selezionata o dati incompleti.

Rischi noti:

- select e pulsanti troppo ravvicinati;
- colori Light simili tra sfondo e testo muted.

### 8. Dashboard Presidente

Controllare con account presidente approvato:

- header `Pres. Cognome`;
- badge trattative;
- riepilogo squadra;
- azioni rapide mobile;
- comunicato squadra;
- comunicato avvenuto scambio;
- svincola giocatori;
- trattative inviate/ricevute;
- fantamercato presidente.

Rischi noti:

- sezioni lunghe con molti pulsanti;
- textarea/input da verificare in Light;
- badge notifiche da verificare su header e card.

### 9. Admin

Controllare con account admin:

- Accetta utenti;
- Richieste presidenti;
- Comunicati;
- Generatore comunicati;
- Diagnostica dati;
- Converti listone Excel;
- Competizioni;
- Snapshot pubblici;
- Procedura guidata pubblicazione.

Rischi noti:

- molte tabelle e form complessi;
- bottoni secondari poco leggibili;
- pannelli diagnostica con stati colorati da verificare in Light.

## Classificazione problemi

Durante i test segnare ogni problema come:

```text
Critico  - testo illeggibile, azione non cliccabile, layout rotto
Medio    - leggibilita difficile, tabella scomoda, spaziatura problematica
Minore   - solo estetica o rifinitura
```

Per ogni problema annotare:

```text
Sezione:
Tema:
Viewport/dispositivo:
Descrizione:
Screenshot, se disponibile:
Priorita:
```

## Fix consigliati dopo audit

Intervenire a blocchi piccoli, per esempio:

1. testi e badge Light;
2. tabelle mobile;
3. form e input;
4. bottom navigation e menu mobile;
5. dashboard presidente;
6. admin.

Evitare un'unica patch CSS troppo ampia.

## Test automatici da eseguire comunque

```bash
static/zonaorientale/tools/check-zonaorientale.sh
```

Poi test manuale locale:

```bash
cd static/zonaorientale
cd ..
python3 -m http.server 1313 --bind 0.0.0.0
```

Aprire:

```text
http://localhost:1313/zonaorientale/
```

## Esito V284

V284 e' un audit operativo e una base di lavoro. Le correzioni UI successive dovranno essere versionate in release dedicate, per esempio:

```text
V285 - fix tabelle mobile
V286 - fix form e input mobile
V287 - fix dashboard presidente mobile
```
