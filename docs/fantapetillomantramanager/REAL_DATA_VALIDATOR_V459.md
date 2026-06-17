# V459 - Validatore dati reali FantaPetillo 2026-2027

La V459 aggiunge una card Admin selezionabile chiamata `Validatore dati reali 2026-2027`.

## Obiettivo

Validare localmente, nel browser, il CSV o JSON compilato a partire dai template V458 prima di trasformarlo in dati operativi.

La card:

- non scrive su Firebase;
- non invia file a servizi esterni;
- normalizza nomi, email, slug, budget e stadi;
- segnala errori bloccanti e avvisi;
- produce un seed JSON revisionabile;
- produce un CSV normalizzato.

## File principali

```text
static/fantapetillomantramanager/assets/js/core/fanta-petillo-real-data-validator-v459.js
static/fantapetillomantramanager/assets/css/refactor/fanta-petillo-real-data-validator-v459.css
static/fantapetillomantramanager/tools/audit-real-data-validator-v459.mjs
```

## Flusso consigliato

1. Entrare in `/#admin`.
2. Nel selettore card Admin abilitare `Validatore dati reali 2026-2027`.
3. Caricare il CSV/JSON compilato o incollarne il contenuto.
4. Correggere eventuali errori.
5. Scaricare `fantapetillo-real-data-seed-v459.json`.
6. Usare il seed come base per una patch successiva o per inserimento controllato da Admin/Firebase Console.

## Guardrail

La V459 non sblocca Area Squadra e non crea automaticamente `teamUsers`. Gli UID Authentication possono essere lasciati vuoti durante la fase di preparazione, ma saranno necessari prima di abilitare l'accesso dei presidenti.
