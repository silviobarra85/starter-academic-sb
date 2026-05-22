# AI HANDOFF ZonaOrientale - V195

## Stato corrente
Versione sito: **V195 confronta squadre**.

## Ultima modifica
Aggiunta pagina pubblica `#compare` / **Confronta squadre**.

## File principali modificati
- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/app.js`

## Cosa fa la V195
La pagina confronta due club storici usando dati gia' caricati da JSON/snapshot o fallback esistenti:
- titoli principali
- podi campionato
- stagioni presenti
- ranking FIFA
- partite giocate e gol
- presidenti storici
- ultimi titoli
- scontri diretti

## Vincoli importanti
- Non deve aggiungere letture Firebase.
- Non deve caricare il Fantamercato.
- Deve funzionare da mobile senza tabelle larghe.
- La selezione squadre e' salvata in `localStorage` con chiave `zonaOrientaleTeamCompareV195`.

## API debug esposta
```js
ZonaOrientaleTeamCompare.render()
ZonaOrientaleTeamCompare.profiles()
ZonaOrientaleTeamCompare.direct(leftProfile, rightProfile)
```

## Prossime funzionalita' consigliate
- V196: Archivio stagioni migliorato, con timeline stagione e riepilogo squadre/competizioni.
- V197: Generatore comunicati automatici da risultati/mercato.
- V198: Centro notifiche presidente/admin.

## Comandi locali da ricordare
Se ci si trova in `static/zonaorientale`:
```bash
cd ..
python3 -m http.server 1313 --bind 0.0.0.0
```
URL: `http://localhost:1313/zonaorientale/`.

## Git
Commit suggerito:
```bash
git add static/zonaorientale/index.html static/zonaorientale/assets/app.js docs/zonaorientale/REFACTOR_V195.md docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_V195.md
git commit -m "V195 add team comparison page"
git push
```
