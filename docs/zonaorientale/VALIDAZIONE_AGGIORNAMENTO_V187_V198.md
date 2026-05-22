# Checklist validazione aggiornamento V187-V198

## 1. Controllo tecnico base

Da root repo, dopo aver applicato l'overlay:

```bash
node --check static/zonaorientale/assets/app.js
find static/zonaorientale/assets -type f -name '*.js' -print0 | xargs -0 -n 1 node --check
find static/zonaorientale/assets -type f -name '*.json' -print0 | xargs -0 -n 1 python3 -m json.tool
```

## 2. Avvio locale

Se sei dentro `static/zonaorientale`:

```bash
cd ..
python3 -m http.server 1313 --bind 0.0.0.0
```

Aprire:

```text
http://localhost:1313/zonaorientale/
```

## 3. Checklist online finale

Da Admin:

1. apri `Admin`;
2. premi `Checklist online finale`;
3. verifica che Version/cache-buster sia allineato a V198;
4. verifica che asset pubblici e manifest siano OK.

## 4. Asset pubblici

Da Admin:

1. premi `Controlla asset pubblici`;
2. controlla che siano OK:
   - `config.json`;
   - `honor.json`;
   - manifest snapshot stagioni;
   - manifest rose;
   - manifest listoni;
   - manifest competizioni.

## 5. Rose Excel V187/V188

Da Admin → Rose e Movimenti FM:

1. prova `Converti rose e scarica overlay` con il file Excel rose;
2. verifica che lo zip contenga manifest e JSON rose;
3. verifica che i nomi squadra siano uguali a quelli dell'Excel;
4. non premere `Inizializza rose dal file statico` se non vuoi scrivere su Firebase.

## 6. Pubblicazione dati V189-V191

Da Admin:

1. verifica pannello `Pubblicazione dati`;
2. verifica `Stato Firebase / JSON`;
3. premi `Aggiorna stato pubblicazione`;
4. verifica `Procedura guidata Pubblica aggiornamenti`;
5. prova `Genera piano pubblicazione`;
6. prova i pulsanti di copia.

## 7. Dashboard presidente V192

Con utente presidente approvato:

1. login presidente;
2. apri Area squadra;
3. verifica dashboard presidente;
4. verifica azioni rapide:
   - Pagina squadra;
   - Tutte le rose;
   - Mercato.

## 8. Statistiche V193

Aprire:

```text
http://localhost:1313/zonaorientale/#stats
```

Verificare:

- metriche storiche;
- club più vincenti;
- podi Campionato;
- presidenti vincenti;
- ultimi titoli;
- FIFA Ranking.

## 9. Mobile tasto Su V194

Da mobile/DevTools mobile:

1. apri Listone, Albo, Statistiche, Archivio o Admin;
2. scorri verso il basso;
3. verifica comparsa `↑ Su`;
4. premi il tasto;
5. verifica ritorno in alto.

## 10. Confronta V195

Aprire:

```text
http://localhost:1313/zonaorientale/#compare
```

Verificare:

- selezione squadra A/B;
- metriche confronto;
- presidenti;
- titoli;
- scontri diretti;
- layout mobile.

## 11. Archivio V196

Aprire:

```text
http://localhost:1313/zonaorientale/#archive
```

Verificare:

- selezione stagione;
- squadre;
- competizioni;
- albo stagione;
- partite recenti;
- timeline;
- layout mobile.

## 12. Generatore comunicati V197

Da Admin:

1. apri `Generatore comunicati automatici`;
2. prova tutti i template;
3. cambia stagione/competizione/squadra/tono;
4. premi `Genera bozza`;
5. prova `Copia testo`;
6. prova `Inserisci nei Comunicati`;
7. controlla che il form comunicati venga compilato ma non salvato automaticamente.

## 13. Test mobile generale

Da DevTools mobile o smartphone verificare:

- Admin e pannelli nuovi;
- Dashboard presidente;
- Statistiche;
- Confronta;
- Archivio;
- Generatore comunicati;
- nessuno sforamento orizzontale;
- bottoni leggibili e cliccabili.

## 14. Git finale

Dopo validazione:

```bash
git status
git add static/zonaorientale/index.html static/zonaorientale/assets/app.js docs/zonaorientale/REFACTOR_V198.md docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_V198.md docs/zonaorientale/RELEASE_NOTES_V187_V198.md docs/zonaorientale/VALIDAZIONE_AGGIORNAMENTO_V187_V198.md
git commit -m "V198 add final release notes and validation checklist"
git push
```

Per pubblicare su master:

```bash
git checkout master
git pull --ff-only origin master
git merge --no-ff feature/zonaorientale-v187-next
git push origin master
git checkout feature/zonaorientale-v187-next
```
