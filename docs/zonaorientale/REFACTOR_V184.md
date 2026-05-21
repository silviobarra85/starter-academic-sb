# V184 - Honor mobile FIFA dark section

## Obiettivo
Allineare graficamente la sezione **FIFA Ranking** della pagina **Albo d'Oro e Palmarès** alle tabelle scure di competizione e correggere la spaziatura del titolo **Palmarès per competizione**.

## File modificati

- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/assets/styles.css`
- `static/zonaorientale/assets/css/mobile-suite-v168.css`

## Modifiche

- Aggiunta la classe `fifa-ranking-section-v184` al blocco FIFA Ranking nei due render pubblici dell'Albo:
  - render da dati runtime
  - render da snapshot statico/Firebase
- La sezione FIFA Ranking ora usa sfondo scuro, testo chiaro e intestazioni verdi coerenti con i blocchi Campionato, Coppa Italia e Champions League.
- Il titolo `Palmarès per competizione` ora ha padding orizzontale del blocco, quindi non resta più a ridosso del bordo.
- Aggiornati cache-buster e footer a V184.
- Aggiornato il valore atteso della checklist deploy a V184.

## Test eseguiti

- `node --check assets/app.js`
- check sintassi JS su tutti i file `assets/**/*.js`
- validazione JSON su tutti i file `assets/**/*.json`
- verifica asset principali via server locale

## Note
La modifica è solo di markup/CSS e non aggiunge letture Firebase.
