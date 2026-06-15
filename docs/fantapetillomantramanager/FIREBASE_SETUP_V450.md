# Firebase V450 - Admin bootstrap FantaPetilloMantraManager

Stato: primo admin creato manualmente e Admin del clone pronto per il bootstrap controllato.

## Risposta sulla scelta delle rules

Si: per il clone conviene usare rules derivate da quelle complete di ZonaOrientale, non le rules semplificate V449.

La V449 serviva solo per collegare Firebase in modo prudente. In V450 il file consigliato e':

```text
static/fantapetillomantramanager/tools/firestore-rules-v450.rules
```

Questo file e' derivato dalle rules complete ZonaOrientale V393 e mantiene le stesse collection/permessi principali, ma viene pubblicato nel progetto Firebase separato `fantapetillomantramanager`.

## Cosa copiare nella console Firebase

Apri:

```text
Firestore Database -> Regole
```

Sostituisci le rules con il contenuto di:

```text
static/fantapetillomantramanager/tools/firestore-rules-v450.rules
```

Poi pubblica.

## Stato runtime V450

- Admin bootstrap abilitato.
- Login/Admin non sono piu nascosti dal guard runtime.
- Area Squadra presidenti resta nascosta/guardata fino a dati reali e `teamUsers`.
- Il clone resta `noindex,nofollow` e con banner bootstrap.
- ZonaOrientale resta sul suo Firebase `zonaorientale-d07af`.

## Primo controllo manuale

1. Apri `/fantapetillomantramanager/`.
2. Clicca `Area admin`.
3. Accedi con l'utente creato in Authentication.
4. Se `admins/{uid}` e' corretto, il pannello Admin deve sbloccarsi.
5. Non usare ancora Area Squadra presidenti.
