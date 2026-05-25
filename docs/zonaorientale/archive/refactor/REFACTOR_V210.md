# REFACTOR V210 - Estrazione generatore comunicati admin

## Obiettivo

Pulire `assets/app.js` spostando il blocco V197 del Generatore comunicati automatici in un modulo dedicato, senza cambiare il comportamento applicativo.

## File modificati

- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/assets/js/refactor/admin-communication-generator-v210.js`
- `docs/zonaorientale/REFACTOR_V210.md`
- `docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_V210.md`
- `docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_CURRENT.md`

## Dettagli tecnici

La logica del generatore comunicati, precedentemente inclusa direttamente in `app.js`, ora viene installata tramite:

```js
installCommunicationGeneratorRefactorV210({ ...dependencies })
```

Il modulo mantiene:

- generazione bozze risultati/giornata;
- generazione bozze vincitore competizione;
- generazione bozze mercato;
- generazione bozze focus squadra;
- generazione bozze Albo/Palmares;
- generazione bozze aggiornamento dati pubblici;
- copia testo negli appunti;
- inserimento nel form Comunicati esistente;
- wiring desktop/mobile Admin;
- stili responsive del pannello;
- API `window.ZonaOrientaleCommunicationGenerator`.

## Comportamento atteso

Nessun cambio funzionale. Il refactor riduce la dimensione di `app.js` e rende il generatore comunicati più isolato e manutenibile.

## Mobile

Il pannello resta mobile-first: griglia a colonna, bottoni a larghezza piena e testi lunghi a capo su smartphone.

## Test consigliati

1. Login Admin.
2. Aprire Admin.
3. Verificare il pannello Generatore comunicati automatici.
4. Provare tutti i template.
5. Provare `Copia testo`.
6. Provare `Inserisci nei Comunicati` dopo `Carica dati amministrazione`.
7. Testare da mobile.
8. Eseguire Checklist online finale.
