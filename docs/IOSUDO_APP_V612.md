# ioSudo - V612

La V612 rifinisce la home di **ioSudo** colorando le card delle squadre con righe ispirate ai colori sociali.

## Novita

- Card squadre con stile a righe.
- Testi leggibili secondo richiesta:
  - Atalanta/Inter: nero-azzurro con scritte bianche;
  - Bologna/Cagliari/Genoa: rosso-blu con scritte bianche;
  - Lazio/Napoli: azzurro con scritte nere;
  - Como: azzurro scuro con scritte bianche;
  - Juventus/Udinese: nero-bianco con scritte rosse;
  - Lecce/Roma: giallo-rosso con scritte nere;
  - Frosinone: giallo con scritta blu scuro;
  - Monza: bianco-rosso con scritte nere;
  - Fiorentina: viola con scritte bianche;
  - Milan: rosso-nero con scritte bianche;
  - Parma: giallo-blu con scritte bianche;
  - Torino: granata scuro con scritte bianche;
  - Venezia: arancio-verde con scritte nere;
  - Sassuolo: nero-verde con scritte bianche.

## Dati

ioSudo continua a leggere gli stessi dati della sezione **Per i SUDATORI**:

```text
static/fanta-engine/data/sudatori/current/manifest.json
static/fanta-engine/data/sudatori/current/sudatori-data.json
```

## Verifica

```bash
node static/fanta-engine/tools/audit-iosudo-v612.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v612.js
node --check static/iosudo/sw.js
```
