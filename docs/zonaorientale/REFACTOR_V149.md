# V149 - Rifinitura finale mobile

Data: 2026-05-20
Branch: `feature/zonaorientale-competizioni-statiche`

## Obiettivo

Chiudere il ciclo di nuova interfaccia mobile con una rifinitura generale, senza toccare la versione desktop e senza modificare logica dati/Firebase.

## File modificati

```text
static/zonaorientale/index.html
```

## File nuovi

```text
static/zonaorientale/assets/css/mobile-final-polish-v149.css
```

## Modifiche

- Aggiunto CSS finale mobile-only.
- Uniformate spaziature tra sezioni mobile.
- Migliorati touch target di pulsanti e link.
- Migliorata gestione overflow orizzontale delle tabelle.
- Migliorata leggibilita di form, select, badge e avvisi su smartphone.
- Rafforzata la bottom navigation mobile.
- Aggiornato cache busting a `v=149`.
- Aggiornato footer a V149.

## Note tecniche

Il nuovo CSS e racchiuso in media query mobile e usa prevalentemente `body.is-mobile-ux`, quindi non deve influenzare desktop.

Non sono state modificate:

```text
Firebase
Firestore Rules
app.js
competition.html
struttura dati
render desktop
```

## Test consigliati

```text
/zonaorientale/#dashboard
/zonaorientale/#clubs
/zonaorientale/#teamarea
/zonaorientale/#fantamercato
/zonaorientale/#competitions
/zonaorientale/#listone
/zonaorientale/#news
/zonaorientale/#honor
/zonaorientale/#regolamento
/zonaorientale/#admin
```

Da desktop verificare che la resa sia invariata.
