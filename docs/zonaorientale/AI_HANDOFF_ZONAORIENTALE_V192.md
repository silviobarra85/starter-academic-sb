# AI Handoff ZonaOrientale - V192

## Stato generale

Il progetto e una webapp statica in `static/zonaorientale`, con Firebase lato browser e dati pubblici sempre piu spostati su JSON statici GitHub.
La versione corrente dopo questo overlay e **V192**.

## Branch corrente di lavoro

L'utente sta lavorando sul branch:

```bash
feature/zonaorientale-v187-next
```

## Regole da rispettare

1. Ogni overlay deve aggiornare la Version nel footer di `index.html`.
2. Ogni overlay deve aggiornare i cache-buster principali a `v=<versione>`.
3. Ogni overlay deve includere anche un handoff AI aggiornato.
4. Le nuove funzioni devono essere fruibili da mobile.
5. Non aumentare letture Firebase pubbliche senza motivo.
6. Per il sito locale ricordare sempre:

```bash
cd ..
python3 -m http.server 1313 --bind 0.0.0.0
```

poi:

```text
http://localhost:1313/zonaorientale/
```

## Cosa ha aggiunto V192

V192 introduce una **Dashboard presidente evoluta** dentro `Area squadra` per presidenti approvati.

Il pannello viene iniettato da `app.js` con funzioni `V192`:

- `renderPresidentDashboardV192`
- `injectPresidentDashboardV192`
- `injectPresidentDashboardStylesV192`

La dashboard mostra:

- saldo FM
- conteggio rosa
- stato mercato/trattative in modalita lazy
- ultimi movimenti FM
- partite recenti/programmate della squadra
- comunicati squadra
- azioni rapide: Pagina squadra, Tutte le rose, Mercato

## Aspetto tecnico importante

La dashboard **non carica Firebase** direttamente e non chiama il loader del Fantamercato.
Le metriche mercato/trattative usano i dati solo se gia presenti in memoria.
Se il mercato non e ancora stato aperto, mostrano `lazy`.

Questo e coerente con le ottimizzazioni V170+.

## Punti delicati

- Non trasformare la dashboard in un trigger di letture Firebase.
- Non forzare `loadTransferMarketCollectionsV119()` all'avvio dell'Area squadra.
- Se si aggiungono nuove metriche, usare prima gli snapshot/dati gia presenti.
- Per azioni rapide, usare `data-v42-page-link` o `data-open-team-profile` per restare coerenti con la SPA.

## Test minimi consigliati

Da desktop e mobile:

1. Login presidente approvato.
2. Apri `Area squadra`.
3. Verifica il nuovo pannello Dashboard presidente.
4. Verifica che i bottoni aprano Pagina squadra, Tutte le rose e Mercato.
5. Verifica che il mercato resti lazy fino al click su Mercato.
6. Login admin e Checklist online finale.

## Comandi Git suggeriti

```bash
git status
git add static/zonaorientale/index.html static/zonaorientale/assets/app.js docs/zonaorientale/REFACTOR_V192.md docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_V192.md
git commit -m "V192 add president dashboard"
git push
```
