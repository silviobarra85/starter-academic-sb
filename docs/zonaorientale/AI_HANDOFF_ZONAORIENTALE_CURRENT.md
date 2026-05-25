# AI Handoff ZonaOrientale - Current

## Versione corrente

**V208 - refactor dati live e archivio**

## Stato del progetto

Webapp statica HTML/CSS/JS puro in:

```text
static/zonaorientale/
```

Il file principale resta:

```text
static/zonaorientale/assets/app.js
```

È ancora grande e contiene molti blocchi storici Vxx. Gli ultimi refactor hanno ridotto letture Firebase e introdotto nuove viste pubbliche/admin.

## Regole operative utente

- Ogni overlay applicativo deve aggiornare la Version nel footer.
- Ogni overlay deve includere un handoff AI `AI_HANDOFF_ZONAORIENTALE_VXXX.md`.
- Ogni consegna deve includere i comandi Git.
- Ogni consegna deve includere i comandi locali:

```bash
cd ..
python3 -m http.server 1313 --bind 0.0.0.0
```

## Architettura dati

```text
JSON statici / GitHub -> dati storici, stagioni, albo, rose, competizioni, listoni
Snapshot Firebase -> fallback compatto e sorgente per esportare JSON
Firebase live -> comunicati, lista trasferibili, trattative/offerte
Firebase admin -> dati granulari solo dopo Carica dati amministrazione
```

## Ultimo intervento V208

V208 consolida i blocchi V205/V206/V207 in un unico blocco finale:

- comunicati live Firebase in background;
- Fantamercato live/lazy senza riassegnare helper `const`;
- Archivio da snapshot statici senza sottosezione Partite recenti;
- bootstrap non bloccante.

## Attenzione tecnica

Non riassegnare helper destructured const del Fantamercato, in particolare `getActiveTransferListingsV119`.

## Test minimo

```bash
node --check static/zonaorientale/assets/app.js
find static/zonaorientale/assets -type f -name '*.js' -print0 | xargs -0 -n 1 node --check
find static/zonaorientale/assets -type f -name '*.json' -print0 | xargs -0 -n 1 python3 -m json.tool
```
