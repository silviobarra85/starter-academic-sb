# REFACTOR V196 - Archivio stagioni evoluto

## Obiettivo

Aggiungere una nuova pagina pubblica, mobile-first, per consultare una stagione completa senza introdurre nuove letture Firebase.

## File modificati

- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/app.js`
- `docs/zonaorientale/REFACTOR_V196.md`
- `docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_V196.md`

## Funzionalità

Nuova pagina pubblica:

```text
/zonaorientale/#archive
```

Nome nel menu desktop:

```text
Archivio
```

Nome nel menu mobile:

```text
Altro -> Archivio stagioni
```

La pagina mostra per la stagione selezionata:

- metriche generali: squadre, competizioni, partite, giocatori
- squadre della stagione con presidente, saldo FM, stadio, numero giocatori e movimenti
- albo della stagione
- partite recenti
- competizioni con stato, partite, righe classifica e vincitore/classifica
- timeline sintetica con titoli, competizioni e comunicazioni

## Letture Firebase

La pagina non introduce nuove letture Firebase.

Usa solo dati già presenti in `state.raw`, caricati dal flusso pubblico esistente:

- JSON statici GitHub
- snapshot pubblici Firebase di fallback
- dati admin già caricati, se l'admin ha premuto `Carica dati amministrazione`

## Mobile

La pagina non usa tabelle larghe. Tutto è a card responsive:

- controlli a colonna su mobile
- card squadra a una colonna quando lo schermo è stretto
- testi lunghi a capo
- nessuno sforamento laterale previsto

## Versione

Footer aggiornato a:

```text
V196 archivio stagioni evoluto
```

Cache-buster aggiornati a:

```text
v=196
```

La checklist online finale si aspetta ora la versione `196`.

## Test

Eseguiti:

```bash
node --check static/zonaorientale/assets/app.js
find static/zonaorientale/assets -type f -name '*.js' -print0 | xargs -0 -n 1 node --check
```

## Verifiche manuali consigliate

```text
1. Aprire /zonaorientale/#archive
2. Cambiare stagione dal selettore archivio
3. Verificare squadre, competizioni, albo e partite recenti
4. Testare da mobile: Altro -> Archivio stagioni
5. Eseguire Checklist online finale
```
