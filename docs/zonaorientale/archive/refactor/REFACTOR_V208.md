# REFACTOR V208 - Pulizia blocchi live data e archivio

## Obiettivo

V208 è un overlay di refactor/pulizia senza nuove funzionalità applicative. Consolida i blocchi V205, V206 e V207, che erano nati come patch successive per:

- rendere i comunicati live da Firebase;
- mantenere il bootstrap non bloccante;
- evitare la riassegnazione di helper `const` del Fantamercato;
- rimuovere la sottosezione "Partite recenti" dall'Archivio.

## Modifiche tecniche

- Sostituiti i frammenti V205/V206/V207 con un unico blocco V208.
- Rimossa la chiamata awaited ai comunicati live nel caricamento pubblico iniziale.
- Mantenuto il caricamento dei comunicati live in background.
- Mantenuto il Fantamercato live/lazy senza sovrascrivere `getActiveTransferListingsV119`.
- Mantenuto l'Archivio da snapshot statici senza la card "Partite recenti".
- Esposti gli stessi nomi debug già usati (`ZonaOrientaleLiveData`, `ZonaOrientaleSeasonArchive`) per compatibilità.
- Aggiornati Version footer, cache-buster e checklist deploy a V208.

## Letture Firebase

V208 non introduce nuove letture Firebase.

La logica resta:

```text
JSON/static snapshot -> dati storici e pesanti
Firebase live -> comunicati, lista trasferibili, trattative
Firebase admin -> dati granulari solo dopo Carica dati amministrazione
```

## File modificati

```text
static/zonaorientale/index.html
static/zonaorientale/assets/app.js
docs/zonaorientale/REFACTOR_V208.md
docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_V208.md
```

## Test consigliati

1. Aprire `/zonaorientale/` senza login.
2. Verificare Dashboard, Albo, Statistiche, Confronta e Archivio.
3. Verificare che i comunicati appaiano e che l'assenza temporanea di Firebase non blocchi il sito.
4. Login presidente e verifica Dashboard Presidente.
5. Aprire Mercato e verificare caricamento live/lazy.
6. Login admin e Checklist online finale.
