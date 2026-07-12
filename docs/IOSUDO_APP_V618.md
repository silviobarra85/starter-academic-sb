# ioSudo V618

V618 aggiorna ioSudo su due aspetti:

1. lettura live delle rose fantacalcio dalla stessa fonte della sezione Rose;
2. card squadra differenziate anche quando più squadre condividono gli stessi colori.

## Rose live

ioSudo legge sempre il JSON Sudatori per mercato, SOS, XI e amichevoli, ma sovrascrive a runtime l'assegnazione fantasy del giocatore leggendo:

```text
/<lega>/assets/rose/manifest.json
/<lega>/assets/rose/<ultimo-file-2026-2027>.json
```

La lega viene risolta da:

- querystring `?league=zonaorientale` o `?league=fantapetillomantramanager`;
- path `/zonaorientale/iosudo/` o `/fantapetillomantramanager/iosudo/`;
- fallback `zonaorientale`.

## Card squadre

Le card non usano più solo gruppi generici come `rossoblu` o `nerazzurro`; V618 restituisce classi individuali:

- `iosudo-team-theme-bologna`
- `iosudo-team-theme-cagliari`
- `iosudo-team-theme-genoa`
- `iosudo-team-theme-atalanta`
- `iosudo-team-theme-inter`
- ecc.

In questo modo squadre con colori uguali hanno pattern differenti.

## Cache/PWA

Il service worker passa a `iosudo-shell-v618` e usa network-first anche per `assets/rose`, così le modifiche alle rose non restano bloccate dalla cache della PWA.
