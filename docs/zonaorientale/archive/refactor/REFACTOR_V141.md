# V141 - Mobile UI unificata

Data: 2026-05-20
Branch consigliato: `feature/zonaorientale-competizioni-statiche`

## Obiettivo

Consolidare in un unico overlay le prime migliorie della nuova interfaccia mobile, senza modificare la resa desktop.

## Modifiche

- Nuova bottom navigation mobile:
  - Home
  - Squadra
  - Mercato
  - Coppe
  - Altro
- Fantamercato mobile in stile marketplace:
  - tabella desktop invariata;
  - da mobile la lista viene mostrata come card;
  - ogni card mostra giocatore, squadra, ruolo, costo, condizioni e azione.
- Area squadra mobile più leggibile con pannelli a blocchi.
- Admin mobile leggermente più compatto e leggibile.
- CSS nuovo isolato in `assets/css/mobile-unified-ui-v141.css`.

## Note tecniche

- Il desktop resta invariato perché il CSS V141 è attivo solo in mobile UX.
- La tabella Fantamercato resta presente e invariata per desktop.
- Le card mobile riusano gli stessi attributi `data-transfer-*`, quindi i listener esistenti continuano a gestire Modifica, Togli e Fai proposta.
- Nessuna modifica a Firebase o Firestore Rules.

## File coinvolti

```text
static/zonaorientale/index.html
static/zonaorientale/assets/app.js
static/zonaorientale/assets/css/mobile-unified-ui-v141.css
```

## Test consigliati

```text
/zonaorientale/#dashboard
/zonaorientale/#fantamercato
/zonaorientale/#teamarea
/zonaorientale/#competitions
/zonaorientale/#admin
```

Da verificare soprattutto da smartphone:

- bottom navigation;
- apertura Area squadra;
- apertura Fantamercato;
- card giocatori trasferibili;
- tasti Fai proposta / Modifica / Togli;
- Admin mobile.
