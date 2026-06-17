# V464 - Readiness sblocco Area Squadra FantaPetillo

## Obiettivo

La V464 aggiunge nell'Admin del clone la card `Verifica sblocco Area Squadra 2026-2027`.

La card serve a controllare se i dati reali sono pronti prima di sbloccare l'Area Squadra presidenti.

## Cosa controlla

La card verifica:

- progetto Firebase target `fantapetillomantramanager`;
- stagione `2026-2027`;
- 10 squadre;
- 10 presidenti;
- 10 associazioni `seasonTeams`;
- 10 `teamUsers` con UID, teamId ed email;
- assenza di squadre o presidenti placeholder;
- assenza di riferimenti a ZonaOrientale;
- presenza consigliata degli stadi.

## Modalita di uso

La card puo lavorare in tre modi:

1. lettura Firestore live, dopo login Admin;
2. caricamento di una preview Firestore V460;
3. caricamento o incolla di uno snapshot/static JSON generato dalla V463.

## Sicurezza

La V464 e di sola lettura:

- non scrive su Firebase;
- non modifica rules;
- non modifica dati statici;
- non sblocca l'Area Squadra;
- non tocca ZonaOrientale.

Lo sblocco reale dell'Area Squadra richiedera una patch successiva, solo dopo report readiness pulito.

## Prossimo passo

Se la card non mostra errori bloccanti, si potra preparare una patch successiva per sbloccare Area Squadra in modalita controllata.
