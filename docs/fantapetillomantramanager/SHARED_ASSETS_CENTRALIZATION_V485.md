# V485 - Centralizzazione prudente asset listone/calciomercato

Aggiornato al **24/06/2026**.

## Scopo

La V485 sposta il progetto verso il motore comune senza cancellare nulla dalle singole leghe. I file statici identici individuati in V484 vengono copiati in un path centrale del motore:

```text
static/fanta-engine/data/shared-assets/v485/
```

Le copie locali in `static/zonaorientale` e `static/fantapetillomantramanager` restano presenti e identiche. Questo e' intenzionale: il runtime usa il path centrale come sorgente primaria, ma mantiene fallback locale.

## File centralizzati

La V485 centralizza i 42 file gia' censiti dalla V484:

```text
assets/listoni/**
assets/calciomercato/**
assets/js/calciomercato/**
assets/js/admin/listone-converter.js
assets/js/domain/listone.js
assets/css/refactor/listone.css
assets/css/refactor/calciomercato.css
```

Manifest centrale:

```text
static/fanta-engine/data/shared-assets-centralization-v485.json
```

## Runtime cambiato

Per le due leghe principali, in `assets/league-config.json` i path listone/calciomercato ora puntano prima al motore comune:

```text
../fanta-engine/data/shared-assets/v485/assets/listoni/
../fanta-engine/data/shared-assets/v485/assets/calciomercato/
```

Sono stati aggiunti fallback locali:

```text
./assets/listoni/
./assets/calciomercato/
```

## Fallback applicati

- `assets/js/data/static-files-service.js` prova manifest/listoni dal path centrale e, se non disponibili, torna ai path locali.
- `assets/app.js` prova le fonti e l'archivio Calciomercato dal path centrale e, se non disponibili, torna ai path locali.
- La copia annidata `static/zonaorientale/static` resta volutamente su copie locali per evitare path relativi errati.

## Cosa non e' stato fatto

- Nessuna copia locale cancellata.
- Nessuna modifica a Firebase.
- Nessuna modifica a EmailJS.
- Nessuna modifica ad Admin, Dashboard Presidente o Area Squadra.
- Nessuna modifica a news, regolamenti, bilanci, rose o competizioni.
- Nessuna modifica a `FUNZIONALITA'.md`.

## Audit

Audit dedicato:

```bash
cd static
node fanta-engine/tools/audit-shared-assets-centralization-v485.mjs
node fanta-engine/tools/audit-multileague-contamination-v485.mjs
```

Esito atteso:

```text
Audit shared assets centralization V485: tutti OK, 0 FAIL
Audit anti-contaminazione V485 completato: tutti OK, 0 FAIL
```

## Verifica manuale consigliata

Su entrambe le leghe:

- aprire home senza errori console;
- aprire `#listone` e verificare che i giocatori vengano caricati;
- aprire una scheda da Listone e verificare `player.html`;
- usare filtri ruolo/classico/mantra;
- aprire `#calciomercato` e controllare che non compaiano errori di manifest/archive;
- verificare che i footer mostrino V485;
- verificare assenza di riferimenti incrociati tra ZonaOrientale e FantaMantraManager.

## Prossimo step possibile

Solo dopo test manuali verdi: valutare se centralizzare anche i riferimenti HTML a CSS/JS comuni. Per ora i moduli CSS/JS restano caricati dai path locali per minimizzare il rischio regressioni.
