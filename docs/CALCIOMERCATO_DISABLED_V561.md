# V561 - Calciomercato disattivato

## Obiettivo

Ridurre il lavoro in apertura dei siti rimuovendo la sezione Calciomercato pubblica e impedendo il caricamento/recupero degli articoli da siti esterni o archivi statici.

## Ambito

Patch multi-lega applicata a:

- `static/zonaorientale/`
- `static/fantapetillomantramanager/`
- `netlify/functions/calciomercato-feed.js`

## Modifiche runtime

- Rimossa la voce Calciomercato dalla nav desktop.
- Rimossa la voce Calciomercato dal menu mobile Altro.
- Rimossa la sezione HTML `data-page="calciomercato"` dalle due home.
- Rimosso il caricamento CSS dedicato `calciomercato.css` dalle due home.
- Rimossi i link Calciomercato dalle pagine `player.html` e `competition.html` delle due leghe.
- Sostituiti gli import statici dei moduli Calciomercato in `assets/app.js` con stub leggeri V561, cosi' il browser non scarica piu' i moduli dedicati Calciomercato in apertura.
- Aggiunto guard runtime `FantaEngineCalciomercatoDisabledV561` in entrambe le app.
- Qualsiasi hash legacy `#calciomercato` o `#calciomercato-player-*` viene riportato a `#dashboard`.
- La Netlify Function `calciomercato-feed` restituisce una risposta JSON vuota `disabled-v561` senza fetch esterni.

## Cosa resta invariato

- News/comunicati interni Firebase.
- Share dinamico comunicati tramite Netlify Function `news-share`.
- Firebase Auth/Firestore.
- EmailJS.
- Admin.
- Dashboard Presidente.
- Area Squadra.
- Listone, Rose, Svincolati e Fantamercato interno.
- Bilanci, Competizioni, Regolamento, Archivio, Statistiche, Albo d'Oro.
- Preloader V560.
- Badge dispositivo V434.

## Nota di rollback

Il rollback e' possibile ripristinando i file modificati nella V560 e la precedente `netlify/functions/calciomercato-feed.js`. La patch V561 non elimina dati Calciomercato o asset archiviati: disattiva soltanto sezione, import, navigazione e funzione live.

## Verifica manuale

- Aprire `/zonaorientale/` da cache pulita.
- Verificare che Calciomercato non compaia in nav desktop e menu mobile Altro.
- Verificare che `#calciomercato` venga riportato a Dashboard.
- Verificare che la home si apra e diventi cliccabile senza attendere articoli.
- Ripetere su `/fantapetillomantramanager/`.
- Verificare che News, Listone, Fantamercato, Dashboard, Admin e Presidente restino raggiungibili.
