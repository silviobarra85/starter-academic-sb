# Comandi Manual QA tracker V356

Aprire il sito, poi la console browser.

## Elenco check

```js
ZonaOrientaleManualQaTrackerV356.print()
```

## Segnare un check OK

```js
ZonaOrientaleManualQaTrackerV356.mark('calciomercato-feed', 'ok', 'feed e archivio caricati')
```

## Segnare un problema

```js
ZonaOrientaleManualQaTrackerV356.mark('mobile-nav', 'ko', 'menu Altro da rivedere su iPhone')
```

## Saltare un check

```js
ZonaOrientaleManualQaTrackerV356.mark('trade-real', 'skipped', 'non testato per evitare scritture Firebase')
```

## Riepilogo

```js
ZonaOrientaleManualQaTrackerV356.summary()
```

## Esportazione Markdown

```js
ZonaOrientaleManualQaTrackerV356.exportMarkdown()
```

## Reset

```js
ZonaOrientaleManualQaTrackerV356.reset()
```

## Smoke test marker

```js
ZonaOrientaleManualQaTrackerV356.runSmokeTest()
```
