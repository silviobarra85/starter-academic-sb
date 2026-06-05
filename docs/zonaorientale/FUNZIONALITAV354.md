# FUNZIONALITAV354 - Consolidamento ciclo cleanup/refactor

Versione: V354  
Tipo: consolidamento documentale/audit  
Impatto funzionale: nessun cambio intenzionale  
File storico protetto non modificato: `docs/zonaorientale/FUNZIONALITA'.md`

## Obiettivo

La V354 chiude il ciclo di refactor e cleanup iniziato con V333 e arrivato a V353. Non rimuove file, non cambia flussi utente e non modifica dati statici o funzioni server. Serve a lasciare al futuro assistente AI una mappa chiara di cosa e stato fatto, cosa e rimasto protetto e quali interventi possono essere valutati in futuro.

## Funzionalita da preservare

- Calciomercato con feed RSS, pagine TMW squadra, archivio statico e download Solo Admin.
- Card articoli compatte, fallback favicon/fonte/TMW testuale e tag giocatore.
- Timeline giocatore in modal chiudibile con X, click sfondo ed Escape.
- Matching giocatore conservativo basato sull'ultimo Listone della stagione selezionata.
- Disambiguazione maiuscole/minuscole per evitare falsi positivi come `giovane` aggettivo vs `Giovane` giocatore.
- Filtri Calciomercato: Cerca, Da, A, squadra, topic, fonte.
- Pannello Solo Admin Calciomercato con espandi/riduci e archivio statico.
- Admin generale e Diagnostica dati con timestamp ultimo aggiornamento.
- Listone, filtro Modifiche, export CSV, manifest/listoni statici.
- Rose, Dashboard Presidente e Fantamercato interno.
- Notifiche trattative reali e simulatore locale `ZonaOrientaleTradeSimulatorV255`.
- Azioni simulate Accetta/Rifiuta senza scrittura Firebase.
- Auth, Firebase, EmailJS e Netlify Functions.
- News/share WhatsApp.
- Mobile bottom navigation, menu Altro e layout mobile forzato senza switch desktop.
- `competition.html` e `player.html`.

## Stato cleanup/refactor

Completati nel ciclo V333-V353:

- CSS Listone separato dal CSS mobile generico.
- Helper immagini Calciomercato estratti.
- Modulo player Calciomercato aggiornato fino a V340.
- Renderer card Calciomercato estratto.
- Filtri Calciomercato estratti.
- Pannello Solo Admin Calciomercato estratto.
- Bridge helper condivisi aggiunto.
- Vecchi CSS refactor e mobile hotfix rimossi in modo controllato.
- Vecchi moduli player Calciomercato rimossi in modo controllato.
- Vecchio helper condiviso V294 rimosso in modo controllato.
- Duplicati simulatori trade rimossi lasciando attivo V255.
- Audit eseguiti su workflow pubblicazione Admin, tema Light sospeso e modulo domain/competitions.

## Stato file ancora da valutare

Rimangono volutamente non rimossi:

- `assets/js/refactor/admin-publication-workflow-v213.js`: non importato, ma da rimuovere solo dopo test manuale Admin pubblicazione.
- `assets/css/refactor/theme-light-suspended.css`: archivio/rollback tema Light, non importato.
- `assets/js/domain/competitions.js`: duplicato storico non importato, ma da rimuovere solo dopo test manuale completo su Dashboard Competizioni e `competition.html`.

## Verifiche V354

- `DEPLOY_EXPECTED_VERSION_V181 = "354"`.
- Cache-buster HTML e import JS allineati a `?v=354`.
- Marker runtime `window.ZonaOrientaleRefactorConsolidationV354`.
- Tool `tools/audit-refactor-consolidation-v354.mjs`.
- Documenti V354 presenti.

## Prossime attivita consigliate

Prima di nuove rimozioni: eseguire test manuale completo su Calciomercato, Admin, Listone, Rose, Dashboard Presidente, Fantamercato, simulatore trade e pagine mobile.

Poi valutare, solo in task separati:

1. eventuale cleanup `domain/competitions.js`;
2. eventuale cleanup `theme-light-suspended.css`;
3. eventuale cleanup `admin-publication-workflow-v213.js`;
4. nuovo ciclo di refactor solo su sezioni piccole e isolate.
