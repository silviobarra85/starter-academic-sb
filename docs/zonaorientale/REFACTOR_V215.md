# V215 - Hotfix archivio bootstrap

## Obiettivo

Correggere il blocco di avvio introdotto durante il refactor V213/V214: il browser interrompeva `app.js` con:

```text
Uncaught ReferenceError: buildSeasonArchiveV196 is not defined
```

Quando questo errore avviene in un modulo ES, tutto il bootstrap della webapp viene fermato e quindi i dati pubblici non vengono renderizzati.

## Modifica

V215 ripristina gli helper base dell'Archivio V196 prima degli override V204/V209:

- `getSeasonArchiveSortedSeasonsV196`
- `getSeasonArchiveSeasonIdV196`
- `setSeasonArchiveSeasonIdV196`
- `buildSeasonArchiveV196`
- `renderSeasonArchiveV196`
- helper di rendering di controlli, metriche, squadre, albo, competizioni e timeline

Gli override V204/V209 restano attivi e continuano a usare snapshot statici della stagione selezionata.

## Cosa non cambia

- Nessuna nuova lettura Firebase.
- Comunicati live in background.
- Mercato live/lazy.
- Archivio senza sottosezione Partite recenti, perché il render effettivo resta gestito dal modulo V209.
- Workflow admin V213 resta disattivato.

## Test consigliati

1. Aprire `/zonaorientale/` senza login.
2. Verificare Dashboard, Albo, Statistiche, Confronta e Archivio.
3. Aprire `/zonaorientale/#archive` e cambiare stagione.
4. Login presidente e verifica Dashboard Presidente.
5. Login admin e Checklist online finale.
