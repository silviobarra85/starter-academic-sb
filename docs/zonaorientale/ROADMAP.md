# Roadmap ZonaOrientale

Documento consolidato dalle vecchie note sulle nuove funzionalita.


## Roadmap refactor codice

Percorso consigliato dopo V219/V220:

```text
V220 safety refactor mobile chrome - fatto
V221 separazione public/admin rendering - fatto
V222 data repository unico per JSON/Firebase
V223 CSS cleanup progressivo
V224 rimozione legacy/overlay storici solo dopo test completi
```

Regola: ogni step deve preservare il comportamento visibile della versione precedente, salvo richiesta esplicita di nuova feature.

## Priorita alta

### 1. Avvisi post-modifica Admin

Dopo una modifica Admin, il sito dovrebbe indicare quali JSON scaricare e quali snapshot aggiornare.

Esempi:

```text
Hai modificato dati stagione: dopo Aggiorna tutto scarica overlay snapshot stagioni.
Hai modificato Albo/Palmares/FIFA: scarica anche honor.json.
```

### 2. Stato pubblicazione dati

Dashboard con semafori:

```text
Firebase aggiornato
Snapshot Firebase aggiornati
JSON statici aggiornati
Ultimo honor.json
Ultimo snapshot stagione
Ultima rosa statica
Ultimo listone
```

Obiettivo: evitare dubbi del tipo "ho aggiornato Firebase ma dopo refresh vedo vecchio?".

### 3. Procedura guidata Pubblica aggiornamenti

Un flusso Admin che guidi:

```text
1. Aggiorna snapshot Firebase
2. Scarica config pubblica
3. Scarica honor JSON
4. Scarica overlay snapshot stagioni
5. Controlla asset pubblici
6. Checklist online finale
```

Non puo fare push GitHub dal browser, ma puo produrre comandi e checklist.

## Funzioni per presidenti

### Dashboard Presidente piu ricca

Mostrare:

```text
saldo FM
numero giocatori in rosa
ultimi movimenti
prossime partite
risultati recenti
posizione competizioni
trattative aperte
giocatori sul mercato
```

### Storico rosa squadra

Confrontare rose statiche nel tempo:

```text
Rosa al 12/05
Rosa al 21/05
+ entrati
- usciti
variazione costo/saldo
```

### Scheda giocatore evoluta

Su `player.html` aggiungere:

```text
squadra attuale
storico squadre ZonaOrientale
movimenti FM
competizioni vinte
presenze in rose precedenti
valore/costo storico
```

### Timeline Fantamercato

Pagina con eventi:

```text
messa sul mercato
trattativa aperta
trattativa chiusa
movimento concluso
```

Filtri: tutte, mia squadra, trattative, movimenti conclusi.

## Funzioni pubbliche

### Home piu narrativa

Aggiungere blocchi:

```text
ultimo comunicato
classifica principale
prossime partite
ultimi risultati
miglior squadra del mese
ultimi movimenti mercato
campioni in carica
```

### Hall of Fame

Vista pubblica con:

```text
presidenti piu vincenti
squadre leggendarie
record storici
stagioni memorabili
ranking all-time
```

### Archivio stagioni migliorato

Ogni stagione dovrebbe avere accesso chiaro a:

```text
squadre
competizioni
classifiche
rose
albo
movimenti mercato
```

## Funzioni mobile

### Menu mobile piu app-like

Possibili miglioramenti:

```text
badge su Mercato se ci sono trattative
badge su Admin se ci sono azioni richieste
scorciatoie presidente
subnav contestuale per pagine lunghe
```

### Modalita solo presidente

Navigazione semplificata:

```text
La mia squadra
Mercato
Comunicati
Competizioni
Rose
```

## Funzioni tecniche utili

### Validatore JSON statici

Estendere `Controlla asset pubblici` con:

```text
config.json coerente con manifest stagioni
honor.json aggiornato dopo ultima modifica
rose manifest punta al file piu recente
nessun JSON mancante
nessuna stagione nel manifest senza file
nessun file orfano non presente nel manifest
```

### Storico modifiche Admin

Registrare in Firebase o sessione:

```text
data/ora
utente admin
tipo modifica
dati impattati
snapshot aggiornati
JSON da scaricare
```

### Backup guidato

Checklist:

```text
backup Firebase scaricato
backup static JSON scaricato
repo locale aggiornata
branch pushato
master aggiornato
```

## Ordine consigliato

1. Avvisi post-modifica Admin
2. Stato pubblicazione dati / semafori Firebase-JSON
3. Procedura guidata Pubblica aggiornamenti
4. Dashboard Presidente migliorata
5. Validatore JSON statici potenziato
6. Hall of Fame / statistiche storiche avanzate

## Stato refactor corrente

V221 completata: il rendering principale e' ora orchestrato per gruppi public/admin/after tramite modulo dedicato. Il prossimo passo consigliato resta V222, cioe' un data repository unico per rendere meno fragile il caricamento da JSON statici, snapshot e Firebase.
