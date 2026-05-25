# AI HANDOFF ZonaOrientale - V209

## Stato corrente

Versione sito: V209 - `refactor modulo dati live e archivio`.

Il progetto resta una webapp statica HTML/CSS/JS puro in:

```text
static/zonaorientale/
```

Non usare build system. Gli overlay devono mantenere la struttura:

```text
static/zonaorientale/...
docs/zonaorientale/...
```

## Regole operative importanti

A ogni overlay:

1. aggiornare la Version nel footer di `index.html`;
2. aggiornare i cache-buster `v=XXX`;
3. aggiornare la costante checklist `DEPLOY_EXPECTED_VERSION_V181`;
4. aggiungere `REFACTOR_VXXX.md`;
5. aggiungere `AI_HANDOFF_ZONAORIENTALE_VXXX.md`;
6. aggiornare `AI_HANDOFF_ZONAORIENTALE_CURRENT.md`;
7. includere comandi Git e comandi locali:

```bash
cd ..
python3 -m http.server 1313 --bind 0.0.0.0
```

## Architettura dati aggiornata

- JSON statici: dati storici/pesanti e consultazione pubblica prioritaria.
- Snapshot Firebase: fallback compatto e base per esportare JSON statici.
- Firebase live: comunicati, trasferibili, trattative/offerte.
- Firebase admin completo: solo dopo `Carica dati amministrazione`.

Comunicati e mercato non devono dipendere dagli snapshot statici perche' devono essere immediati.

## Refactor V209

Il blocco V208 in fondo ad `assets/app.js` e' stato estratto in:

```text
assets/js/refactor/live-data-archive-v209.js
```

Il modulo espone:

```js
createLiveDataArchiveRefactorV209(deps)
```

`app.js` passa al modulo tutte le dipendenze necessarie, tra cui:

- `state`;
- `loadCollection`;
- helper news;
- helper mercato;
- helper Archivio;
- render callback opzionali.

Il modulo restituisce funzioni usate per mantenere compatibilita' con i vecchi nomi V205/V208:

```js
loadLiveNewsFromFirebaseV205
scheduleLiveNewsRefreshV208
ensureLiveTransferMarketForPresidentV205
renderSeasonArchiveV196
```

## Cosa non rompere

- Il bootstrap deve restare non bloccante: prima JSON/snapshot, poi news live in background.
- Il Fantamercato deve restare lazy/live: non leggerlo per visitatori pubblici che non aprono il mercato.
- L'Archivio deve caricare lo snapshot statico della stagione selezionata.
- Non riassegnare binding importati o costanti da destructuring.
- Non normalizzare i nomi squadra nel JSON rose Excel.

## Verifiche consigliate

Desktop e mobile:

1. Dashboard pubblica;
2. News/comunicati live;
3. Albo;
4. Statistiche;
5. Confronta;
6. Archivio con cambio stagione;
7. Dashboard Presidente;
8. Mercato solo al click;
9. Admin -> Checklist online finale.
