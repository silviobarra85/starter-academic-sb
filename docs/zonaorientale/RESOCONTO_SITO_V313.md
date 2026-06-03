# Resoconto sito ZonaOrientale - V313

## Stato generale

ZonaOrientale Salerno e' una webapp statica HTML/CSS/JS puro sotto `static/zonaorientale/`, con documentazione in `docs/zonaorientale/` e Netlify Functions in `netlify/functions/`.

La sorgente pubblica prioritaria e' costituita da JSON statici e snapshot. Firebase resta usato per Auth, Admin, richieste, news live, trattative e dati modificabili. Netlify gestisce funzioni server-side come anteprime news e feed Calciomercato.

## Regola principale

Ogni modifica deve preservare le funzionalita esistenti. Prima di refactor o pulizie bisogna dichiarare:

- funzionalita a rischio;
- come vengono preservate;
- test da eseguire.

## Aree pubbliche

- Dashboard stagione corrente.
- News e comunicati con link diretto/hash.
- Anteprime WhatsApp news tramite Netlify Function `news-share`.
- Rose e schede squadra.
- Fantamercato interno della lega.
- Calciomercato notizie RSS automatico.
- Listone con filtri, colonna `Modifica`, usciti storici, ricerca, export solo Admin.
- Competizioni, calendari, risultati e classifiche.
- Albo d'Oro, palmares, FIFA Ranking.
- Statistiche storiche.
- Archivio stagioni.
- Confronta squadre.
- Regolamento.
- Navigazione mobile con bottom nav, menu Altro e pulsante Su.

## Presidente

- Login Firebase email/password e Google.
- Dashboard Presidente.
- Pulsante account personalizzato `Pres. Cognome`.
- Trattative inviate/ricevute con badge notifiche.
- Comunicati squadra.
- Comunicati avvenuto scambio via `teamRequests` + EmailJS + approvazione Admin.
- Svincola Giocatori via EmailJS, senza scrittura Firebase.
- Fantamercato presidente.

## Admin

- Modalita Admin leggero e caricamento completo con `Carica dati amministrazione`.
- Titolo Admin sempre in cima e sezioni ridotte da V313.
- Accetta utenti.
- Richieste presidenti.
- News/comunicati.
- Generatore comunicati automatici.
- Gestione stagioni, presidenti, squadre, squadre stagionali e stadi.
- Rose e movimenti FM.
- Listone Excel: formati storico e Classic.
- Competizioni, calendari, risultati, import statico.
- FIFA Ranking, albo e snapshot honor.
- Snapshot pubblici.
- Backup Firebase.
- Diagnostica dati.
- Stato Firebase/JSON e procedura guidata pubblicazione.

## Calciomercato

- Sezione pubblica `Calciomercato`.
- Fonti configurabili in `assets/calciomercato/links.json`.
- Recupero automatico server-side via `netlify/functions/calciomercato-feed.js`.
- Supporto feed singolo o multiplo per fonte.
- Fallback statico manuale.
- Card orizzontali con immagine, fonte, data/ora Europe/Rome, squadre, topic, stato, giocatori interessati e link articolo.

## Tema e UI

- Tema Light sospeso temporaneamente.
- Dark mode unico attivo.
- Toggle tema nascosto.
- CSS refactor stabile sotto `assets/css/refactor/`.
- Mobile/rose/tabelle isolati nei CSS refactor.

## Rischi principali da monitorare

- `assets/app.js` e' ancora un file storico molto grande con override Vxxx.
- Le funzioni legacy possono essere fallback ancora utili.
- Non eliminare moduli o CSS senza audit e test.
- Calciomercato automatico richiede Netlify Function: in locale con `python3 -m http.server` resta fallback statico.
- I dati pubblici devono essere rigenerati come JSON statici dopo modifiche Admin.

## Test minimi prima di push o merge

```bash
static/zonaorientale/tools/check-zonaorientale.sh
node --check netlify/functions/calciomercato-feed.js
```

Test browser:

- Home.
- News e link WhatsApp.
- Calciomercato.
- Listone pubblico/Admin.
- Rose e pagina squadra.
- Dashboard Presidente.
- Admin leggero e Admin completo.
- Richieste presidenti.
- Diagnostica dati.
- Competizioni.
- Mobile nav/menu Altro/pulsante Su.
