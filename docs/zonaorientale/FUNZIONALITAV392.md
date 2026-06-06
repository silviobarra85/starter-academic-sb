# FUNZIONALITA V392 - Soccer Data import HTML FBref fallback

Data: 06/06/2026
Versione sito: V392 Soccer Data import HTML FBref

## Scopo

La V392 interviene solo sulla sezione Soccer Data e mantiene intatte le funzionalita esistenti del sito. La modifica aggiunge un fallback admin per recuperare le statistiche FBref quando il recupero server-side della V391 riceve risposta 403 da FBref.

## Cosa cambia

- Soccer Data resta pubblica in sola lettura.
- I comandi amministrativi restano dentro Soccer Data e sono disponibili solo agli admin.
- Per ogni giocatore mappato FBref l'admin vede anche il pulsante `Importa HTML FBref`.
- Il pulsante apre un pannello locale dove incollare il sorgente HTML completo della pagina giocatore FBref.
- Il parser locale legge tutte le tabelle presenti nel sorgente, incluse quelle eventualmente commentate nell'HTML.
- Il payload viene salvato nella collection Firebase `soccerDataPlayerStats`, usando lo stesso formato compatibile con export JSON statico della V391.
- Il pulsante server `Recupera server FBref` resta disponibile, ma in caso di 403 suggerisce il fallback manuale.

## Flusso admin consigliato

1. Vai in Soccer Data.
2. Sulla riga del giocatore clicca `Recupera server FBref`.
3. Se FBref restituisce 403, clicca `Importa HTML FBref`.
4. Apri FBref dal pulsante nel pannello.
5. Usa visualizza sorgente pagina e copia tutto l'HTML.
6. Incolla nel pannello e premi `Salva su Firebase`.
7. Dopo aver importato i giocatori necessari, clicca `Scarica stats Firebase JSON`.
8. Pubblica il JSON statico nella repo nella fase successiva.

## Vincoli rispettati

- Nessuna modifica a mapping V383.
- Nessuna modifica a Comunicati, Rose, Calciomercato, Competizioni, Snapshot o Area squadra.
- Nessuna modifica a Firebase Rules.
- Nessuno scraping live pubblico.
- Nessun recupero massivo automatico.
- Nessun dato statistico inventato.
- `FUNZIONALITA'.md` non modificato.

## Test

- `node tools/audit-soccer-data-manual-html-import-v392.mjs`
- `node tools/audit-soccer-data-fbref-stats-pipeline-v391.mjs`
- `node tools/audit-soccer-data-public-readonly-v389.mjs`
- `node tools/audit-soccer-data-fbref-batch-v383.mjs`
- `node --check assets/app.js`
- `node --check ../netlify/functions/fbref-player-stats.js`
- `find assets -name '*.js' -type f -print0 | xargs -0 -n 1 node --check`
- `unzip -t zonaorientale_v392_soccer_data_import_html_fbref.zip`
