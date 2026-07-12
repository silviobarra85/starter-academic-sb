# AI Assistant Handoff V620 - ioSudo viste rapide globali

Versione: **V620**

## Scopo

V620 corregge il comportamento dei tasti sotto la barra di ricerca di **ioSudo**. I vecchi tasti sembravano non funzionare perché filtravano soprattutto i risultati di ricerca, mentre a query vuota la home restava sulla griglia squadre.

## Nuovo comportamento

I tasti sono ora viste globali reali:

- **SQUADRE**: griglia principale delle squadre;
- **SOS**: tutti i giocatori con infortunio/problema fisico;
- **RUMOR**: tutte le trattative e rumors in entrata/uscita;
- **UFFICIALITÀ**: tutte le ufficialità in entrata/uscita;
- **AMICHEVOLI**: calendario globale delle amichevoli.

## Ordinamento

- `AMICHEVOLI`: ordinamento crescente per data.
- `SOS`, `RUMOR`, `UFFICIALITÀ`: ordinamento decrescente per data di aggiornamento.

## Note tecniche

- La ricerca filtra la vista attiva.
- Il service worker passa a `iosudo-shell-v620` e aggiorna JS/CSS V620.
- Restano invariati i dati condivisi `sudatori-data.json` e `manifest.json` generati in V619.
- Restano attive le live rosters introdotte in V618.

## Verifiche

```bash
node static/fanta-engine/tools/audit-iosudo-v620.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v620.js
node --check static/iosudo/sw.js
```
