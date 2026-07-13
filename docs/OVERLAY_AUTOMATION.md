# Automazione applicazione overlay

Questo repository supporta l'applicazione automatica degli overlay tramite GitHub Actions.

## Uso da smartphone

1. Aprire GitHub dal browser.
2. Entrare nel repository.
3. Aprire `incoming/overlays/`.
4. Usare `Add file -> Upload files`.
5. Caricare lo zip overlay generato dall'assistente.
6. Fare commit.
7. Il workflow `Apply Overlay` parte automaticamente.

Il workflow:

- decomprime lo zip;
- copia `static/`, `docs/`, `.github/`, `tools/` e `incoming/` se presenti;
- esegue gli audit disponibili;
- esegue `node --check` sui JS correnti;
- rimuove lo zip processato;
- committa e pusha le modifiche sul branch corrente.

## Uso manuale da Actions

Da `Actions -> Apply Overlay -> Run workflow` si puo indicare anche un percorso specifico, per esempio:

```text
incoming/overlays/fantacalcio_overlay_sudatori_iosudo_v642.zip
```

## Nota su ioSudo

L'app ioSudo non va reinstallata dopo gli aggiornamenti. Dopo il deploy basta chiuderla e riaprirla; se resta in cache, aprirla da browser e fare refresh.
