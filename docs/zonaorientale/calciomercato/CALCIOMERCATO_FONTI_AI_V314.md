# V314 - Calciomercato fonti, filtro fonte e piano AI

## Scopo

V314 migliora la sezione pubblica `Calciomercato` senza toccare il Fantamercato interno della lega.

Interventi:

- il filtro squadra mostra `Tutte le squadre`, poi `Generale`, poi la lista alfabetica delle squadre;
- aggiunto il filtro `Tutte le fonti` / fonte specifica;
- estesa la configurazione RSS con nuove fonti pubbliche;
- aumentati i limiti degli articoli recuperabili;
- documentato il futuro modulo AI per riepiloghi per giocatore o squadra.

## Fonti attive V314

Fonti configurate in `assets/calciomercato/links.json` e replicate come fallback nella Netlify Function:

- TuttoMercatoWeb;
- SOS Fanta;
- Gianluca Di Marzio;
- Fantacalcio.it;
- La Gazzetta dello Sport;
- Virgilio Sport;
- CalcioMercato.it.

Ogni fonte puo' essere disattivata con `enabled: false` se produce warning, duplicati o contenuti fuori tema.

## Filtro fonte

Il nuovo menu a tendina `Tutte le fonti` permette di vedere solo gli articoli di una fonte specifica.

Il filtro e' client-side: la Netlify Function continua a recuperare tutte le fonti abilitate e il browser filtra i risultati gia' normalizzati.

## Filtro squadra

Il menu squadra mantiene la compatibilita' con articoli senza squadra associata:

```text
Tutte le squadre
Generale
Atalanta
Bologna
...
```

`Generale` viene mostrato subito dopo `Tutte le squadre`, anche se gli articoli senza squadra sono pochi.

## Modulo AI: fattibilita'

E' fattibile aggiungere una scheda AI per selezionare un giocatore o una squadra e ottenere un riepilogo delle notizie collegate.

Architettura consigliata:

1. il frontend seleziona giocatore/squadra;
2. invia alla Netlify Function solo titoli, descrizioni, fonte, data e URL degli articoli rilevanti;
3. la funzione chiama un provider AI server-side usando una chiave in variabile ambiente;
4. la risposta torna come JSON strutturato con riepilogo, fonti citate, punti chiave e livello di incertezza.

Non va chiamata una API AI direttamente dal browser perche' esporrebbe la chiave.

## Limiti consigliati per AI

Per evitare costi e risposte troppo lunghe:

- massimo 20 articoli per riepilogo;
- usare solo metadati RSS/descrizioni, non scraping del testo completo degli articoli;
- mostrare sempre i link originali;
- indicare chiaramente che il riepilogo e' automatico e puo' essere incompleto;
- nessuna scrittura Firebase nella prima versione.

## Funzionalita' a rischio e preservazione

Funzionalita' da non perdere:

- Calciomercato RSS automatico V309;
- layout orizzontale V310;
- data/ora Europe/Rome V312;
- giocatori interessati V306;
- squadre multiple/stato trattativa V308;
- Fantamercato interno;
- Listone pubblico/Admin ed export CSV admin-only;
- Rose e pagina squadra;
- Dashboard Presidente;
- Admin Diagnostica/Richieste/Converti listone;
- mobile bottom nav/menu Altro/pulsante Su.

V314 non modifica Firebase, EmailJS, Fantamercato interno, dati Listone o dati Rose.

## Test manuali

- Aprire `#calciomercato`.
- Verificare filtro squadra: `Tutte le squadre`, `Generale`, poi squadre alfabetiche.
- Verificare filtro fonte: `Tutte le fonti`, poi fonti alfabetiche.
- Filtrare per `TuttoMercatoWeb`, `SOS Fanta`, `Gianluca Di Marzio` e fonti nuove.
- Cercare un giocatore o una squadra.
- Verificare che Fantamercato interno, Listone, Rose, Admin e Dashboard Presidente siano invariati.

## Diagnostica

```js
window.ZonaOrientaleCalciomercatoSourcesV314
```

Campi utili:

- `teamFilterOrder`;
- `sourceFilterId`;
- `aiSummaryImplemented` deve essere `false` in V314.
