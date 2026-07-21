# Overlay V748 - fix svincoli desktop/admin e checkbox admin

## Contenuto

Questo overlay corregge due problemi del sito ZonaOrientale:

1. **Descrizioni svincoli che spariscono o restano generiche** nella sezione Rose quando il runtime legge dati admin/Firebase o snapshot pubblici non allineati.
2. **Checkbox admin non cliccabili da desktop** a causa di handler/details sovrapposti o layer CSS che possono intercettare il click.

## File modificati

- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/league-config.json`
- `docs/AI_ASSISTANT_HANDOFF_CURRENT.md`
- `docs/AI_ASSISTANT_HANDOFF_V748.md`
- `docs/OVERLAY_V748_APPLY.md`

## Applicazione

Dalla root della repo:

```bash
cp -R static/* static/
cp -R docs/* docs/
```

Oppure estrai lo zip overlay dalla root della repo e fai commit.

## Verifiche

```bash
node --check static/zonaorientale/assets/app.js
```

Dopo il deploy, apri il sito con cache pulita o aggiungi temporaneamente `?v=748` alla URL.

## Note tecniche

Il JSON statico `assets/snapshots/seasons/2026-2027.json` contiene le descrizioni complete degli svincoli. Il problema nasce quando desktop/admin usa dati Firebase completi o snapshot pubblici non allineati: in quel caso alcune righe `SVINCOLO` possono avere descrizione vuota/generica. La patch V748 ripara in runtime i movimenti confrontandoli con il JSON statico per chiave stagione/squadra/tipo/data/importo/giocatore.

