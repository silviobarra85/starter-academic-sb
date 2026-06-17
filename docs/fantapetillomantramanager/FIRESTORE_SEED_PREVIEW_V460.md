# V460 - Preview seed Firestore FantaPetilloMantraManager

## Obiettivo

La V460 aggiunge una card Admin per trasformare il seed JSON validato dalla V459 in una preview dei documenti Firestore da creare nel progetto Firebase dedicato `fantapetillomantramanager`.

La card non scrive su Firebase. Produce solo file scaricabili e una checklist manuale.

## Flusso consigliato

1. Aprire `/fantapetillomantramanager/#admin`.
2. Nel selettore Admin mostrare `Validatore dati reali 2026-2027`.
3. Validare CSV/JSON reale e scaricare `fantapetillo-real-data-seed-v459.json`.
4. Nel selettore Admin mostrare `Preview seed Firestore 2026-2027`.
5. Caricare o incollare il seed JSON V459.
6. Verificare errori/avvisi.
7. Scaricare:
   - `fantapetillo-firestore-seed-preview-v460.json`;
   - `fantapetillo-firestore-console-checklist-v460.md`.

## Documenti previsti

La preview genera una proposta per:

- `leagueSettings/current`;
- `seasons/2026-2027`;
- `presidents/{presidentId}`;
- `teams/{teamId}`;
- `seasonTeams/{seasonId-teamId}`;
- `stadiums/{teamId}`;
- `teamUsers/{uid}`, solo se l'UID Authentication e' stato compilato.

## Guardrail

- Target Firebase obbligatorio: `fantapetillomantramanager`.
- Nessuna scrittura automatica su Firebase.
- Nessun uso del Firebase ZonaOrientale.
- Area Squadra resta protetta finche' non sono disponibili dati reali, utenti Authentication e snapshot pubblici.

## Stato dopo V460

La lega FantaPetillo e' pronta a preparare il primo import manuale/revisionato dei dati reali. Lo sblocco Area Squadra resta rimandato a una patch successiva.
