# Audit competizioni - V267

Documento creato per verificare la sezione **Competizioni** prima di qualsiasi pulizia o refactor.

## Obiettivo

Evitare di perdere funzionalita collegate a competizioni, calendari, risultati, classifiche e archivio. Questa versione non rimuove codice e non modifica il comportamento runtime.

## Area analizzata

File sospetto da verificare:

```text
static/zonaorientale/assets/js/domain/competitions.js
```

Nel codice principale sono presenti funzioni inline analoghe:

```text
getCompetitionTypeOrderV52
compareCompetitionsForPublicDisplayV52
getSeasonCompetitionsForPublicDisplayV52
```

Queste funzioni inline sono usate in piu punti di `assets/app.js` per render pubblici, dashboard, archivio e viste correlate. Il modulo `domain/competitions.js` esporta helper simili, ma nella baseline corrente non risulta importato dal bootstrap principale di `app.js`.

## Valutazione

Il modulo `assets/js/domain/competitions.js` e' probabilmente legacy o preparatorio, ma **non deve essere eliminato subito**. Le competizioni sono una sezione critica e collegata a diverse aree del sito.

## Funzionalita da proteggere

Prima di ogni rimozione/refactor, verificare:

```text
Dashboard pubblica -> riepilogo competizioni
Sezione Competizioni
Pulsanti e link verso competition.html
competition.html -> calendario, risultati, classifiche
Archivio stagioni -> competizioni storiche
Admin -> gestione competizioni
Admin -> import/aggiornamento competizioni
Albo/Statistiche collegate alle competizioni
Mobile -> card/blocchi competizioni
```

## Esito V267

```text
Nessuna funzionalita rimossa.
Nessun file competizioni eliminato.
Aggiunta diagnostica window.ZonaOrientaleCompetitionsAuditV267.
Aggiornata la guida per un eventuale nuovo assistente AI.
```

## Diagnostica runtime

Da console browser:

```js
window.ZonaOrientaleCompetitionsAuditV267
```

Deve indicare:

```text
behaviorChanged: false
legacyModuleUnderReview: assets/js/domain/competitions.js
```

## Raccomandazione

La prossima modifica non dovrebbe essere la rimozione diretta del modulo, ma un test mirato:

```text
1. Aprire Dashboard pubblica.
2. Aprire Competizioni.
3. Aprire una competizione da competition.html.
4. Verificare calendario/classifica/risultati.
5. Verificare archivio stagioni.
6. Verificare Admin -> Competizioni.
```

Solo dopo questi test si puo decidere se:

```text
A) eliminare domain/competitions.js come legacy;
B) riattivarlo e usarlo come modulo canonico;
C) lasciarlo temporaneamente come file legacy documentato.
```
