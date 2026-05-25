# AI HANDOFF ZONAORIENTALE - V194

## Stato corrente

La versione corrente e' **V194 - tasto Su mobile globale**.

Il sito e' una webapp statica in:

```text
static/zonaorientale/
```

Stack: HTML/CSS/JS puro, Firebase lato browser, JSON statici GitHub per ridurre le letture Firestore.

## Ultima modifica

V194 aggiunge un pulsante mobile globale `Su` creato dinamicamente in `assets/app.js`.

Funzioni principali aggiunte:

```text
ensureMobileGlobalTopButtonV194
updateMobileGlobalTopButtonV194
scheduleMobileGlobalTopButtonUpdateV194
injectMobileGlobalTopStylesV194
```

Oggetto debug esposto:

```js
window.ZonaOrientaleMobileTop
```

## Comportamento

- Il pulsante compare solo su mobile.
- Compare solo se la pagina attiva e' lunga e se l'utente ha scrollato.
- Non legge Firebase.
- Non modifica dati.
- Usa scroll smooth e tenta di riportare il focus sul titolo della pagina attiva.

## Vincoli importanti

- Ad ogni overlay aggiornare sempre il footer `Version`.
- Aggiornare i cache-buster in `index.html`.
- Aggiornare `DEPLOY_EXPECTED_VERSION_V181` in `assets/app.js`.
- Ogni overlay deve includere anche un handoff AI aggiornato.
- Considerare sempre mobile e riduzione letture Firebase.

## Comandi locali richiesti dall'utente

Se si e' dentro `static/zonaorientale`:

```bash
cd ..
python3 -m http.server 1313 --bind 0.0.0.0
```

Poi aprire:

```text
http://localhost:1313/zonaorientale/
```

## Prossimo step suggerito

V195 potrebbe introdurre una **Hall of Fame/record storici** piu' ricca oppure migliorare le statistiche V193 con filtri per competizione/stagione.
