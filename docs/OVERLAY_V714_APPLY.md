# Overlay ioSudo V714

Aggiornamento generato da Excel `fantacalcio_serie_a_2026_27_aggiornato_2026-07-18_aggiornamento_globale_v68.xlsx`.

## Applicazione

Dalla root del progetto:

```bash
cp -R overlay_iosudo_v714/static/* static/
cp -R overlay_iosudo_v714/docs/* docs/
```

Poi verificare:

```bash
node --check static/fanta-engine/js/apps/iosudo-app-v714.js
node --check static/iosudo/sw.js
node static/fanta-engine/tools/audit-iosudo-v714.mjs
```

## Note operative

- Versione dati e shell aggiornata a V714.
- `K. Thuram` normalizzato in `Khephren Thuram`.
- Badge SOS agganciato negli XI tramite nome canonico del giocatore.
- Ederson aggiornato come rinnovo ufficiale Atalanta; rumor attivi su Ederson chiusi.
- Aggiunte le voci mercato V68 non ufficiali da Di Marzio.
- Controllate le amichevoli: nessun nuovo tabellino giocato da aggiungere rispetto alla V713.
