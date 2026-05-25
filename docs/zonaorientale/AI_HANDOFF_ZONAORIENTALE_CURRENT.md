# AI HANDOFF ZonaOrientale - Current

Versione corrente: **V210 - refactor comunicati admin**.

## Architettura dati

- Dati storici/pesanti: JSON statici e snapshot statici su GitHub.
- Fallback: snapshot Firebase pubblici.
- Dati live: comunicati, lista trasferibili e trattative da Firebase.
- Admin completo: letture granulari Firebase solo dopo `Carica dati amministrazione`.

## Moduli recenti

- `assets/js/refactor/live-data-archive-v209.js`: dati live non bloccanti e Archivio da snapshot.
- `assets/js/refactor/admin-communication-generator-v210.js`: Generatore comunicati automatici admin.

## Regole operative importanti

- Aggiornare sempre Version footer e cache-buster ad ogni overlay.
- Includere sempre handoff AI per ogni overlay.
- Considerare sempre mobile/responsive nelle nuove funzionalita'.
- Per dati che devono essere immediati usare Firebase live, non JSON/static snapshot.
- Per dati storici usare JSON/static snapshot prima di Firebase.

## Comandi locali

Se sei in `static/zonaorientale`:

```bash
cd ..
python3 -m http.server 1313 --bind 0.0.0.0
```

## Test minimi

```bash
node --check static/zonaorientale/assets/app.js
find static/zonaorientale/assets -type f -name '*.js' -print0 | xargs -0 -n 1 node --check
find static/zonaorientale/assets -type f -name '*.json' -print0 | xargs -0 -n 1 python3 -m json.tool
```

## Prossimo refactor suggerito

Estrarre in un modulo dedicato le pagine pubbliche Statistiche/Confronta, incluse le correzioni da honor snapshot V199/V200.
