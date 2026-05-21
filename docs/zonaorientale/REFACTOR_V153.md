# V153 - Mobile Coppe squadre su due righe

Data: 2026-05-21
Branch: `feature/zonaorientale-competizioni-statiche`

## Obiettivo

Migliorare la leggibilita delle partite nella sezione mobile `Coppe` / `Competizioni`, senza toccare la vista desktop e senza modificare la pagina singola competizione.

## Modifiche

- Ogni partita nella sezione mobile Competizioni mostra le due squadre una sopra l'altra.
- Ogni partita mostra sempre data e risultato/stato:
  - partita giocata: data + risultato;
  - partita non giocata: data + `Da disputare`.
- La modifica e limitata alla lista mobile generata nella sezione `#competitions`.
- La pagina `competition.html` non viene modificata.

## File

- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/assets/css/mobile-hotfix-v153.css`

## Test consigliati

```bash
cd static
python3 -m http.server 1313 --bind 0.0.0.0
```

Da smartphone:

```text
/zonaorientale/#competitions
```

Verificare:

- squadre su due righe;
- data visibile;
- risultato visibile per partite giocate;
- `Da disputare` per partite non giocate;
- desktop invariato.
