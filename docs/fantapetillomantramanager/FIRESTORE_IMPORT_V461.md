# V461 - Import controllato Firestore FantaPetilloMantraManager

La V461 aggiunge una card Admin per importare nel progetto Firebase dedicato `fantapetillomantramanager` il seed preview generato dalla V460.

## Card Admin

Percorso:

```text
/fantapetillomantramanager/#admin
```

Card selezionabile dal menu Admin:

```text
Import controllato Firestore 2026-2027
```

## Flusso operativo

1. Compilare i dati reali con il template V458.
2. Validarli con il validatore V459.
3. Generare la preview Firestore con la card V460.
4. Caricare `fantapetillo-firestore-seed-preview-v460.json` nella card V461.
5. Verificare collection, numero documenti e avvisi.
6. Spuntare tutte le conferme obbligatorie.
7. Digitare `IMPORTA FANTAPETILLO`.
8. Eseguire l'import.
9. Scaricare il report `fantapetillo-firestore-import-report-v461.json`.

## Sicurezza

La card V461:

- accetta solo target project `fantapetillomantramanager`;
- consente solo collection esplicite: `leagueSettings`, `seasons`, `presidents`, `teams`, `seasonTeams`, `stadiums`, `teamUsers`;
- verifica che l'utente corrente abbia il documento `admins/{uid}`;
- usa solo `setDoc(..., { merge: true })`;
- non cancella documenti;
- non usa Firebase ZonaOrientale.

## Stato dopo V461

Dopo l'import, FantaPetillo puo' avere dati base reali in Firestore, ma l'Area Squadra resta ancora protetta fino a verifica di `teamUsers`, snapshot pubblici e flussi presidente.
