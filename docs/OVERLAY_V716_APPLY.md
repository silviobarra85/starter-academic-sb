# Overlay ioSudo V716

Base: V715. Sorgente dati: `fantacalcio_serie_a_2026_27_aggiornato_2026-07-18_aggiornamento_globale_v71(1).xlsx`.

## Applicazione

Dalla root del sito:

```bash
unzip overlay_iosudo_v716.zip
cp -R overlay_iosudo_v716/static/* static/
cp -R overlay_iosudo_v716/docs/* docs/
node --check static/fanta-engine/js/apps/iosudo-app-v716.js
node --check static/iosudo/sw.js
node static/fanta-engine/tools/audit-iosudo-v716.mjs
```

## Note

- Applicati i 10 alias confermati in V716.
- Aggiunto Casale tra SOS/monitoraggi Bologna.
- Rafforzati Thuram, De Gea, Chakvetadze e Holm.
- Aggiunta amichevole Atalanta-Athletic Club del 14/08, senza tabellino giocatori.
- Nessun rumor attivo su giocatore con ufficialità attiva.
